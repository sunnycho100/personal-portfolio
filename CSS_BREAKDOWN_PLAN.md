# CSS Architecture Breakdown Plan

## Current State
- **App.css**: 1,703 lines - monolithic, difficult to maintain and debug

## Proposed Structure

```
src/
  styles/
    global/
      reset.css          # CSS resets and normalization
      variables.css      # CSS custom properties (design tokens)
      typography.css     # Font definitions, headings, text styles
    
    components/
      navigation/
        TopNav.css       # Top navigation bar
      
      sections/
        Hero.css         # Hero section with photo
        About.css        # About Me section
        Experience.css   # Experience section with tabs
        Skills.css       # Skills section with chips
        Activities.css   # Activities section
        More.css         # More About Me accordion
        Contact.css      # Contact section with icons
      
      books/
        BookCarousel.css # Book carousel (track, viewport, nav)
        BookCard.css     # Individual book cards and modal
      
      comments/
        CommentsSection.css  # Comments display and cards
        LeaveComment.css     # Comment input form
    
    utilities/
      animations.css     # Reveal animations, keyframes
      layout.css         # Container widths, centering, spacing
      darkmode.css       # Dark mode overrides
      github.css         # GitHub showcase grid
  
  App.css              # Root aggregator (imports only)
```

## File Responsibilities

### Global Layer
1. **reset.css**: Normalize browser defaults
2. **variables.css**: All CSS custom properties (colors, spacing, timing)
3. **typography.css**: Font families, heading styles, text utilities

### Component Layer
4. **TopNav.css**: Navigation bar, tabs, mobile menu
5. **Hero.css**: Hero section layout and photo
6. **About.css**: About Me text container
7. **Experience.css**: Experience section with tab switcher and timeline
8. **Skills.css**: Skill chips and grid layout
9. **Activities.css**: Activities section
10. **More.css**: Accordion/collapsible section
11. **Contact.css**: Contact icons and resume button
12. **BookCarousel.css**: Carousel mechanics, navigation buttons
13. **BookCard.css**: Book items, modals, delete buttons
14. **CommentsSection.css**: Comment cards and display grid
15. **LeaveComment.css**: Comment form and textarea

### Utility Layer
16. **animations.css**: Reveal effects, transitions, keyframes
17. **layout.css**: Container sizing, section spacing, centering
18. **darkmode.css**: All dark mode media queries
19. **github.css**: GitHub repositories showcase grid

## Benefits
- ✅ Faster debugging (isolated concerns)
- ✅ Better reusability
- ✅ Parallel development (team can work on different files)
- ✅ Easier testing and modification
- ✅ Clear mental model of app structure
- ✅ Smaller git diffs
- ✅ Component portability

## Implementation Steps
1. Create directory structure
2. Create individual CSS files
3. Move code from App.css to respective files
4. Update App.css to import all modules
5. Test thoroughly
6. Remove old App.css code once verified
