/// <reference types="cypress" />

describe('Skill Search Functionality', () => {
  beforeEach(() => {
    // Login with test user before each test
    cy.supabaseLogin('test.user1@example.com', 'password123');
    
    // Mock API responses for skills
    cy.stubSkillsApi();
    
    // Visit the search page
    cy.visit('/search');
    
    // Wait for the skills to load
    cy.wait('@getSkills');
  });

  it('should display the search page with proper elements', () => {
    // Verify the search page has loaded correctly
    cy.get('[data-testid="search-page"]').should('be.visible');
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="filter-section"]').should('be.visible');
    cy.get('[data-testid="results-section"]').should('be.visible');
  });

  it('should display skills from the fixture', () => {
    // Verify the skills from our fixture are displayed
    cy.get('[data-testid="skill-card"]').should('have.length.at.least', 5);
    cy.get('[data-testid="skill-card"]').first().find('[data-testid="skill-name"]').should('not.be.empty');
  });

  it('should filter skills by search query', () => {
    // Type a search query
    cy.get('[data-testid="search-input"]').type('JavaScript');
    cy.get('[data-testid="search-button"]').click();
    
    // Wait for the search results to update
    cy.wait('@getSkills');
    
    // Verify filtered results
    cy.get('[data-testid="skill-card"]').should('have.length.at.least', 1);
    cy.get('[data-testid="skill-card"]').first().find('[data-testid="skill-name"]').should('contain', 'JavaScript');
  });

  it('should filter skills by category', () => {
    // Open category filter
    cy.get('[data-testid="category-filter"]').click();
    
    // Select the "Technology" category
    cy.get('[data-testid="category-option"]').contains('Technology').click();
    
    // Wait for the filtered results
    cy.wait('@getSkills');
    
    // Verify that all displayed skills belong to the Technology category
    cy.get('[data-testid="skill-card"]').each(($card) => {
      cy.wrap($card).find('[data-testid="skill-category"]').should('contain', 'Technology');
    });
  });

  it('should filter skills by popularity', () => {
    // Click on the sort dropdown
    cy.get('[data-testid="sort-dropdown"]').click();
    
    // Select sorting by most popular
    cy.get('[data-testid="sort-option"]').contains('Most Popular').click();
    
    // Wait for the sorted results
    cy.wait('@getSkills');
    
    // Get the popularity values of the first few skills
    const popularityValues = [];
    cy.get('[data-testid="skill-popularity"]').each(($el) => {
      // Extract numeric popularity values
      const popularity = parseInt($el.text().replace(/[^0-9]/g, ''));
      popularityValues.push(popularity);
    }).then(() => {
      // Verify the skills are sorted by popularity in descending order
      for (let i = 0; i < popularityValues.length - 1; i++) {
        expect(popularityValues[i]).to.be.at.least(popularityValues[i + 1]);
      }
    });
  });

  it('should allow toggling between skills offered and skills wanted', () => {
    // Initially showing all skills
    cy.get('[data-testid="skill-card"]').should('have.length.at.least', 5);
    
    // Switch to "Skills Offered" view
    cy.get('[data-testid="filter-toggle"]').contains('Skills Offered').click();
    cy.wait('@getSkills');
    
    // Verify we're now showing skills that people are offering
    cy.get('[data-testid="view-indicator"]').should('contain', 'Skills Offered');
    cy.get('[data-testid="skill-card"]').should('have.length.at.least', 1);
    
    // Switch to "Skills Wanted" view
    cy.get('[data-testid="filter-toggle"]').contains('Skills Wanted').click();
    cy.wait('@getSkills');
    
    // Verify we're now showing skills that people are wanting
    cy.get('[data-testid="view-indicator"]').should('contain', 'Skills Wanted');
    cy.get('[data-testid="skill-card"]').should('have.length.at.least', 1);
  });

  it('should display skill details when clicking on a skill card', () => {
    // Click on the first skill card
    cy.get('[data-testid="skill-card"]').first().click();
    
    // Verify we're on the skill details page
    cy.url().should('include', '/skills/');
    
    // Verify the skill details are displayed
    cy.get('[data-testid="skill-details"]').should('be.visible');
    cy.get('[data-testid="skill-name-header"]').should('be.visible');
    cy.get('[data-testid="skill-description"]').should('be.visible');
    cy.get('[data-testid="users-offering"]').should('be.visible');
    cy.get('[data-testid="users-wanting"]').should('be.visible');
  });

  it('should save search preferences for future visits', () => {
    // Apply some search filters
    cy.get('[data-testid="category-filter"]').click();
    cy.get('[data-testid="category-option"]').contains('Creative').click();
    cy.wait('@getSkills');
    
    // Sort by most recent
    cy.get('[data-testid="sort-dropdown"]').click();
    cy.get('[data-testid="sort-option"]').contains('Most Recent').click();
    cy.wait('@getSkills');
    
    // Navigate away from the page
    cy.visit('/dashboard');
    
    // Come back to the search page
    cy.visit('/search');
    cy.wait('@getSkills');
    
    // Verify our filters were saved
    cy.get('[data-testid="active-filters"]').should('contain', 'Creative');
    cy.get('[data-testid="current-sort"]').should('contain', 'Most Recent');
  });

  it('should support pagination of search results', () => {
    // Verify pagination controls exist
    cy.get('[data-testid="pagination-controls"]').should('be.visible');
    
    // Get the number of items on the first page
    let firstPageCount = 0;
    cy.get('[data-testid="skill-card"]').then($cards => {
      firstPageCount = $cards.length;
    });
    
    // Click to go to the second page
    cy.get('[data-testid="next-page"]').click();
    cy.wait('@getSkills');
    
    // Verify we're on page 2
    cy.get('[data-testid="current-page"]').should('contain', '2');
    
    // Verify the items on page 2 are different
    cy.get('[data-testid="skill-card"]').first().find('[data-testid="skill-name"]').then($name1 => {
      // Go back to first page
      cy.get('[data-testid="prev-page"]').click();
      cy.wait('@getSkills');
      
      // Compare first skill name with the one from second page
      cy.get('[data-testid="skill-card"]').first().find('[data-testid="skill-name"]').then($name2 => {
        expect($name1.text()).not.to.equal($name2.text());
      });
    });
  });

  it('should show SEO-friendly metadata', () => {
    // Check for title and meta tags
    cy.checkSeoMetadata();
  });
});
