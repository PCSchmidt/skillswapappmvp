// cypress/e2e/pwa_update.cy.js
describe('Service Worker Update Notification', () => {
  beforeEach(() => {
    // Visit the base URL
    cy.visit('/');
    // Note: cy.unregisterServiceWorkers() is not a standard Cypress command.
    // Service worker cleanup between tests is complex. For now, we assume the browser/app handles it
    // or that tests are robust enough for existing SW states.
  });

  it('should show an update notification when a new service worker is installed and ready', () => {
    // Strategy:
    // 1. Ensure the initial service worker (sw.js) is loaded and active.
    // 2. Intercept future requests for sw.js.
    // 3. Trigger a service worker update check.
    // 4. When the app requests sw.js again (due to the update check),
    //    serve a modified version of sw.js to simulate an update.
    // 5. The app's registerServiceWorker.ts should detect this, install the new SW,
    //    and then call showUpdateNotification when the new SW is ready to take over.

    let serviceWorkerRegistration;

    // Phase 1: Initial load and get SW registration
    cy.window().then((win) => {
      return win.navigator.serviceWorker.getRegistration().then(reg => {
        serviceWorkerRegistration = reg;
        if (!reg || !reg.active) {
          cy.log('Initial service worker not found or not active. Waiting for it to activate.');
          // Wait for the service worker to become active if it's not already
          return win.navigator.serviceWorker.ready.then(readyReg => {
            serviceWorkerRegistration = readyReg;
            cy.log('Service worker is now ready.');
          });
        }
        cy.log('Initial service worker is active.');
      });
    });

    // Phase 2: Set up interception for sw.js to serve a new version
    // We need to know the exact URL of sw.js. Assuming it's '/sw.js'
    // We also need to ensure this interception only happens for the *update* check,
    // not the initial registration if that also happens on visit.
    // The `times: 1` option for cy.intercept might be tricky if the app has multiple fetches.

    // A simple way to make sw.js "new" is to append a comment with a timestamp.
    const newSwContent = `// New version: ${new Date().getTime()}\nconsole.log('This is service worker v2');`;

    cy.intercept('/sw.js', (req) => {
      // Let the first request (initial registration) pass through if not already active
      // This logic is complex because the initial registration might happen before intercept is set.
      // A safer bet is to ensure the SW is active (done above), then trigger update and intercept.

      // For this test, we assume any request to /sw.js *after* the initial one
      // is an update check or the browser trying to update.
      cy.log('Intercepted sw.js request. Serving new version.');
      req.reply({
        statusCode: 200,
        body: newSwContent,
        headers: {
          'Content-Type': 'application/javascript',
        },
      });
    }).as('swUpdate');


    // Phase 3: Trigger a service worker update check
    cy.window().then((win) => {
      if (serviceWorkerRegistration) {
        cy.log('Attempting to update service worker...');
        // Wrap the promise returned by update() to ensure Cypress waits for it.
        return new Cypress.Promise((resolve, reject) => {
          serviceWorkerRegistration.update()
            .then(() => {
              cy.log('Service worker update check successful.');
              resolve();
            })
            .catch((err) => {
              cy.log(`Service worker update failed: ${err.message}`);
              // Don't reject the Cypress promise, let the test proceed to check UI
              // as the update mechanism in the browser might still work.
              resolve();
            });
        });
      } else {
        cy.log('No service worker registration found to update.');
        // This test might not be meaningful if no SW is initially registered.
        // Skip further assertions or fail explicitly.
        // For now, let it proceed, assertions below will fail if notification doesn't appear.
      }
    });

    // Phase 4: Wait for the update to be processed and notification to appear
    // The registerServiceWorker.ts logic should eventually call showUpdateNotification.
    // We need to wait for the 'updatefound' event on the registration,
    // then for the new worker to install and become ready (controllerchange or waiting worker.postMessage).

    // Assertions for the notification UI
    cy.log('Waiting for update notification to appear...');
    cy.get('div[role="alertdialog"]#sw-update-notification', { timeout: 20000 }) // Increased timeout
      .should('be.visible')
      .within(() => {
        cy.contains('h3', 'App Update Available').should('be.visible');
        cy.contains('p', 'A new version of SkillSwap is available. Refresh to update.').should('be.visible');
        cy.get('button#sw-update-dismiss').should('be.visible').as('dismissButton');
        cy.get('button#sw-update-refresh').should('be.visible').as('refreshButton');
      });

    cy.log('Service worker update notification appeared successfully.');
  });

  it('should dismiss the update notification when "Dismiss" is clicked', () => {
    // This test depends on the notification being visible.
    // We'll try to trigger it again, similar to the first test.
    // In a real scenario, you might have a custom command or a more deterministic setup.
    const newSwContent = `// Dismiss test version: ${new Date().getTime()}\nconsole.log('Dismiss SW');`;
    cy.intercept('/sw.js', newSwContent).as('swForDismiss');

    cy.window().then(win => {
      win.navigator.serviceWorker.getRegistration().then(reg => reg && reg.update());
    });

    cy.get('div[role="alertdialog"]#sw-update-notification', { timeout: 20000 }).should('be.visible');
    cy.get('button#sw-update-dismiss').click();
    cy.get('div[role="alertdialog"]#sw-update-notification').should('not.exist');
    cy.log('Dismiss button test successful.');
  });

  it('should reload the page when "Refresh" is clicked', () => {
    // This test depends on the notification being visible.
    const newSwContent = `// Refresh test version: ${new Date().getTime()}\nconsole.log('Refresh SW');`;
    cy.intercept('/sw.js', newSwContent).as('swForRefresh');

    cy.window().then(win => {
      win.navigator.serviceWorker.getRegistration().then(reg => reg && reg.update());
    });

    cy.get('div[role="alertdialog"]#sw-update-notification', { timeout: 20000 }).should('be.visible');

    // Spy on window.location.reload
    cy.window().then((win) => {
      cy.spy(win.location, 'reload').as('reloadSpy');
    });

    cy.get('button#sw-update-refresh').click();
    // After clicking refresh, the SW should activate the new version and reload.
    // The reload means Cypress might lose connection or the page reloads.
    // We check if the spy was called. The reload itself will end the current test flow for this page.
    cy.get('@reloadSpy').should('have.been.calledOnce');
    cy.log('Refresh button test initiated reload.');
    // Note: Further assertions after a reload are tricky in the same test.
    // Usually, you'd test the state of the app *after* reload in a subsequent test or step.
  });
});
