/**
 * TemplateService provides ready-made, professionally curated card layouts.
 * Demonstrates OOP: Factory Pattern, Data Abstraction.
 */
export class TemplateService {
  constructor() {
    this._templates = this._initTemplates();
  }

  getAllTemplates() {
    return [...this._templates];
  }

  getTemplatesByCategory(category) {
    if (!category || category === 'All') return this.getAllTemplates();
    return this._templates.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  getTemplateById(id) {
    return this._templates.find(t => t.id === id) || null;
  }

  _initTemplates() {
    return [
      {
        id: 'tmpl-botanical-birthday',
        title: 'Botanical Birthday',
        category: 'Birthday',
        occasion: 'Birthday',
        width: 1080,
        height: 1080,
        backgroundColor: '#FAF7F0',
        backgroundPattern: 'none',
        previewDesc: 'Exquisite watercolor floral corners, golden double frame, and Alex Brush calligraphy.',
        previewStyle: {
          bg: '#FAF7F0',
          textColor: '#A61E2D',
          accentColor: '#C6A15B',
          tagBg: 'rgba(166, 30, 45, 0.1)',
          tagColor: '#A61E2D'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'golden-double-frame',
            src: 'assets/illustrations/golden-double-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'watercolor-floral-corner-tl',
            src: 'assets/illustrations/watercolor-floral-corner.svg',
            x: 20,
            y: 20,
            width: 380,
            height: 380,
            zIndex: 2
          },
          {
            type: 'svg',
            svgKey: 'watercolor-floral-corner-br',
            src: 'assets/illustrations/watercolor-floral-corner.svg',
            x: 680,
            y: 680,
            width: 380,
            height: 380,
            rotation: 180,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'H A P P Y',
            fontFamily: 'Cormorant Garamond',
            fontSize: 32,
            fontWeight: '600',
            letterSpacing: 10,
            textAlign: 'center',
            color: '#81917A',
            x: 140,
            y: 380,
            width: 800,
            height: 48,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Birthday',
            fontFamily: 'Alex Brush',
            fontSize: 135,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            color: '#A61E2D',
            x: 140,
            y: 430,
            width: 800,
            height: 160,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'wishing you a year filled with light and joy',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 610,
            width: 800,
            height: 60,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-midnight-gold',
        title: 'Midnight Gold Birthday',
        category: 'Birthday',
        occasion: 'Birthday',
        width: 1080,
        height: 1080,
        backgroundColor: '#0D1117',
        backgroundPattern: 'none',
        previewDesc: 'Deep obsidian luxury background with luminous gold foil calligraphy and stardust.',
        previewStyle: {
          bg: '#0D1117',
          textColor: '#E8C988',
          accentColor: '#C6A15B',
          tagBg: 'rgba(232, 201, 136, 0.15)',
          tagColor: '#E8C988'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'golden-double-frame',
            src: 'assets/illustrations/golden-double-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament-tl',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 40,
            y: 40,
            width: 220,
            height: 220,
            zIndex: 2
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament-br',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 820,
            y: 820,
            width: 220,
            height: 220,
            rotation: 180,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'H A P P Y',
            fontFamily: 'Cormorant Garamond',
            fontSize: 32,
            fontWeight: '600',
            letterSpacing: 10,
            textAlign: 'center',
            color: '#C6A15B',
            x: 140,
            y: 380,
            width: 800,
            height: 48,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Birthday',
            fontFamily: 'Alex Brush',
            fontSize: 135,
            fontStyle: 'normal',
            textAlign: 'center',
            color: '#E8C988',
            x: 140,
            y: 430,
            width: 800,
            height: 160,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'A NIGHT OF CELEBRATION & WONDER',
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: 4,
            textAlign: 'center',
            color: '#FAF7F0',
            x: 140,
            y: 615,
            width: 800,
            height: 50,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-bday-bliss',
        title: 'Pastel Birthday Bliss',
        category: 'Birthday',
        occasion: 'Birthday',
        width: 1080,
        height: 1350,
        backgroundColor: '#FAF7F0',
        backgroundPattern: 'dots',
        previewDesc: 'Blush balloons, birthday cake illustration, and festive typography.',
        previewStyle: {
          bg: '#FAF7F0',
          textColor: '#A61E2D',
          accentColor: '#C6A15B',
          tagBg: 'rgba(166, 30, 45, 0.1)',
          tagColor: '#A61E2D'
        },
        elements: [
          {
            type: 'shape',
            shapeType: 'rectangle',
            x: 40,
            y: 40,
            width: 1000,
            height: 1270,
            stroke: '#C6A15B',
            strokeWidth: 2,
            dashArray: '8,4',
            fill: 'transparent'
          },
          {
            type: 'svg',
            svgKey: 'birthday-balloons',
            src: 'assets/illustrations/birthday-balloons.svg',
            x: 390,
            y: 110,
            width: 300,
            height: 360,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'HAPPY BIRTHDAY',
            fontFamily: 'Inter',
            fontSize: 24,
            fontWeight: '600',
            letterSpacing: 4,
            textAlign: 'center',
            color: '#A61E2D',
            x: 140,
            y: 500,
            width: 800,
            height: 45,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Wishing You A Day\nFilled With Pure Joy',
            fontFamily: 'Georgia',
            fontSize: 56,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#172033',
            x: 140,
            y: 570,
            width: 800,
            height: 150,
            zIndex: 3
          },
          {
            type: 'svg',
            svgKey: 'birthday-cake',
            src: 'assets/illustrations/birthday-cake.svg',
            x: 440,
            y: 750,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'May this year bring countless blessings,\nnew milestones, and endless happiness.',
            fontFamily: 'Georgia',
            fontSize: 28,
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 990,
            width: 800,
            height: 80,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-royal-wedding',
        title: 'Royal Heritage Wedding',
        category: 'Wedding',
        occasion: 'Wedding',
        width: 1080,
        height: 1080,
        backgroundColor: '#FCF9F4',
        backgroundPattern: 'none',
        previewDesc: 'Regal golden double frame, gold crest ornament, and Alex Brush wedding calligraphy.',
        previewStyle: {
          bg: '#FCF9F4',
          textColor: '#A61E2D',
          accentColor: '#C6A15B',
          tagBg: 'rgba(198, 161, 91, 0.2)',
          tagColor: '#8C6B2D'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'golden-double-frame',
            src: 'assets/illustrations/golden-double-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 440,
            y: 110,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'TOGETHER WITH THEIR FAMILIES',
            fontFamily: 'Cinzel',
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: 8,
            textAlign: 'center',
            color: '#8C4A42',
            x: 140,
            y: 350,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Royal Wedding',
            fontFamily: 'Alex Brush',
            fontSize: 125,
            fontStyle: 'normal',
            textAlign: 'center',
            color: '#A61E2D',
            x: 140,
            y: 410,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'REQUEST THE HONOR OF YOUR PRESENCE',
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: 5,
            textAlign: 'center',
            color: '#C6A15B',
            x: 140,
            y: 580,
            width: 800,
            height: 35,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'To celebrate a sacred bond of eternal love and devotion',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 630,
            width: 800,
            height: 50,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-eucalyptus-wreath',
        title: 'Botanical Garden Nuptials',
        category: 'Wedding',
        occasion: 'Wedding',
        width: 1080,
        height: 1080,
        backgroundColor: '#F5F7F4',
        backgroundPattern: 'none',
        previewDesc: 'Soft muted sage watercolor corners and romantic calligraphy.',
        previewStyle: {
          bg: '#F5F7F4',
          textColor: '#2D4030',
          accentColor: '#81917A',
          tagBg: 'rgba(129, 145, 122, 0.18)',
          tagColor: '#2D4030'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'watercolor-floral-corner-tl',
            src: 'assets/illustrations/watercolor-floral-corner.svg',
            x: 30,
            y: 30,
            width: 360,
            height: 360,
            zIndex: 2
          },
          {
            type: 'svg',
            svgKey: 'watercolor-floral-corner-br',
            src: 'assets/illustrations/watercolor-floral-corner.svg',
            x: 690,
            y: 690,
            width: 360,
            height: 360,
            rotation: 180,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'CELEBRATING THE UNION OF',
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: '600',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#81917A',
            x: 140,
            y: 370,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Forever & Always',
            fontFamily: 'Alex Brush',
            fontSize: 120,
            textAlign: 'center',
            color: '#2D4030',
            x: 140,
            y: 430,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'Two souls, one heart, and a timeless path forward',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 600,
            width: 800,
            height: 50,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-golden-anniversary',
        title: 'Golden Jubilee Anniversary',
        category: 'Anniversary',
        occasion: 'Anniversary',
        width: 1080,
        height: 1080,
        backgroundColor: '#11141E',
        backgroundPattern: 'none',
        previewDesc: 'Prestigious midnight obsidian background with golden geometric borders and foil script.',
        previewStyle: {
          bg: '#11141E',
          textColor: '#E8C988',
          accentColor: '#C6A15B',
          tagBg: 'rgba(232, 201, 136, 0.15)',
          tagColor: '#E8C988'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'geometric-frame',
            src: 'assets/illustrations/geometric-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 440,
            y: 110,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'GOLDEN JUBILEE CELEBRATION',
            fontFamily: 'Cinzel',
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: 8,
            textAlign: 'center',
            color: '#C6A15B',
            x: 140,
            y: 350,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Happy Anniversary',
            fontFamily: 'Alex Brush',
            fontSize: 125,
            textAlign: 'center',
            color: '#E8C988',
            x: 140,
            y: 410,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'A lifetime of cherished memories, unwavering devotion, and timeless grace',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#FAF7F0',
            x: 140,
            y: 590,
            width: 800,
            height: 60,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-elegant-love',
        title: 'Rose Quartz Romance',
        category: 'Anniversary',
        occasion: 'Anniversary',
        width: 1080,
        height: 1350,
        backgroundColor: '#F8E7E7',
        backgroundPattern: 'none',
        previewDesc: 'Warm blush stationery with delicate gold flourishes and botanical accents.',
        previewStyle: {
          bg: '#F8E7E7',
          textColor: '#641E32',
          accentColor: '#A61E2D',
          tagBg: 'rgba(166, 30, 45, 0.1)',
          tagColor: '#A61E2D'
        },
        elements: [
          {
            type: 'shape',
            shapeType: 'rectangle',
            x: 50,
            y: 50,
            width: 980,
            height: 1250,
            stroke: '#C6A15B',
            strokeWidth: 1.5,
            fill: 'transparent'
          },
          {
            type: 'shape',
            shapeType: 'heart',
            x: 465,
            y: 160,
            width: 150,
            height: 140,
            stroke: '#A61E2D',
            strokeWidth: 2,
            fill: 'rgba(166, 30, 45, 0.08)',
            zIndex: 2
          },
          {
            type: 'text',
            text: 'HAPPY ANNIVERSARY',
            fontFamily: 'Inter',
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: 5,
            textAlign: 'center',
            color: '#8C4A42',
            x: 140,
            y: 350,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Celebrating A Beautiful\nJourney Together',
            fontFamily: 'Georgia',
            fontSize: 56,
            textAlign: 'center',
            color: '#641E32',
            x: 140,
            y: 430,
            width: 800,
            height: 150,
            zIndex: 3
          },
          {
            type: 'svg',
            svgKey: 'botanical-sidebar',
            src: 'assets/illustrations/botanical-sidebar.svg',
            x: 600,
            y: 620,
            width: 380,
            height: 600,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'To love that grows stronger,\nwarmer, and more inspiring\nwith every passing day.',
            fontFamily: 'Georgia',
            fontSize: 30,
            fontStyle: 'italic',
            textAlign: 'left',
            color: '#172033',
            x: 140,
            y: 720,
            width: 480,
            height: 160,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Forever & Always',
            fontFamily: 'Georgia',
            fontSize: 26,
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#A61E2D',
            x: 140,
            y: 930,
            width: 400,
            height: 45,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-diwali-lights',
        title: 'Diwali Festival of Lights',
        category: 'Festivals',
        occasion: 'Festivals',
        width: 1080,
        height: 1080,
        backgroundColor: '#2A0E14',
        backgroundPattern: 'none',
        previewDesc: 'Radiant terracotta maroon palette with festive diya lamp and gold sparks.',
        previewStyle: {
          bg: '#2A0E14',
          textColor: '#FFD166',
          accentColor: '#C6A15B',
          tagBg: 'rgba(255, 209, 102, 0.15)',
          tagColor: '#FFD166'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'golden-double-frame',
            src: 'assets/illustrations/golden-double-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'festive-lamp',
            src: 'assets/illustrations/festive-lamp.svg',
            x: 440,
            y: 110,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'JOYOUS FESTIVAL OF LIGHTS',
            fontFamily: 'Cinzel',
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#E8C988',
            x: 140,
            y: 350,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Shubh Diwali',
            fontFamily: 'Alex Brush',
            fontSize: 130,
            textAlign: 'center',
            color: '#FFD166',
            x: 140,
            y: 410,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'May divine light and prosperity grace your home with joy and good health',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#FAF7F0',
            x: 140,
            y: 590,
            width: 800,
            height: 60,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-new-year-celebration',
        title: 'New Year Golden Glow',
        category: 'Festivals',
        occasion: 'Festivals',
        width: 1080,
        height: 1080,
        backgroundColor: '#0B132B',
        backgroundPattern: 'none',
        previewDesc: 'Midnight sapphire background with gold filigree and hopeful new year wishes.',
        previewStyle: {
          bg: '#0B132B',
          textColor: '#E8C988',
          accentColor: '#C6A15B',
          tagBg: 'rgba(232, 201, 136, 0.15)',
          tagColor: '#E8C988'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'geometric-frame',
            src: 'assets/illustrations/geometric-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 440,
            y: 110,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'A FRESH HORIZON AWAITS',
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: '600',
            letterSpacing: 8,
            textAlign: 'center',
            color: '#C6A15B',
            x: 140,
            y: 350,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Happy New Year',
            fontFamily: 'Alex Brush',
            fontSize: 125,
            textAlign: 'center',
            color: '#E8C988',
            x: 140,
            y: 410,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'Wishing you 365 days of light, laughter, success, and discovery',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#FAF7F0',
            x: 140,
            y: 590,
            width: 800,
            height: 60,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-congrats-triumph',
        title: 'Milestone Triumph',
        category: 'Congratulations',
        occasion: 'Congratulations',
        width: 1080,
        height: 1080,
        backgroundColor: '#FAF7F0',
        backgroundPattern: 'none',
        previewDesc: 'Prestigious gold and floral achievement honor.',
        previewStyle: {
          bg: '#FAF7F0',
          textColor: '#A61E2D',
          accentColor: '#C6A15B',
          tagBg: 'rgba(198, 161, 91, 0.2)',
          tagColor: '#8C6B2D'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'floral-frame',
            src: 'assets/illustrations/floral-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 440,
            y: 120,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'HEARTFELT CONGRATULATIONS',
            fontFamily: 'Cinzel',
            fontSize: 22,
            fontWeight: 'bold',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#C6A15B',
            x: 140,
            y: 360,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Grand Achievement',
            fontFamily: 'Alex Brush',
            fontSize: 120,
            textAlign: 'center',
            color: '#A61E2D',
            x: 140,
            y: 420,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'Your dedication, perseverance, and passion have earned extraordinary success',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 600,
            width: 800,
            height: 60,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-grand-achievement',
        title: 'Academic & Career Honors',
        category: 'Congratulations',
        occasion: 'Congratulations',
        width: 1080,
        height: 1350,
        backgroundColor: '#0E1E38',
        backgroundPattern: 'none',
        previewDesc: 'Deep sapphire navy with golden geometric laurels and distinction.',
        previewStyle: {
          bg: '#0E1E38',
          textColor: '#E8C988',
          accentColor: '#C6A15B',
          tagBg: 'rgba(232, 201, 136, 0.15)',
          tagColor: '#E8C988'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'geometric-frame',
            src: 'assets/illustrations/geometric-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1270,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'gold-ornament',
            src: 'assets/illustrations/gold-ornament.svg',
            x: 440,
            y: 160,
            width: 200,
            height: 200,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'HONORS & DISTINCTION',
            fontFamily: 'Cinzel',
            fontSize: 24,
            fontWeight: '600',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#C6A15B',
            x: 140,
            y: 400,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Celebrating Excellence',
            fontFamily: 'Georgia',
            fontSize: 54,
            textAlign: 'center',
            color: '#FAF7F0',
            x: 140,
            y: 470,
            width: 800,
            height: 140,
            zIndex: 3
          },
          {
            type: 'shape',
            shapeType: 'line',
            x: 390,
            y: 650,
            width: 300,
            height: 2,
            stroke: '#C6A15B',
            strokeWidth: 2,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'This milestone is a true testament to your resilience,\npassion, and relentless hard work.\nHere’s to the exciting chapters ahead!',
            fontFamily: 'Georgia',
            fontSize: 28,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#E8E2D8',
            x: 140,
            y: 720,
            width: 800,
            height: 140,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-thank-you',
        title: 'Gratitude & Grace',
        category: 'Thank You',
        occasion: 'Thank You',
        width: 1080,
        height: 1080,
        backgroundColor: '#FAF7F0',
        backgroundPattern: 'none',
        previewDesc: 'Warm ivory botanical stationery with delicate calligraphy.',
        previewStyle: {
          bg: '#FAF7F0',
          textColor: '#641E32',
          accentColor: '#81917A',
          tagBg: 'rgba(129, 145, 122, 0.15)',
          tagColor: '#2D4030'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'golden-double-frame',
            src: 'assets/illustrations/golden-double-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'svg',
            svgKey: 'botanical-corners',
            src: 'assets/illustrations/botanical-corners.svg',
            x: 40,
            y: 40,
            width: 220,
            height: 220,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'WITH SINCERE APPRECIATION',
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: '600',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#81917A',
            x: 140,
            y: 360,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Thank You',
            fontFamily: 'Alex Brush',
            fontSize: 135,
            textAlign: 'center',
            color: '#641E32',
            x: 140,
            y: 420,
            width: 800,
            height: 160,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'For your kindness, thoughtful support, and generous spirit',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 610,
            width: 800,
            height: 50,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-best-friends',
        title: 'Friendship Forever',
        category: 'Friendship',
        occasion: 'Friendship',
        width: 1080,
        height: 1080,
        backgroundColor: '#FDF2F2',
        backgroundPattern: 'none',
        previewDesc: 'Warm blush and rose gold celebration of heartfelt bond.',
        previewStyle: {
          bg: '#FDF2F2',
          textColor: '#A61E2D',
          accentColor: '#C6A15B',
          tagBg: 'rgba(166, 30, 45, 0.1)',
          tagColor: '#A61E2D'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'golden-double-frame',
            src: 'assets/illustrations/golden-double-frame.svg',
            x: 40,
            y: 40,
            width: 1000,
            height: 1000,
            zIndex: 1
          },
          {
            type: 'shape',
            shapeType: 'heart',
            x: 515,
            y: 160,
            width: 50,
            height: 45,
            stroke: '#A61E2D',
            fill: '#A61E2D',
            strokeWidth: 1,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'TO MY DEAREST FRIEND',
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: '600',
            letterSpacing: 6,
            textAlign: 'center',
            color: '#A61E2D',
            x: 140,
            y: 360,
            width: 800,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Side by Side',
            fontFamily: 'Alex Brush',
            fontSize: 125,
            textAlign: 'center',
            color: '#641E32',
            x: 140,
            y: 420,
            width: 800,
            height: 150,
            zIndex: 4
          },
          {
            type: 'text',
            text: 'Or miles apart, true friendship is always held close at heart',
            fontFamily: 'Cormorant Garamond',
            fontSize: 26,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#667085',
            x: 140,
            y: 600,
            width: 800,
            height: 50,
            zIndex: 3
          }
        ]
      },
      {
        id: 'tmpl-new-beginnings',
        title: 'Fresh Horizons',
        category: 'New Beginnings',
        occasion: 'New Beginnings',
        width: 1080,
        height: 1350,
        backgroundColor: '#F7F5F2',
        backgroundPattern: 'none',
        previewDesc: 'Soft sage and warm ivory harmony for fresh horizons.',
        previewStyle: {
          bg: '#F7F5F2',
          textColor: '#172033',
          accentColor: '#81917A',
          tagBg: 'rgba(129, 145, 122, 0.15)',
          tagColor: '#2D4030'
        },
        elements: [
          {
            type: 'svg',
            svgKey: 'botanical-sidebar',
            src: 'assets/illustrations/botanical-sidebar.svg',
            x: 700,
            y: 80,
            width: 320,
            height: 540,
            zIndex: 2
          },
          {
            type: 'text',
            text: 'A FRESH CHAPTER AWAITS',
            fontFamily: 'Inter',
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: 4,
            textAlign: 'left',
            color: '#81917A',
            x: 140,
            y: 360,
            width: 700,
            height: 40,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Embrace The Journey,\nTrust The Magic',
            fontFamily: 'Georgia',
            fontSize: 58,
            textAlign: 'left',
            color: '#172033',
            x: 140,
            y: 430,
            width: 700,
            height: 150,
            zIndex: 3
          },
          {
            type: 'shape',
            shapeType: 'line',
            x: 140,
            y: 620,
            width: 180,
            height: 2,
            stroke: '#C6A15B',
            strokeWidth: 2,
            zIndex: 3
          },
          {
            type: 'text',
            text: 'Every new beginning starts with courage.\nWishing you boundless courage, joy, and triumph\nas you embark on this exciting new adventure.',
            fontFamily: 'Georgia',
            fontSize: 28,
            fontStyle: 'italic',
            textAlign: 'left',
            color: '#667085',
            x: 140,
            y: 680,
            width: 700,
            height: 140,
            zIndex: 3
          }
        ]
      }
    ];
  }
}
