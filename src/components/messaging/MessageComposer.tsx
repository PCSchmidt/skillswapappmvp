import React from 'react';

interface MessageComposerProps {
  tradeId?: string;
  onSend?: (message: string) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = () => <div>MessageComposer placeholder</div>;
export default MessageComposer;
