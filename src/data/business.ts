export const categories = [
  {
    slug: 'apparel' as const, name: 'Apparel & fashion', short: 'Apparel', image: 'apparel',
    imageAlt: 'Illustrative apparel warehouse intake with folded garments, bulk cartons and tall stocked pallet racks',
    title: 'A fresh start for your surplus apparel.',
    description: 'Sell bulk apparel stocklots, end-of-season garments, excess size runs and damaged-label stock to SR Infotech. Pickup across India.',
    intro: 'SR Infotech buys surplus apparel, end-of-season garments and return stocklots from brands, retailers and ecommerce businesses across India, with our own pickup logistics.',
    types: ['End-of-season collections', 'Overstock & excess size runs', 'Discontinued styles', 'Damaged-label stock', 'Customer return lots'],
    details: ['Style or SKU, sizes and colour mix', 'Quantity by size and condition', 'Tag and label condition', 'Stock location and representative photos'],
    note: 'A label issue and a garment defect are different things. Share both clearly so the lot can be assessed on its own merits.',
    faqs: [
      { question: 'What apparel stocklots can I sell to SR Infotech?', answer: 'Submit end-of-season garments, overstock, discontinued styles, damaged-label inventory or customer return lots for review. Include style, size, colour, quantity and known condition.' },
      { question: 'Can I submit a mixed size or colour lot?', answer: 'Yes. Share the available size and colour breakdown, along with the quantities and condition. We assess the commercial fit of the actual lot; an enquiry does not need a perfectly balanced size run.' },
    ],
  },
  {
    slug: 'home-kitchen' as const, name: 'Home & kitchen', short: 'Home & kitchen', image: 'home-kitchen',
    imageAlt: 'Illustrative kitchenware warehouse with cookware, open master cartons and pallet loads beneath tall racks',
    title: 'Make space for the next best seller.',
    description: 'Sell surplus home and kitchen inventory in bulk. SR Infotech buys household goods, kitchenware and return lots with pan-India pickup.',
    intro: 'SR Infotech buys bulk surplus home and kitchen inventory from brands and ecommerce businesses across India. Share your kitchenware, home essentials, discontinued ranges or return lots for review.',
    types: ['Kitchenware & cookware', 'Home essentials & furnishings', 'Discontinued product ranges', 'Packaging-damaged products', 'Overstock & return lots'],
    details: ['Product description, model and quantity', 'Materials, dimensions and set contents', 'Packaging, breakage or missing parts', 'Stock location and representative photos'],
    note: 'Identify incomplete sets and fragile items separately. Packaging damage should be described independently from damage to the product itself.',
    faqs: [
      { question: 'What home and kitchen surplus do you consider?', answer: 'We consider bulk kitchenware, cookware, home essentials and furnishings, including overstock, discontinued ranges and return lots. Share the product mix, quantities, known condition and location.' },
      { question: 'How should I describe incomplete or packaging-damaged sets?', answer: 'List the items in each set, identify missing or broken pieces and describe packaging damage separately from product damage. Photos and a clear unit count help us review the lot.' },
    ],
  },
  {
    slug: 'electronics' as const, name: 'Electronics', short: 'Electronics', image: 'electronics',
    imageAlt: 'Illustrative electronics receiving bay with bulk return cartons, sorting benches and stocked warehouse racks',
    title: 'A smarter route for surplus electronics.',
    description: 'SR Infotech buys surplus electronics, open-box stock and untested return lots in bulk, with its own pickup logistics across India.',
    intro: 'SR Infotech buys surplus electronics, open-box stock and commercially suitable untested return lots across India. Share the models, quantities and known condition; our own logistics handles agreed pickups.',
    types: ['Consumer electronics & accessories', 'Overstock & discontinued models', 'Open-box inventory', 'Tested customer returns', 'Untested electronics lots'],
    details: ['Brand, model, variant and quantities', 'Tested or untested status and known faults', 'Accessories, packaging and device locks', 'Stock location and representative photos'],
    note: 'Untested electronics are considered for purchase. Acceptance and pricing depend on the lot. Products discarded as e-waste require a separate route; this is an inventory buying service.',
    faqs: [
      { question: 'Do you buy untested electronics in bulk?', answer: 'Yes. SR Infotech considers untested electronics lots when the commercial fit works. Identify the models, quantities, known faults and stock location; acceptance and pricing are discussed directly.' },
      { question: 'What is the difference between open-box and untested stock?', answer: 'Open-box describes the packaging history. Untested means functionality has not been established by testing. An item can be both, so record packaging, test status, faults and missing accessories separately.' },
    ],
  },
];

export const solutions = [
  {
    slug: 'sell-excess-inventory', name: 'Surplus & overstock', icon: 'layers',
    title: 'Less stock standing still. More room to move.',
    description: 'Sell excess inventory, overstock and slow-moving stock in India. SR Infotech buys bulk lots from brands and ecommerce businesses.',
    intro: 'Overstock ties up space and working capital. SR Infotech buys surplus inventory in apparel, home and kitchen, and electronics, with our own logistics for pickup across India.',
    paragraphs: [
      ['When your stock outgrows your plan', 'An optimistic purchase order, a changed product range or a season that moved faster than expected can leave useful stock behind. Bring us the inventory your business is ready to sell in bulk.'],
      ['One commercial conversation', 'Share your category, approximate quantity, condition and location. We review the opportunity directly with your team and discuss a purchase that fits the lot.'],
      ['From stock list to pickup', 'Our own logistics supports pickup across India. The offer, payment and collection details are agreed directly, so your team has a clear route forward.'],
    ],
    faqs: [
      { question: 'What is surplus inventory liquidation?', answer: 'Surplus inventory liquidation is the sale of excess or unwanted stock through an alternative buying channel. Here, it means a business selling bulk goods to SR Infotech; it does not mean closing or winding up the business.' },
      { question: 'How do I sell excess stock to SR Infotech?', answer: 'Start with the category, approximate quantity, known condition and location. We review the lot with your team and discuss the purchase terms and pickup arrangements directly.' },
    ],
  },
  {
    slug: 'ecommerce-returns', name: 'Ecommerce returns', icon: 'repeat',
    title: 'Give returned inventory a way forward.',
    description: 'Sell ecommerce customer returns in bulk to SR Infotech. Apparel, home, kitchen and electronics return lots considered across India.',
    intro: 'SR Infotech buys bulk ecommerce returns from brands and businesses across India, including commercially suitable untested electronics. Our own logistics handles pickup of the agreed stock.',
    paragraphs: [
      ['Returned doesn’t tell the whole story', 'A returned product may be unopened, open-box, incomplete, faulty or untested. Tell us what you know about the lot so we can assess the actual opportunity.'],
      ['A direct route for bulk returns', 'Whether you are clearing a one-time accumulation or exploring a recurring buying relationship, start with the product categories, volume and stock location.'],
      ['Keep the operational details in the conversation', 'We discuss inspection needs, commercial terms and pickup with your team. Our logistics covers collection across India, with arrangements confirmed for the specific lot.'],
    ],
    faqs: [
      { question: 'Does a customer return mean the product is faulty?', answer: 'No. Customer return describes how the stock came back, not its current condition. Returned goods can be unopened, tested working, incomplete, faulty or untested. Disclose what is actually known about each group.' },
      { question: 'What should I send for a mixed ecommerce return lot?', answer: 'Send the product categories, approximate quantities, stock location and known condition groups. Mention whether you have a manifest or representative photos. Further details can be shared during the buying conversation.' },
    ],
  },
  {
    slug: 'damaged-label-stock', name: 'Damaged labels & packaging', icon: 'box',
    title: 'The label changed. The opportunity didn’t.',
    description: 'Sell damaged-label and packaging-damaged stock in bulk. SR Infotech reviews apparel, home, kitchen and electronics inventory across India.',
    intro: 'SR Infotech reviews bulk damaged-label and packaging-damaged stock for purchase across India. Share the product mix, quantity and condition so we can discuss the opportunity and pickup.',
    paragraphs: [
      ['Separate the product from its packaging', 'Show us whether the issue affects the label, outer box, inner packaging or the product itself. Clear photographs help us understand what your lot contains.'],
      ['Tell us about the restrictions', 'Share any applicable brand, channel or labelling requirements during the commercial discussion. These details belong in the agreed terms of the transaction.'],
      ['Put a practical next step in place', 'Send the category, approximate quantity and location. We assess the stock and discuss the purchase and pickup directly with your team.'],
    ],
    faqs: [
      { question: 'Can I sell stock with damaged labels or packaging?', answer: 'SR Infotech reviews bulk damaged-label and packaging-damaged stock in its buying categories. Describe the exact issue, quantity and location. Acceptance depends on the products, condition and commercial fit.' },
      { question: 'Is packaging damage the same as product damage?', answer: 'No. An affected outer box does not establish the condition of the product inside. Describe the label, outer packaging, product and any missing parts separately, using photos where available.' },
    ],
  },
];

export const faqs = [
  { question: 'What does SR Infotech buy?', answer: 'We buy bulk surplus stock, overstock, ecommerce returns, end-of-season inventory and damaged-label or packaging-damaged goods in apparel, home and kitchen, and electronics.' },
  { question: 'Who can sell inventory to you?', answer: 'We work with ecommerce businesses, retail brands and other businesses that own or are authorised to sell bulk inventory. Share the details of your lot to start a buying conversation.' },
  { question: 'Do you arrange pickup across India?', answer: 'Yes. SR Infotech has its own logistics for collecting goods across India. Pickup timing and arrangements are discussed for your specific lot.' },
  { question: 'Do you buy untested electronics?', answer: 'Yes, we consider untested electronics lots. Share the models, quantities, known condition and location. Acceptance and pricing depend on the specific lot and its commercial fit.' },
  { question: 'What are your minimum quantity and payment terms?', answer: 'Contact us with your stock details. We discuss quantities, pricing, payment and the other commercial terms directly with your team.' },
  { question: 'How do I get started?', answer: 'Use the inventory enquiry form or contact us by phone, email or WhatsApp. Tell us the category, approximate quantity, condition and stock location. We can arrange the next steps for sharing your stock list.' },
];
