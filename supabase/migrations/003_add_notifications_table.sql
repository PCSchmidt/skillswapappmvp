-- Create notifications table for user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'trade_proposal', 'message', 'rating', etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link TEXT, -- URL or path to relevant page
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ, -- Optional expiration date
    metadata JSONB, -- Additional context-specific data
    priority VARCHAR(20) DEFAULT 'normal' -- 'low', 'normal', 'high', 'urgent'
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON public.notifications(type);

-- Add security policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Only the system can insert notifications (using service role)
-- But we'll add another policy for testing purposes
CREATE POLICY "Users can insert notifications for development" ON public.notifications 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own notifications (primarily for marking as read)
CREATE POLICY "Users can update their own notifications" ON public.notifications 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can only delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON public.notifications 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Add function to mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true
    WHERE id = p_notification_id AND auth.uid() = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true
    WHERE user_id = auth.uid() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to delete notifications older than a specified number of days
-- This would typically be called by a scheduled job
CREATE OR REPLACE FUNCTION public.delete_old_notifications(p_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM public.notifications
        WHERE created_at < (now() - (p_days || ' days')::INTERVAL)
        AND (is_read = true OR expires_at < now())
        RETURNING id
    )
    SELECT count(*) INTO v_count FROM deleted;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for common notification events

-- Trade proposal notification
CREATE OR REPLACE FUNCTION public.notify_trade_proposal()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create notification for the receiver
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        content,
        link,
        metadata
    )
    VALUES (
        NEW.receiver_id,
        'trade_proposal',
        'New Trade Proposal',
        'You have received a new trade proposal.',
        '/trades/' || NEW.id,
        jsonb_build_object(
            'trade_id', NEW.id,
            'proposer_id', NEW.proposer_id,
            'skill_offered_id', NEW.skill_offered_id,
            'skill_requested_id', NEW.skill_requested_id
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_trade_proposal
AFTER INSERT ON public.trades
FOR EACH ROW
WHEN (NEW.status = 'proposed')
EXECUTE FUNCTION public.notify_trade_proposal();

-- Trade status change notification
CREATE OR REPLACE FUNCTION public.notify_trade_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Don't notify on initial creation
    IF TG_OP = 'INSERT' THEN
        RETURN NEW;
    END IF;
    
    -- Only notify on status change
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;
    
    -- Determine user to notify (the other party)
    -- For trade acceptance/rejection, notify the proposer
    -- For completion, notify both parties
    
    -- Notify proposer
    IF NEW.status IN ('accepted', 'declined', 'completed', 'cancelled') THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            content,
            link,
            metadata
        )
        VALUES (
            NEW.proposer_id,
            'trade_status_' || NEW.status,
            'Trade ' || initcap(NEW.status),
            CASE 
                WHEN NEW.status = 'accepted' THEN 'Your trade proposal has been accepted!'
                WHEN NEW.status = 'declined' THEN 'Your trade proposal has been declined.'
                WHEN NEW.status = 'completed' THEN 'Your trade has been marked as completed.'
                WHEN NEW.status = 'cancelled' THEN 'Your trade has been cancelled.'
                ELSE 'Your trade status has changed to ' || NEW.status || '.'
            END,
            '/trades/' || NEW.id,
            jsonb_build_object(
                'trade_id', NEW.id,
                'new_status', NEW.status,
                'old_status', OLD.status
            )
        );
    END IF;
    
    -- Notify receiver for completed trades
    IF NEW.status = 'completed' THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            content,
            link,
            metadata
        )
        VALUES (
            NEW.receiver_id,
            'trade_status_completed',
            'Trade Completed',
            'Your trade has been marked as completed.',
            '/trades/' || NEW.id,
            jsonb_build_object(
                'trade_id', NEW.id,
                'new_status', NEW.status,
                'old_status', OLD.status
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_trade_status_change
AFTER UPDATE ON public.trades
FOR EACH ROW
EXECUTE FUNCTION public.notify_trade_status_change();

-- New message notification
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for the receiver
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        content,
        link,
        metadata,
        priority
    )
    VALUES (
        NEW.receiver_id,
        'new_message',
        'New Message',
        substring(NEW.content from 1 for 100) || CASE WHEN length(NEW.content) > 100 THEN '...' ELSE '' END,
        CASE 
            WHEN NEW.trade_id IS NOT NULL THEN '/messages/' || NEW.trade_id
            ELSE '/messages'
        END,
        jsonb_build_object(
            'message_id', NEW.id,
            'sender_id', NEW.sender_id,
            'trade_id', NEW.trade_id
        ),
        'high'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_message();

-- New rating notification
CREATE OR REPLACE FUNCTION public.notify_new_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for the ratee
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        content,
        link,
        metadata
    )
    VALUES (
        NEW.ratee_id,
        'new_rating',
        'New Rating Received',
        'You have received a new ' || NEW.rating_score || '-star rating.',
        '/ratings/' || NEW.trade_id,
        jsonb_build_object(
            'rating_id', NEW.id,
            'rater_id', NEW.rater_id,
            'rating_score', NEW.rating_score,
            'trade_id', NEW.trade_id
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_new_rating
AFTER INSERT ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_rating();

-- Add notification count to user profile (for badge display)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS unread_notification_count INTEGER DEFAULT 0;

-- Function to update notification count
CREATE OR REPLACE FUNCTION public.update_notification_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the user's unread notification count
    IF TG_OP = 'INSERT' AND NEW.is_read = false THEN
        -- Increment on new unread notification
        UPDATE public.users
        SET unread_notification_count = unread_notification_count + 1
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.is_read = true AND OLD.is_read = false THEN
        -- Decrement when marking as read
        UPDATE public.users
        SET unread_notification_count = GREATEST(0, unread_notification_count - 1)
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' AND OLD.is_read = false THEN
        -- Decrement when deleting unread
        UPDATE public.users
        SET unread_notification_count = GREATEST(0, unread_notification_count - 1)
        WHERE id = OLD.user_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_notification_count
AFTER INSERT OR UPDATE OR DELETE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_notification_count();

-- Function to recalculate notification count (for fixing inconsistencies)
CREATE OR REPLACE FUNCTION public.recalculate_notification_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users
    SET unread_notification_count = (
        SELECT count(*)
        FROM public.notifications
        WHERE user_id = p_user_id AND is_read = false
    )
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
