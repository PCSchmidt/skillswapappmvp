/// <reference types="cypress" />

describe('Skill Management Functionality', () => {
  beforeEach(() => {
    // Login with test user before each test
    cy.supabaseLogin('test.user1@example.com', 'password123');
    
    // Mock API responses for skills
    cy.stubUserSkillsApi();
    
    // Visit the profile page which contains skill management section
    cy.visit('/profile');
    
    // Wait for the user skills to load
    cy.wait('@getUserSkills');
  });

  it('should display the user profile page with skill sections', () => {
    // Verify the profile page has loaded correctly
    cy.get('[data-testid="profile-page"]').should('be.visible');
    cy.get('[data-testid="offered-skills-section"]').should('be.visible');
    cy.get('[data-testid="wanted-skills-section"]').should('be.visible');
    cy.get('[data-testid="add-skill-button"]').should('be.visible');
  });

  it('should display the user\'s skills from the fixture', () => {
    // Verify the skills from our fixture are displayed
    cy.get('[data-testid="offered-skills-section"]').find('[data-testid="skill-item"]').should('have.length.at.least', 2);
    cy.get('[data-testid="wanted-skills-section"]').find('[data-testid="skill-item"]').should('have.length.at.least', 2);
  });

  it('should open the add skill form', () => {
    // Click the add skill button
    cy.get('[data-testid="add-skill-button"]').click();
    
    // Verify the add skill form is displayed
    cy.get('[data-testid="skill-form"]').should('be.visible');
    cy.get('[data-testid="skill-form-title"]').should('contain', 'Add New Skill');
  });

  it('should add a new skill offered', () => {
    // Mock the add skill API response
    cy.intercept('POST', '**/api/skills', {
      statusCode: 200,
      body: {
        success: true,
        skill: {
          id: 'new-skill-1',
          name: 'React Development',
          category: 'Technology',
          proficiency: 'Advanced',
          type: 'offered',
          description: 'Building modern web applications with React.',
          yearsExperience: 3,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }).as('addSkill');
    
    // Click the add skill button
    cy.get('[data-testid="add-skill-button"]').click();
    
    // Fill out the skill form
    cy.get('[data-testid="skill-name-input"]').type('React Development');
    cy.get('[data-testid="skill-category-select"]').select('Technology');
    cy.get('[data-testid="skill-proficiency-select"]').select('Advanced');
    cy.get('[data-testid="skill-type-offered"]').check();
    cy.get('[data-testid="skill-description-input"]').type('Building modern web applications with React.');
    cy.get('[data-testid="skill-years-input"]').type('3');
    
    // Submit the form
    cy.get('[data-testid="submit-skill-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@addSkill');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Skill added successfully');
    
    // Verify the new skill appears in the list
    cy.get('[data-testid="offered-skills-section"]').find('[data-testid="skill-item"]')
      .should('contain', 'React Development');
  });

  it('should add a new skill wanted', () => {
    // Mock the add skill API response
    cy.intercept('POST', '**/api/skills', {
      statusCode: 200,
      body: {
        success: true,
        skill: {
          id: 'new-skill-2',
          name: 'Spanish Language',
          category: 'Languages',
          proficiency: 'Beginner',
          type: 'wanted',
          description: 'I want to learn Spanish for international travel.',
          yearsExperience: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }).as('addSkill');
    
    // Click the add skill button
    cy.get('[data-testid="add-skill-button"]').click();
    
    // Fill out the skill form
    cy.get('[data-testid="skill-name-input"]').type('Spanish Language');
    cy.get('[data-testid="skill-category-select"]').select('Languages');
    cy.get('[data-testid="skill-proficiency-select"]').select('Beginner');
    cy.get('[data-testid="skill-type-wanted"]').check();
    cy.get('[data-testid="skill-description-input"]').type('I want to learn Spanish for international travel.');
    
    // Submit the form
    cy.get('[data-testid="submit-skill-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@addSkill');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Skill added successfully');
    
    // Verify the new skill appears in the list
    cy.get('[data-testid="wanted-skills-section"]').find('[data-testid="skill-item"]')
      .should('contain', 'Spanish Language');
  });

  it('should validate required fields in the skill form', () => {
    // Click the add skill button
    cy.get('[data-testid="add-skill-button"]').click();
    
    // Try to submit the form without filling in required fields
    cy.get('[data-testid="submit-skill-button"]').click();
    
    // Verify validation messages
    cy.get('[data-testid="skill-name-error"]').should('be.visible');
    cy.get('[data-testid="skill-category-error"]').should('be.visible');
    cy.get('[data-testid="skill-type-error"]').should('be.visible');
  });

  it('should edit an existing skill', () => {
    // Get the first skill in the offered section
    cy.get('[data-testid="offered-skills-section"]').find('[data-testid="skill-item"]').first().as('targetSkill');
    
    // Click the edit button for the skill
    cy.get('@targetSkill').find('[data-testid="edit-skill-button"]').click();
    
    // Verify the edit form has the current values
    cy.get('[data-testid="skill-form"]').should('be.visible');
    cy.get('[data-testid="skill-form-title"]').should('contain', 'Edit Skill');
    
    // Mock the update skill API response
    cy.intercept('PUT', '**/api/skills/*', {
      statusCode: 200,
      body: {
        success: true,
        skill: {
          id: 'skill-1',
          name: 'JavaScript Programming (Updated)',
          category: 'Technology',
          proficiency: 'Expert',
          type: 'offered',
          description: 'Updated description with advanced ES6+ features and React integration.',
          yearsExperience: 5,
          isActive: true,
          updatedAt: new Date().toISOString()
        }
      }
    }).as('updateSkill');
    
    // Update the skill details
    cy.get('[data-testid="skill-name-input"]').clear().type('JavaScript Programming (Updated)');
    cy.get('[data-testid="skill-proficiency-select"]').select('Expert');
    cy.get('[data-testid="skill-description-input"]').clear()
      .type('Updated description with advanced ES6+ features and React integration.');
    cy.get('[data-testid="skill-years-input"]').clear().type('5');
    
    // Submit the form
    cy.get('[data-testid="submit-skill-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@updateSkill');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Skill updated successfully');
    
    // Verify the updated skill appears in the list
    cy.get('[data-testid="offered-skills-section"]').find('[data-testid="skill-item"]')
      .should('contain', 'JavaScript Programming (Updated)')
      .and('contain', 'Expert');
  });

  it('should deactivate a skill', () => {
    // Get the first skill in the wanted section
    cy.get('[data-testid="wanted-skills-section"]').find('[data-testid="skill-item"]').first().as('targetSkill');
    
    // Store the skill name before deactivating
    cy.get('@targetSkill').find('[data-testid="skill-name"]').invoke('text').as('skillName');
    
    // Mock the deactivate skill API response
    cy.intercept('PUT', '**/api/skills/*/deactivate', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Skill deactivated successfully'
      }
    }).as('deactivateSkill');
    
    // Click the deactivate button
    cy.get('@targetSkill').find('[data-testid="deactivate-skill-button"]').click();
    
    // Confirm deactivation
    cy.get('[data-testid="confirm-action-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@deactivateSkill');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Skill deactivated');
    
    // Verify the skill is now in the inactive list
    cy.get('[data-testid="show-inactive-skills-button"]').click();
    cy.get('@skillName').then((name) => {
      cy.get('[data-testid="inactive-skills-section"]').should('contain', name);
    });
  });

  it('should reactivate an inactive skill', () => {
    // Show inactive skills
    cy.get('[data-testid="show-inactive-skills-button"]').click();
    
    // Get the first inactive skill
    cy.get('[data-testid="inactive-skills-section"]').find('[data-testid="skill-item"]').first().as('inactiveSkill');
    
    // Store the skill name before reactivating
    cy.get('@inactiveSkill').find('[data-testid="skill-name"]').invoke('text').as('skillName');
    
    // Mock the reactivate skill API response
    cy.intercept('PUT', '**/api/skills/*/activate', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Skill activated successfully'
      }
    }).as('activateSkill');
    
    // Click the reactivate button
    cy.get('@inactiveSkill').find('[data-testid="activate-skill-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@activateSkill');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Skill activated');
    
    // Verify the skill moves back to the appropriate active section
    cy.get('@skillName').then((name) => {
      cy.get('[data-testid="offered-skills-section"]').find('[data-testid="skill-item"]').should('contain', name);
    });
  });

  it('should delete a skill', () => {
    // Get the last skill in the wanted section
    cy.get('[data-testid="wanted-skills-section"]').find('[data-testid="skill-item"]').last().as('targetSkill');
    
    // Store the skill name before deleting
    cy.get('@targetSkill').find('[data-testid="skill-name"]').invoke('text').as('skillName');
    
    // Mock the delete skill API response
    cy.intercept('DELETE', '**/api/skills/*', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Skill deleted successfully'
      }
    }).as('deleteSkill');
    
    // Click the delete button
    cy.get('@targetSkill').find('[data-testid="delete-skill-button"]').click();
    
    // Confirm deletion
    cy.get('[data-testid="confirm-delete-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@deleteSkill');
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
      .and('contain', 'Skill deleted');
    
    // Verify the skill no longer appears in the list
    cy.get('@skillName').then((name) => {
      cy.get('[data-testid="wanted-skills-section"]').should('not.contain', name);
    });
  });

  it('should show a confirmation dialog for destructive actions', () => {
    // Get a skill to delete
    cy.get('[data-testid="wanted-skills-section"]').find('[data-testid="skill-item"]').first().as('targetSkill');
    
    // Click the delete button
    cy.get('@targetSkill').find('[data-testid="delete-skill-button"]').click();
    
    // Verify confirmation dialog appears
    cy.get('[data-testid="confirmation-dialog"]').should('be.visible')
      .and('contain', 'Are you sure you want to delete this skill?');
    
    // Cancel the deletion
    cy.get('[data-testid="cancel-button"]').click();
    
    // Verify the dialog is dismissed and skill remains
    cy.get('[data-testid="confirmation-dialog"]').should('not.exist');
    cy.get('@targetSkill').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Mock a failed API request
    cy.intercept('POST', '**/api/skills', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Server error occurred'
      }
    }).as('addSkillError');
    
    // Click the add skill button
    cy.get('[data-testid="add-skill-button"]').click();
    
    // Fill out the skill form
    cy.get('[data-testid="skill-name-input"]').type('Test Skill');
    cy.get('[data-testid="skill-category-select"]').select('Technology');
    cy.get('[data-testid="skill-proficiency-select"]').select('Intermediate');
    cy.get('[data-testid="skill-type-offered"]').check();
    cy.get('[data-testid="skill-description-input"]').type('This is a test skill.');
    
    // Submit the form
    cy.get('[data-testid="submit-skill-button"]').click();
    
    // Wait for the API request to complete
    cy.wait('@addSkillError');
    
    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible')
      .and('contain', 'Server error occurred');
    
    // Verify the form is still open
    cy.get('[data-testid="skill-form"]').should('be.visible');
  });

  it('should allow searching and filtering user skills', () => {
    // Type in the search box
    cy.get('[data-testid="skill-search-input"]').type('Java');
    
    // Verify filtered results
    cy.get('[data-testid="skill-item"]').each(($skill) => {
      cy.wrap($skill).find('[data-testid="skill-name"]').should('contain', 'Java');
    });
    
    // Clear search and filter by category
    cy.get('[data-testid="skill-search-input"]').clear();
    cy.get('[data-testid="category-filter"]').select('Technology');
    
    // Verify filtered results
    cy.get('[data-testid="skill-item"]').each(($skill) => {
      cy.wrap($skill).find('[data-testid="skill-category"]').should('contain', 'Technology');
    });
  });
});
