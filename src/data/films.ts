export interface FilmData {
  id: number;
  title: string;
  image: string;
  description: string;
  synopsis: string;
  director: string;
  genres: string[];
  runtime: number;
  releaseYear: number;
  awards: string[];
  critique: string; // Single FilmSlate editorial critique, used for RAG similarity
  availability: {
    start: string;
    end: string;
  };
}

// Availability windows are computed dynamically relative to today.
// Film id=1 is unavailable — its window ended 31 days ago.
// Films id=2–31 each have a unique 30-day window that overlaps with today.

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Returns a 30-day availability window starting `startOffset` days from today.
// Negative startOffset = window began in the past; positive = begins in future.
function win(startOffset: number): { start: string; end: string } {
  return { start: isoDate(startOffset), end: isoDate(startOffset + 30) };
}
// Films 2–31 get start offsets -29 through 0 (one each), so every window
// overlaps with today. Film 1 gets a window that ended 31 days ago.

export const ALL_FILMS: FilmData[] = [
  {
    id: 1,
    title: 'Shadows of Tomorrow',
    image: 'https://images.unsplash.com/photo-1761998528613-a18866ce78ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub2lyJTIwZmlsbSUyMGF0bW9zcGhlcmV8ZW58MXx8fHwxNzY3ODc0MDE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A haunting noir thriller following a detective through the rain-soaked streets of a city that never sleeps.',
    synopsis: 'Detective Mara Kessler returns to her hometown after a decade away, only to find herself drawn into a conspiracy that stretches from the docks to city hall. As she unravels a web of corruption, she must confront her own demons.',
    director: 'Elise Vandermeer',
    genres: ['Noir', 'Thriller', 'Crime'],
    runtime: 112,
    releaseYear: 2023,
    awards: ['Winner – Best Cinematography, Tribeca Film Festival 2023', 'Official Selection – BFI London Film Festival 2023'],
    critique: 'Shadows of Tomorrow is a suffocating, morally intricate noir that uses rain, shadow, and silence as its primary language. Director Elise Vandermeer builds a city that feels genuinely corrupt — not in a cartoonish way, but in the way institutions rot quietly from within, leaving ordinary people to navigate the residue. Detective Mara Kessler is one of cinema\'s great compromised protagonists: a woman who came home to make things right and discovers that righteousness is a luxury the city stopped affording years ago. The cinematography renders every slicked street and half-lit doorway as a moral landscape; darkness here is not atmosphere but argument. What sets the film apart from genre peers is its patience — Vandermeer allows scenes to breathe long past the point of comfort, letting guilt and silence accumulate until they become almost physical. The investigation into institutional corruption mirrors Kessler\'s own internal excavation: every corrupt official she exposes corresponds to a self-deception she must also abandon. The film\'s climax offers no catharsis, only clarity — and the film argues persuasively that clarity is the harder gift.',
    availability: win(-30), // UNAVAILABLE
  },
  {
    id: 2,
    title: 'The Last Projection',
    image: 'https://images.unsplash.com/photo-1765188987985-6a9a0769b79b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwcm9qZWN0b3IlMjB2aW50YWdlfGVufDF8fHx8MTc2NzgzNzYwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An aging projectionist discovers a mysterious film reel that seems to predict the future.',
    synopsis: 'Henri Laval has spent fifty years threading film through the same projector in a crumbling Parisian cinema. When an unmarked reel arrives, its images begin to mirror events not yet happened.',
    director: 'Théo Masson',
    genres: ['Drama', 'Mystery', 'Arthouse'],
    runtime: 98,
    releaseYear: 2024,
    awards: ['Winner – FIPRESCI Prize, Cannes 2024', 'Official Selection – Venice Film Festival 2024'],
    critique: 'The Last Projection is a tender, melancholic hymn to cinema as memory and prophecy. Théo Masson\'s film understands that a projectionist is not a technician but a custodian of other people\'s dreams, and Henri Laval — played with extraordinary stillness — embodies fifty years of watching stories move through light. The mysterious reel at the film\'s centre is less a plot device than a philosophical provocation: if cinema can show us what hasn\'t happened yet, what does that mean for the stories we choose to tell and preserve? Masson shoots the projection booth with the reverence of a sacred space, and the film\'s imagery carries a dreamlike temporal displacement — past and future bleeding into the same frame. The film is also, quietly, about obsolescence and institutional neglect: the cinema is crumbling, the audience has thinned, and Henri\'s craft is one the world is forgetting how to value. That the mysterious reel arrives precisely as all this is ending feels deliberate — a final argument from cinema itself for its own indispensability. Deeply moving, formally assured, and suffused with an ache for the things that flicker and go dark.',
    availability: win(-29), // id 2
  },
  {
    id: 3,
    title: 'Portraits in Silence',
    image: 'https://images.unsplash.com/photo-1681308830471-75bc6b8bd2ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29keSUyMHBvcnRyYWl0JTIwY2luZW1hdGljfGVufDF8fHx8MTc2Nzg3NDAxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An intimate character study exploring the inner life of a reclusive artist. Shot in black and white with minimal dialogue.',
    synopsis: 'Painter Nora Veil hasn\'t spoken in three years — not since the accident that took her partner. Her days are marked by canvas, charcoal, and the slow accumulation of unspoken feeling.',
    director: 'Amara Osei',
    genres: ['Drama', 'Character Study', 'Arthouse'],
    runtime: 87,
    releaseYear: 2023,
    awards: ['Winner – Golden Leopard, Locarno Film Festival 2023', 'Official Selection – TIFF 2023'],
    critique: 'Portraits in Silence is a film of extraordinary restraint and emotional depth, built around the radical proposition that a character who does not speak can be more fully present than one who never stops. Amara Osei shoots entirely in close-up and black and white, rendering Nora\'s face and hands as landscapes of grief and creative will — surfaces that record everything the voice refuses to carry. The film\'s formal austerity is not cold but warm; the monochrome feels not like a stylistic affectation but the only honest register for a life stripped of its colour by loss. Osei understands that creativity and grief share the same anatomy — both are processes of making form from feeling, of turning the internal into the external, of finding shape in what resists it. Watching Nora paint is like watching someone think: the hesitations, reversals, and sudden certainties of the brush correspond exactly to the emotional weather the film cannot name in words. There is no score, no explanatory context, no other characters of comparable weight — the film commits entirely to its subject\'s inner life and trusts the audience to meet her there. The result is one of the most genuinely intimate films in recent memory, and a reminder that silence, wielded with this precision, is not absence but its own form of eloquence.',
    availability: win(-28), // id 3
  },
  {
    id: 4,
    title: 'Dark Horizons',
    image: 'https://images.unsplash.com/photo-1648591645922-9632ea04c3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMGxhbmRzY2FwZSUyMGRhcmt8ZW58MXx8fHwxNzY3ODc0MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A sci-fi epic set in a dystopian future.',
    synopsis: 'In 2147, engineer Sable Orin discovers the last free city\'s sentient power source is dying. A chase between corporate forces and grassroots resistance unfolds against a landscape of perpetual twilight.',
    director: 'Jonas Kreft',
    genres: ['Science Fiction', 'Dystopia', 'Thriller'],
    runtime: 124,
    releaseYear: 2024,
    awards: ['Official Selection – Fantasia International Film Festival 2024'],
    critique: 'Dark Horizons reanimates dystopian cinema by grounding its apocalypse in grief rather than spectacle. Jonas Kreft builds a world of perpetual twilight that feels genuinely inhabited — corroded, exhausted, and stubbornly alive — rather than the sleek production-design fantasies that typically populate the genre. The film\'s central moral engine is not the conflict between corporation and resistance but the question at its heart: can a dying sentient being choose the terms of its own ending? That question radiates outward through every relationship in the film, connecting the power source\'s failing consciousness to the grief of the engineer who refuses to let go and the ruthlessness of those who see only resource. Kreft films the city\'s twilight as something beautiful and grievous simultaneously — light that is always either arriving or departing, never settled. The action sequences are staged with real spatial intelligence, but the film\'s power comes from its quieter passages: a conversation in the dark, the hum of something alive in the walls, the way technology and tenderness become indistinguishable. Dark Horizons is science fiction that takes seriously the moral weight of what it imagines.',
    availability: win(-27), // id 4
  },
  {
    id: 5,
    title: 'City Lights',
    image: 'https://images.unsplash.com/photo-1611416370495-50fac9e1b382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMG5pZ2h0JTIwY2l0eXxlbnwxfHx8fDE3Njc4NzQwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A love story told through the lens of urban isolation.',
    synopsis: 'Two strangers time-share an apartment on alternating weeks, communicating only through notes left for each other. Their imagined relationship deepens through objects, handwriting, and absence.',
    director: 'Hana Fujimoto',
    genres: ['Romance', 'Drama', 'Urban'],
    runtime: 94,
    releaseYear: 2023,
    awards: ['Winner – Audience Award, Palm Springs International Film Festival 2023'],
    critique: 'City Lights is a romance conducted entirely in absentia, and Hana Fujimoto\'s great insight is that longing is more powerful than presence. The film\'s conceit — two strangers sharing an apartment in alternating weeks, knowing each other only through the evidence they leave behind — is deceptively simple, but Fujimoto uses it to excavate everything that conventional romance films elide: the way we construct an idealized other from fragments, the intimacy of objects and handwriting, the particular ache of a city that keeps everyone at arm\'s length. The apartment itself becomes a kind of love letter written in two hands, its accumulated domestic details — a book left open, a coffee cup moved, a window left ajar — forming a language more truthful than conversation. Fujimoto shoots the city\'s neon and rain with a warmth that counterpoints its emotional register: this is not a cold film about loneliness but a warm one about the strange shapes love takes in the modern city. The final act\'s reframing of everything that came before is earned through the film\'s accumulated emotional intelligence rather than plot mechanics. City Lights understands that urban loneliness is not a deficit but a condition, and that connection — when it finally arrives — is all the more precious for the silence it breaks.',
    availability: win(-26), // id 5
  },
  {
    id: 6,
    title: 'Through the Lens',
    image: 'https://images.unsplash.com/photo-1697238724718-29cc8b1a2340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwZmlsbXxlbnwxfHx8fDE3Njc4NjUzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A documentary about the art of analog photography.',
    synopsis: 'Five photographers across three continents still shoot exclusively on film. Through their darkrooms and their stories, the documentary excavates what it means to commit to slowness and the alchemy of light on silver.',
    director: 'Marcus Webb',
    genres: ['Documentary', 'Art', 'Photography'],
    runtime: 78,
    releaseYear: 2024,
    awards: ['Official Selection – Hot Docs 2024'],
    critique: 'Through the Lens is a documentary that has the patience of its subjects — it watches, waits, and refuses to hurry toward its conclusions. Marcus Webb\'s five analog photographers are not nostalgists or contrarians; they are practitioners of a discipline that demands physical commitment, chemical knowledge, and an almost devotional relationship with uncertainty. What emerges from Webb\'s patient observation is a portrait of creativity as a practice of presence: you cannot shoot on film and be elsewhere, cannot delete and try again, cannot defer the decision of when to press the shutter. The darkroom sequences are filmed with extraordinary sensitivity — the amber light, the slow emergence of image on paper, the held breath of the developer bath — and Webb understands that this process is not merely technical but transformative, a kind of witnessing. The film is also, quietly, about memory and materiality: these photographers make objects, not files, and the prints they produce carry the literal chemistry of the moment they captured. Webb draws an implicit connection between analog photography and other forms of committed, irreversible making — painting, writing, living — and the film asks, with genuine urgency, what we lose when we remove the cost of commitment from creative acts.',
    availability: win(-25), // id 6
  },
  {
    id: 7,
    title: 'Echoes',
    image: 'https://images.unsplash.com/photo-1674757621246-ab7bcaba8bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHBvcnRyYWl0JTIwZHJhbWF8ZW58MXx8fHwxNzY3ODc0MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A psychological thriller about memory and identity.',
    synopsis: 'A woman wakes every morning with no memory of who she was the day before. As she pieces together her history, she begins to suspect someone is actively rewriting it.',
    director: 'Rin Nakamura',
    genres: ['Thriller', 'Psychological', 'Mystery'],
    runtime: 105,
    releaseYear: 2022,
    awards: ['Winner – Best Director, Fantasia 2022', 'Official Selection – New York Film Festival 2022'],
    critique: 'Echoes is a thriller that understands amnesia not as a medical condition but as a metaphor for the way identity is always under construction and always at risk. Rin Nakamura constructs her film as a puzzle whose solution is less important than the experience of disorientation it produces — we share the protagonist\'s terror precisely because we, too, cannot fully trust what we remember from scene to scene. The film\'s formal intelligence lies in making the audience\'s epistemological position identical to the character\'s: we piece together who she is from the same fragmentary evidence she has, and our mounting suspicion that someone is manipulating that evidence mirrors her own. Nakamura shoots the familiar — a house, a face, a routine — as subtly wrong, deploying the domestic uncanny with real craft. The horror is not in what is monstrous but in what is almost-right: the face that is too knowing, the room that has been moved by centimetres, the warmth that feels performed. Identity here is architecture — something built over time, capable of being dismantled by someone with knowledge of its foundations. Echoes is genuinely unsettling and formally rigorous, a psychological thriller that earns its convolutions by rooting them in something emotionally true.',
    availability: win(-24), // id 7
  },
  {
    id: 8,
    title: 'Into the Woods',
    image: 'https://images.unsplash.com/photo-1762871950969-55419104d2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZm9yZXN0JTIwYXRtb3NwaGVyaWN8ZW58MXx8fHwxNzY3ODc0MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A haunting fairy tale reimagined for modern audiences.',
    synopsis: 'A grief counsellor retreats to her late grandmother\'s forest cottage. The locals speak of something old in the woods that grants wishes at a cost — a power that begins to mirror her own darkest desires.',
    director: 'Petra Solberg',
    genres: ['Horror', 'Folk Horror', 'Drama'],
    runtime: 101,
    releaseYear: 2023,
    awards: ['Official Selection – Sitges Film Festival 2023', 'Winner – Jury Prize, Overlook Film Festival 2023'],
    critique: 'Into the Woods is folk horror as grief therapy — a film that understands the original fairy tales not as stories for children but as technologies for processing the things adults cannot otherwise face. Petra Solberg earns her film\'s dread slowly and honestly, building through accumulated atmosphere rather than shock, until the forest\'s demands feel not imposed from outside but welling up from within the protagonist herself. The something-in-the-woods is not a creature but a condition: the externalisation of the counsellor\'s own knowledge that she helps others with feelings she has never permitted herself to feel. Solberg films the forest with a tactile, organic intimacy — bark and root and the particular quality of light through old-growth canopy — that makes the landscape feel alive and aware. The film\'s horror is inseparable from its tenderness: the thing in the woods offers exactly what grief refuses to, and the question the film circles is whether the cost of that bargain is too high or exactly right. What distinguishes Into the Woods from its folk horror contemporaries is its psychological specificity: this is not a film about superstition but about the psyche, and its supernatural elements function as the most precise possible metaphors for inherited trauma, maternal loss, and the violence of carrying other people\'s pain.',
    availability: win(-23), // id 8
  },
  {
    id: 9,
    title: 'Luminescence',
    image: 'https://images.unsplash.com/photo-1637434001140-f5328c2d885b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGxpZ2h0JTIwY2luZW1hfGVufDF8fHx8MTc2Nzg3NDAxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An experimental film exploring light and colour as living phenomena.',
    synopsis: 'Shot without dialogue or narrative, Luminescence is a seventy-minute immersion in light — dawn through dusk, natural and artificial — asking whether perception itself is a form of consciousness.',
    director: 'Yuki Tanaka',
    genres: ['Experimental', 'Arthouse', 'Visual Essay'],
    runtime: 70,
    releaseYear: 2024,
    awards: ['Winner – Tiger Award, Rotterdam International Film Festival 2024'],
    critique: 'Luminescence dismantles the grammar of cinema and rebuilds it from pure sensation, producing a film that is less watched than inhabited. Yuki Tanaka abandons narrative structure entirely and in doing so discovers that cinema\'s deepest capability may be the representation of consciousness itself — not the thoughts we have but the perceptual substrate beneath them, the world arriving before we have words for it. The film moves through the full spectrum of illumination with the patience of a geologist: morning light through condensation, the quality of noon through an industrial skylight, dusk over water, the sodium orange of an empty road at 2 AM. Each passage is filmed with a sensitivity to texture that goes beyond the visual — Tanaka shoots light as something almost haptic, something you could reach into. The film makes a persuasive case that attention is itself a form of meaning-making; that to look at something with full concentration is already an interpretive act. Luminescence is demanding cinema, but it rewards its audience with the rarest of gifts: genuine defamiliarisation, the sense of seeing familiar things as if for the first time. By its final frames, the ordinary — a window, a filament, a late-afternoon shadow — has been transformed into something that feels close to sacred.',
    availability: win(-22), // id 9
  },
  {
    id: 10,
    title: 'Silhouettes',
    image: 'https://images.unsplash.com/photo-1743164584214-b04b42afa6b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxob3VldHRlJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwxfHx8fDE3Njc4NzQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A visual poem about human connection and urban life.',
    synopsis: 'Twelve strangers pass through a single subway station over a single night. The film renders them as shapes against light, fragments of story accumulating into a mosaic of the city\'s hidden emotional life.',
    director: 'Gabriel Moreau',
    genres: ['Drama', 'Arthouse', 'Urban'],
    runtime: 65,
    releaseYear: 2023,
    awards: ['Official Selection – True/False Film Festival 2023'],
    critique: 'Silhouettes is structured like music — thematic, rhythmic, and emotionally cumulative in a way that individual scenes cannot account for but the whole delivers with force. Gabriel Moreau renders his twelve strangers as shapes against light not to diminish them but to reveal them at their most essential: stripped of distinguishing detail, they become archetypes of the city\'s emotional life, and we project our own knowledge of longing, tenderness, and grief onto their silhouetted forms. The subway station is a perfect container for Moreau\'s project — a space of constant transit that nobody inhabits, where lives intersect without connecting, where the city\'s population becomes briefly legible as a collection of private interiors in motion. The film asks what a city owes its inhabitants and answers: witness. To be seen passing through, even briefly, even as a shape against light, is the film\'s quiet argument for what makes urban existence bearable. No scene lasts longer than ninety seconds; Moreau trusts the accumulative effect entirely. The formal constraint is an act of radical empathy: in refusing to make any one story the story, the film makes all of them equally real, equally deserving of the attention we give them.',
    availability: win(-21), // id 10
  },
  {
    id: 11,
    title: 'Neon Dreams',
    image: 'https://images.unsplash.com/photo-1650114361973-3e987d7f0be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMG5lb24lMjBsaWdodHN8ZW58MXx8fHwxNzY3ODEyMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A cyberpunk romance set in near-future Tokyo.',
    synopsis: 'In a near-future Tokyo where memory can be bought and sold, a black-market archivist falls for a woman who has sold her entire childhood. Together they try to construct love from borrowed fragments.',
    director: 'Kenji Watanabe',
    genres: ['Science Fiction', 'Romance', 'Cyberpunk'],
    runtime: 108,
    releaseYear: 2024,
    awards: ['Official Selection – Japan Cuts 2024'],
    critique: 'Neon Dreams is a cyberpunk love story with the soul of a melodrama, and Kenji Watanabe\'s achievement is making the technological premise feel not like world-building but like emotional truth. In a city where memory is commodity, identity becomes a market — and the woman who has sold her childhood has made the most radical form of self-erasure imaginable. Watanabe\'s near-future Tokyo is gorgeous and gutted: neon surfaces over hollow interiors, brilliant light over profound absence. The film understands that memory is not merely what we have but what we are, and that selling it is a form of self-inflicted loss that the market will never be able to account for. The romance at the film\'s centre is genuinely moving precisely because it is also an ethical problem: how do you love someone who doesn\'t know who they were? How do you build intimacy on a foundation that has been deliberately destroyed? Watanabe refuses easy answers, instead filming the relationship with a luminous, melancholic tenderness that makes its impossibility feel like a love worth attempting anyway. The city of light is also the city of forgetting, and the film holds both truths simultaneously, refusing to resolve them into comfort.',
    availability: win(-20), // id 11
  },
  {
    id: 12,
    title: 'Wasteland',
    image: 'https://images.unsplash.com/photo-1666982821449-e0e79688ea1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBsYW5kc2NhcGUlMjBtb29keXxlbnwxfHx8fDE3Njc4NzQwMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A survival story in the desert.',
    synopsis: 'Stranded in the Atacama after her research convoy is ambushed, hydrologist Dara Mbeki must cross two hundred miles with a broken satellite phone and dwindling water. But survival here is also a reckoning with why she came.',
    director: 'Sofía Reyes',
    genres: ['Survival', 'Drama', 'Adventure'],
    runtime: 118,
    releaseYear: 2022,
    awards: ['Winner – Grand Prix, San Sebastián 2022', 'Official Selection – Sundance 2022'],
    critique: 'Wasteland films the desert as a moral landscape — merciless, clarifying, indifferent to the value we place on our own survival. Sofía Reyes resists every temptation to melodramatise Dara\'s ordeal, instead observing it with the same unblinking patience the desert applies to all things that enter it. The survival mechanics are rigorously real and the physical toll is shown without flinching, but Reyes is always more interested in what the desert strips away than what it threatens: the professional identity, the carefully maintained emotional distance, the reasons Dara gave herself for spending her life in remote places rather than in the company of people who love her. The film\'s physical journey is inseparable from its psychological one, each mile traversed corresponding to a layer of self-protection abandoned. Reyes films the Atacama with a beauty that never tips into the picturesque — the landscape is beautiful in the way that something genuinely indifferent is beautiful, without any investment in being seen. Wasteland earns its emotional climax through this rigour, arriving at something that feels not like sentiment but like consequence. Dara\'s survival is not triumphant; it is clarified, and the film trusts that distinction to carry weight.',
    availability: win(-19), // id 12
  },
  {
    id: 13,
    title: 'The Empty Room',
    image: 'https://images.unsplash.com/photo-1611271581777-def56cc4b5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaW50ZXJpb3IlMjBjaW5lbWF0aWN8ZW58MXx8fHwxNzY3ODc0MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A minimalist drama about grief and letting go.',
    synopsis: 'Following the death of his daughter, a retired architect methodically empties his family home of forty years — object by object, room by room — in real time.',
    director: 'Lars Bergmann',
    genres: ['Drama', 'Grief', 'Minimalist'],
    runtime: 89,
    releaseYear: 2023,
    awards: ['Winner – Silver Bear Special Jury Prize, Berlin 2023', 'Official Selection – Cannes 2023 – Un Certain Regard'],
    critique: 'The Empty Room is one of the most emotionally devastating films in recent memory, achieved through a restraint so total it becomes its own form of expressionism. Lars Bergmann films his protagonist emptying the family home with neither flashback nor score nor explanatory dialogue — only objects and the weight they carry, the specific gravity of the things we accumulate over forty years of a shared life. The daughter is never seen; her absence structures every frame. Bergmann\'s great insight is that grief is physical before it is emotional — that it lives in the body before the mind can name it, and that the body of loss is made of ordinary things: a mug, a shelf, the particular way light falls through a window at 3pm. The film understands clearing a house not as disposal but as archaeology, each object a layer in a stratigraphy of love. The retired architect\'s professional eye — trained to understand how space holds meaning, how rooms accumulate the life lived in them — becomes a quietly devastating lens through which to observe this undoing. Bergmann offers no resolution because grief offers none; the film ends not with catharsis but with the particular silence of a room that has been emptied and is not yet anything else. It is the most honest depiction of bereavement the cinema has produced in years.',
    availability: win(-18), // id 13
  },
  {
    id: 14,
    title: 'Tides',
    image: 'https://images.unsplash.com/photo-1610581950163-c37ae06c3a96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwZHJhbWF0aWN8ZW58MXx8fHwxNzY3ODc0MDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An environmental documentary about ocean conservation.',
    synopsis: 'Over three years, Cleo Barros embedded with marine biologists, fishing communities, and activists working to protect the last pristine reef systems on the Pacific coast.',
    director: 'Cleo Barros',
    genres: ['Documentary', 'Environmental', 'Nature'],
    runtime: 96,
    releaseYear: 2024,
    awards: ['Winner – Golden Eye Documentary Award, Cannes 2024', 'Official Selection – IDFA 2024'],
    critique: 'Tides is a documentary that works on you slowly, like water finding its way through stone, and by its final act you are not the same audience you were at its opening. Cleo Barros has made a film that refuses the rhetorical shortcuts of environmental advocacy — no orchestral swells over dying coral, no celebrity narration — and instead trusts the ocean to make its own argument for its own survival. The underwater sequences are extraordinary not as spectacle but as relationship: the camera moves the way water moves, learning the language of the reef rather than imposing its own. Barros is equally patient with her human subjects — the marine biologist who has spent thirty years documenting a reef system\'s decline, the fishing community whose livelihood depends on the same waters, the activist whose certainty is beginning to fray against the scale of the problem. The film does not simplify these relationships or resolve their tensions; it holds them all simultaneously, the way the ocean itself holds the competing claims of everyone who needs it. What Tides ultimately argues is not that the ocean needs saving — a proposition the film considers too simple — but that the act of trying to save it is itself a form of meaning, a way of being in right relationship with something vast and indifferent and irreplaceable.',
    availability: win(-17), // id 14
  },
  {
    id: 15,
    title: 'Concrete',
    image: 'https://images.unsplash.com/photo-1584563123253-3785be1f0ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBtaW5pbWFsJTIwZGFya3xlbnwxfHx8fDE3Njc4NzQwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An architectural meditation on urban Brutalist spaces and the people who inhabit them.',
    synopsis: 'Five Brutalist housing estates in five cities. The film asks whose aesthetic deserves to survive, told through the residents who love these buildings and the planners who want them gone.',
    director: 'Adam Nowak',
    genres: ['Documentary', 'Architecture', 'Urban'],
    runtime: 84,
    releaseYear: 2023,
    awards: ['Winner – Best Documentary, Sheffield DocFest 2023'],
    critique: 'Concrete gives voice to people who are never asked their opinion of the buildings they inhabit, and in doing so reveals that architectural criticism — the kind published in journals and delivered at inquiries — has systematically excluded the testimony of the people most qualified to give it. Adam Nowak\'s five housing estates are not beautiful in the way that design magazines mean by the word; they are beautiful in the way that things shaped by necessity and use are beautiful, their surfaces worn into authenticity by decades of ordinary life. The film\'s anger is quiet and structural: it understands that the decision to demolish a Brutalist estate is never purely aesthetic, that the language of ugliness is always also the language of whose presence in the city is considered desirable. Nowak films concrete itself with an almost affectionate attention — its textures, its shadows, the way it holds heat and cold — arguing through visual means that brutalism has been made ugly by disinvestment and neglect rather than by its inherent form. The residents who speak are eloquent and precise about what their homes mean: not nostalgia but belonging, the particular dignity of a space that has been made yours over time. Concrete is a film about architecture that is really about power, and it makes that argument without ever becoming polemical.',
    availability: win(-16), // id 15
  },
  {
    id: 16,
    title: 'Haze',
    image: 'https://images.unsplash.com/photo-1661782533035-ef946cca5ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9rZSUyMGF0bW9zcGhlcmljJTIwbW9vZHxlbnwxfHx8fDE3Njc4NzQwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A dreamy exploration of the borderland between wakefulness and sleep.',
    synopsis: 'A neuroscientist studying the hypnagogic state begins to blur the line herself. Haze operates in the register of images that follow their own logic, dissolve without warning, and return transformed.',
    director: 'Clara Voss',
    genres: ['Experimental', 'Psychological', 'Surrealism'],
    runtime: 82,
    releaseYear: 2024,
    awards: ['Winner – Jury Award, Tribeca Film Festival 2024'],
    critique: 'Haze is a film about the borderland between consciousness and its dissolution, and Clara Voss is rigorous enough to refuse the visual clichés that typically represent altered states — no fish-eye lenses, no reverse footage, no obvious dreamscape markers. Instead she creates genuine perceptual instability through accumulation: images that almost-rhyme with what came before, dialogue that shifts register without warning, spaces that are recognisable but not right. The film mimics the experience of hypnagogia — the hallucinatory state between waking and sleep — with a precision that suggests Voss has studied it as carefully as her scientist protagonist. What emerges is a film about the relationship between perception and reality that makes the philosophical question visceral: we are placed inside a mind that cannot distinguish what it makes from what it receives, and the terror of that position is not abstract but immediate. The neuroscientist\'s professional framework for understanding consciousness becomes progressively useless against her own dissolving certainty, and Voss films this not as horror but as a kind of dark wonder — the world becoming strange in a way that is also, somehow, revelatory. Haze is cinema as altered state, a film that changes the perceptual register of its audience and makes the ordinary world, encountered again after, seem briefly and beautifully unfamiliar.',
    availability: win(-15), // id 16
  },
  {
    id: 17,
    title: 'The Road Less Traveled',
    image: 'https://images.unsplash.com/photo-1679247888138-e5bd89a4b586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyJTIwcmV0cm98ZW58MXx8fHwxNzY3ODc0MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A road trip film about finding yourself.',
    synopsis: 'After losing her job, apartment, and five-year relationship in one week, a woman buys a 1973 Datsun and drives from New York to New Mexico with no plan. What she finds is not what she was looking for.',
    director: 'Maya Chen',
    genres: ['Drama', 'Road Movie', 'Comedy'],
    runtime: 103,
    releaseYear: 2023,
    awards: ['Winner – Audience Award, SXSW 2023'],
    critique: 'The Road Less Traveled understands that a road movie is really a film about permission — the permission to not know where you\'re going, to move without destination, to treat uncertainty not as a problem to be solved but as a condition to be inhabited. Maya Chen gives her protagonist that permission generously and without condescension, and the film that results is funny, sad, and shot with an unaffected love for the American landscape that never tips into romanticism. The Datsun is not a symbol; it is a car, old and unreliable, requiring maintenance and attention, demanding the kind of relationship with physical objects that our increasingly virtual lives are eroding. Chen\'s film is interested in the texture of movement — the specific quality of being in a place you have no history with, no obligations to, no story already told about you — and what becomes possible in that freedom. The encounters along the way are neither picturesque nor instructive in the way that road movie conventions demand; they are strange, warm, occasionally uncomfortable, and ultimately the film\'s argument that self-discovery is less a destination than a practice, less a revelation than an accumulation of encounters with the world encountered on its own terms.',
    availability: win(-14), // id 17
  },
  {
    id: 18,
    title: 'Summit',
    image: 'https://images.unsplash.com/photo-1559666358-1bf722875b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGVwaWN8ZW58MXx8fHwxNzY3ODc0MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A mountaineering documentary.',
    synopsis: 'Three climbers attempt the first winter ascent of K2\'s North Face by a new route across two winter seasons. The mountain is not the antagonist; human ambition and its discontents are.',
    director: 'Kai Fischer',
    genres: ['Documentary', 'Adventure', 'Nature'],
    runtime: 112,
    releaseYear: 2024,
    awards: ['Winner – Best Documentary, Banff Mountain Film Festival 2024'],
    critique: 'Summit keeps its camera on the climbers\' faces as much as on the mountain, and in that choice reveals what separates it from the adventure documentary genre it nominally inhabits. Kai Fischer is not interested in the sublime — or rather, he is interested in it only insofar as it illuminates the psychologies of the people who pursue it. The three climbers are vividly distinct: their relationships to ambition, fear, and each other shift across two winter seasons in ways that a lesser film would smooth into camaraderie. Fischer allows the fractures to show, understanding that extreme endeavour is always a drama of relationships — with each other, with the idea of the attempt, with the person each climber needs to believe themselves to be. The high-altitude footage is extraordinary in its physical immediacy — cold and wind and verticality rendered with real force — but what stays with you is the question the film keeps returning to, without condescension: why? Not as accusation but as genuine philosophical inquiry into what human beings need from the confrontation with their own limits. Summit earns its ambiguity by refusing to answer that question, instead holding open the space in which it lives.',
    availability: win(-13), // id 18
  },
  {
    id: 19,
    title: 'Between Shadows',
    image: 'https://images.unsplash.com/photo-1645445197786-8e2e9f4d58d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHNoYWRvdyUyMGRyYW1hdGljfGVufDF8fHx8MTc2Nzg3NDAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A noir mystery told from the perspective of a blind detective.',
    synopsis: 'A blind private detective in 1940s New Orleans solves cases through sound, touch, and testimony. When a client asks him to find a missing painting, the investigation implicates everyone he trusts.',
    director: 'Claude Beaumont',
    genres: ['Noir', 'Mystery', 'Crime'],
    runtime: 109,
    releaseYear: 2022,
    awards: ['Winner – Un Certain Regard Jury Prize, Cannes 2022', 'Official Selection – TIFF 2022'],
    critique: 'Between Shadows reinvents film noir by asking what happens when its defining aesthetic — chiaroscuro, the play of light and dark — is experienced by someone who cannot see it. Claude Beaumont\'s extraordinary sound design renders the blind detective\'s world with a tactile precision that retrains the audience\'s attention: we begin to hear the film rather than watch it, and in doing so discover how much cinema has always relied on the ear it pretends to ignore. The 1940s New Orleans setting is not nostalgic but chosen with precision — a city of layered secrets, social performances, and information withheld for power, a place where a man who reads people through their voices and their silences has, paradoxically, a profound advantage. The mystery plot is intricate and satisfying, but the film\'s real subject is epistemological: what does it mean to know something, to see something, to trust what your senses report? Beaumont uses his detective\'s blindness to destabilise the audience\'s confidence in the visual information we\'re given, making us complicit in the film\'s meditation on perception, evidence, and the dangerous gap between what we observe and what we understand. Between Shadows is a film about darkness that makes darkness something you feel rather than see.',
    availability: win(-12), // id 19
  },
  {
    id: 20,
    title: 'Midnight City',
    image: 'https://images.unsplash.com/photo-1683041133665-41f7ff45b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3dudG93biUyMG5pZ2h0JTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2Nzg3NDAxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A crime drama set entirely between midnight and dawn.',
    synopsis: 'A night-shift transit cop and a nightclub accountant find themselves entangled in the same money-laundering operation from opposite sides, the city\'s nocturnal rhythms forming a moral landscape.',
    director: 'Sam Okafor',
    genres: ['Crime', 'Thriller', 'Drama'],
    runtime: 116,
    releaseYear: 2023,
    awards: ['Official Selection – BFI London Film Festival 2023', 'Winner – Special Jury Prize, Tribeca 2023'],
    critique: 'Midnight City captures the particular moral looseness of 3 AM — the way decisions that seem possible only in darkness carry a different weight, a different set of justifications, than those made in daylight. Sam Okafor sets his entire film between midnight and dawn, and the temporal constraint is not gimmick but argument: this is a film about the city as a moral ecosystem that operates on different rules after the respectable world has gone to sleep. Both protagonists are ordinary people who have walked too far into something to walk back, and Okafor films their complicity not as villainy but as the tragedy of small decisions accumulating into large ones before anyone noticed the direction of travel. The night-for-night photography gives the film a sweaty, immediate texture — this is not a beautiful city-at-night but a real one, its infrastructure exposed and its inhabitants stripped of the performances daylight demands. What makes Midnight City exceptional is its emotional generosity: the two protagonists are not condemned but understood, their choices made legible against the economic pressures and institutional failures that produce them. The city here is not backdrop but protagonist, its midnight rhythms and empty platforms and last-call neon as morally articulate as anything its human inhabitants say.',
    availability: win(-11), // id 20
  },
  {
    id: 21,
    title: 'Reflections',
    image: 'https://images.unsplash.com/photo-1764568912404-172039752261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXJyb3IlMjByZWZsZWN0aW9uJTIwYXJ0aXN0aWN8ZW58MXx8fHwxNzY3ODc0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An introspective drama about identity after achievement.',
    synopsis: 'A competitive swimmer retires at twenty-six having achieved everything she set out to, then faces the disorientation of identity after purpose — the slow, difficult work of learning who you are without achievement.',
    director: 'Isabelle Roy',
    genres: ['Drama', 'Character Study', 'Sport'],
    runtime: 93,
    releaseYear: 2024,
    awards: ['Winner – FIPRESCI Prize, Karlovy Vary International Film Festival 2024'],
    critique: 'Reflections studies a species rarely examined: the person who has succeeded, and discovers in doing so how thoroughly identity can be built on achievement to the exclusion of everything else. Isabelle Roy\'s film follows a retired swimmer through the year after her career ends — not after failure but after total success — and finds in that space a form of existential vertigo that is entirely real and almost never depicted. The film\'s great intelligence is understanding that achievement and self-erasure can be the same act: to train with the discipline required for elite sport is to eliminate the self in service of the performance, and when the performance is over, what remains is not the person who was always there beneath it but a question. Roy films her protagonist with precision and tenderness, never sentimentalising the confusion or offering easy resolution. The pool sequences carry a quality of physical memory — the body knowing something the mind no longer has a container for — and Roy uses water throughout as a metaphor for the fluid, resistant medium of identity itself: something that takes the shape of its container and resists being held. Reflections is a quiet, serious film about a genuine philosophical problem, and it asks what we mean by identity with enough rigour to make the question feel urgent.',
    availability: win(-10), // id 21
  },
  {
    id: 22,
    title: 'Ruins',
    image: 'https://images.unsplash.com/photo-1661619007999-cb2a215cd799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYmFuZG9uZWQlMjBidWlsZGluZyUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc2Nzg3NDAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A post-apocalyptic tale about the persistence of beauty.',
    synopsis: 'Forty years after the collapse, a girl born into the ruins discovers a sealed archive of the old world. With no context for its films, music, and photographs, she must find her own meaning in what remains.',
    director: 'Nadia Okonkwo',
    genres: ['Science Fiction', 'Drama', 'Post-Apocalyptic'],
    runtime: 99,
    releaseYear: 2023,
    awards: ['Winner – Grand Jury Prize, Tribeca 2023', 'Official Selection – Sundance 2023'],
    critique: 'Ruins makes the post-apocalyptic intimate by locating its catastrophe not in destruction but in discontinuity — not the end of the world but the end of the world\'s memory of itself. Nadia Okonkwo\'s central image, a girl encountering an archive of culture she has no context to interpret, is both devastating and philosophically precise: culture is not content but continuity, and when the chain of transmission breaks, what remains is beautiful and mute. The girl\'s encounters with the archive — a film reel she cannot screen, a vinyl record she cannot play, a photograph of people she cannot identify — are shot with a reverence that becomes, paradoxically, the most moving expression of what has been lost. Okonkwo refuses the post-apocalyptic genre\'s usual consolations: there is no hidden community, no secret of survival, no triumphant reclamation. There is only the stubborn fact of beauty and the equally stubborn instinct to preserve it even without understanding it. The film is formally austere — long takes, minimal score, natural light — but suffused with an emotional warmth that resists its own bleakness. Hope in Ruins is not triumphant but botanical: a weed growing through concrete, persistent, purposeless in any strategic sense, and entirely necessary.',
    availability: win(-9), // id 22
  },
  {
    id: 23,
    title: "Winter's End",
    image: 'https://images.unsplash.com/photo-1671538856590-564ae61456dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwd2ludGVyJTIwbW9vZHl8ZW58MXx8fHwxNzY3ODc0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A cold war drama of moral compromise in divided Berlin.',
    synopsis: 'A German translator in East Berlin, winter 1961, is asked to courier documents she suspects will cause deaths. Her hesitation unfolds over four days as the city prepares to be divided forever.',
    director: 'Heinrich Stein',
    genres: ['Drama', 'Historical', 'Thriller'],
    runtime: 107,
    releaseYear: 2022,
    awards: ['Winner – Best Screenplay, Berlin International Film Festival 2022'],
    critique: 'Winter\'s End understands that history is made of small decisions made by ordinary people who are afraid, and it is devastating precisely because it refuses to make its protagonist extraordinary. She is not a hero or a villain but a woman with a job and a conscience, caught in a system large enough to make individual moral choice feel simultaneously necessary and futile. Heinrich Stein films the East Berlin of 1961 with a grey, penetrating accuracy — this is not the aestheticised cold war of spy thrillers but the drab, anxious reality of a city that knows it is about to be cut in two and cannot stop it. Every frame is suffused with a specific historical dread that is also universal: the dread of institutions that have made cruelty procedural, of situations in which complicity is the path of least resistance and resistance is the path of most cost. The film\'s screenplay is its primary instrument, and Stein\'s dialogue has the quality of speech under pressure — precise, careful, full of things that cannot be said directly. Winter\'s End is a masterwork of moral atmosphere, a film that makes history feel physical, like weather, like the cold that the characters carry in from outside and cannot quite shake loose.',
    availability: win(-8), // id 23
  },
  {
    id: 24,
    title: 'Through the Window',
    image: 'https://images.unsplash.com/photo-1635279557426-ac20080c9f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBsaWdodCUyMGRyYW1hdGljfGVufDF8fHx8MTc2Nzg3NDAyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A voyeuristic thriller about observation, belief, and being dismissed.',
    synopsis: 'Recovering from surgery and confined to her apartment, a woman catalogues the lives of her neighbours until one disappears mid-routine — and no one will believe what she has witnessed.',
    director: 'Ana Petrov',
    genres: ['Thriller', 'Psychological', 'Suspense'],
    runtime: 97,
    releaseYear: 2023,
    awards: ["Official Selection – Cannes 2023 – Directors' Fortnight"],
    critique: 'Through the Window is a thriller about the epistemology of seeing — about the gap between what we observe and what we can convince others is true. Ana Petrov\'s film uses its confined location not as restriction but as precision instrument, every view from that window a different argument about what observation is for and whose observations count. The film\'s real subject — the systematic dismissal of what women see and report — is embedded in its thriller mechanics with a subtlety that makes the revelation feel like recognition rather than announcement. Petrov understands that the Hitchcockian premise she inherits carries a troubling history of making voyeurism pleasurable, and she reorients it: the pleasure here is not in watching but in believing, in the experience of an audience finally taking seriously a woman whose testimony is being dismissed. The confined apartment generates a specific psychological intensity — the protagonist\'s world contracts to what is visible from one window, and Petrov makes us feel that contraction, the way enforced stillness amplifies perception. The cinematography is calibrated to the fine distinctions between what is seen and what is imagined, never fully resolving that ambiguity, keeping the audience in the same epistemological uncertainty as its protagonist until the film\'s precise, quietly devastating conclusion.',
    availability: win(-7), // id 24
  },
  {
    id: 25,
    title: 'Red Room',
    image: 'https://images.unsplash.com/photo-1554657546-abbb568d6782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBsaWdodCUyMG5vaXJ8ZW58MXx8fHwxNzY3ODc0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A psychological horror film about inherited trauma.',
    synopsis: 'A woman inherits her estranged mother\'s house and locks herself inside for thirty days. She finds evidence of a double life — and something suggesting her mother\'s death was not an accident.',
    director: 'Vera Kapoor',
    genres: ['Horror', 'Psychological', 'Mystery'],
    runtime: 92,
    releaseYear: 2022,
    awards: ['Winner – Grand Jury Prize, Fantasia 2022', 'Official Selection – Tribeca 2022'],
    critique: 'Red Room builds its horror out of domestic inventory — old photographs, handwriting, the smell of rooms that held another life — and in doing so locates the genuinely terrifying in the texture of ordinary inheritance. Vera Kapoor understands that the house we enter when a parent dies is not merely a property but a psyche, its rooms arranged according to a logic we did not know existed, its drawers full of evidence of a person we never quite had access to. The thirty-day structure is rigorous and productive: each day the protagonist stays, the house gives up more of its secrets, and each secret reconfigures what came before. Kapoor\'s great achievement is making inherited trauma visceral — felt in the body before it is understood by the mind — by treating the physical evidence of her mother\'s hidden life with the same horrified respect that the investigation demands. The horror grows from within rather than without: there are no external threats, only the progressive revelation of a psychology the protagonist shares more of than she would like to admit. The red room of the title is not a physical space but a mental one — the part of the self that was formed in response to a mother\'s damage and cannot be separated from it. Kapoor films this with intelligence and real emotional courage.',
    availability: win(-6), // id 25
  },
  {
    id: 26,
    title: 'Solitude',
    image: 'https://images.unsplash.com/photo-1766749365150-53cad707e156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wbGF0aXZlJTIwcG9ydHJhaXQlMjBlbW90aW9uYWx8ZW58MXx8fHwxNzY3ODc0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A character study about a lighthouse keeper and the stories we tell ourselves.',
    synopsis: 'A lighthouse keeper on a remote Norwegian island keeps a meticulous diary. The film reads that diary against the footage of his days — and the gap between what he writes and what we see is where the film lives.',
    director: 'Erik Lindqvist',
    genres: ['Drama', 'Character Study', 'Nature'],
    runtime: 86,
    releaseYear: 2024,
    awards: ['Winner – Best Nordic Film, Göteborg Film Festival 2024'],
    critique: 'Solitude is structured around one of cinema\'s most productive formal tensions: the gap between what a person says about their life and what their life actually contains. Erik Lindqvist reads his lighthouse keeper\'s diary aloud against footage of the days it describes, and the discrepancies — small at first, then widening — become the film\'s true subject. The keeper writes of contentment, of productive work, of a relationship with solitude as vocation; the footage shows the small repetitions and private desolations that contentment requires to go unacknowledged. Lindqvist is not unkind about this — the diary is not exposed as lie but understood as necessity, as the story a person needs to tell in order to keep going. The Norwegian landscape does exactly what landscape should do in a film like this: it refuses to mirror the character\'s inner life, remaining magnificent and indifferent while he assigns it the qualities his narrative requires. This refusal is the film\'s most compassionate gesture, a reminder that the world does not confirm our stories about ourselves, and that this is ultimately a mercy. Solitude earns its silences through the force of its formal intelligence, accumulating meaning with the patience of a man who has nothing but time.',
    availability: win(-5), // id 26
  },
  {
    id: 27,
    title: 'Ascension',
    image: 'https://images.unsplash.com/photo-1758413353049-746198a0f1a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpcmNhc2UlMjBkcmFtYXRpYyUyMHBlcnNwZWN0aXZlfGVufDF8fHx8MTc2Nzg3NDAyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A meditative documentary about repetition, faith, and the failing body.',
    synopsis: 'A monk climbs the same thousand steps every day for forty years. Ascension observes a single year of that practice — the same steps, the same sky, different light, a body slowly failing.',
    director: 'Soo-Jin Park',
    genres: ['Documentary', 'Spiritual', 'Arthouse'],
    runtime: 74,
    releaseYear: 2023,
    awards: ['Winner – Best Documentary, Locarno Film Festival 2023'],
    critique: 'Ascension films a life of faith without making a film about faith — the distinction is everything. Soo-Jin Park is interested not in the belief that motivates her monk\'s daily climb but in the practice itself, in what the repetition of a single act across forty years does to time, to the body, to the self. The formal premise — observe a year of a practice that has already been going on for four decades — creates a temporal depth that the camera cannot directly show but the film somehow makes palpable. We see a year; we feel forty. The monk\'s body, with its specific deteriorations and adaptations, is the film\'s primary text: joints that have learned this exact ascent, muscles shaped by this exact demand, a face that has been changed by decades of weather and altitude. Park shoots the steps themselves with a close attention that transforms them from geography into relationship — this is not a staircase but a conversation the monk has been having with stone for the majority of his life. The film accumulates meaning the way the monk accumulates steps: one at a time, without destination, the significance emerging only in retrospect. Ascension is a documentary about devotion that is also, inevitably, a documentary about what devotion costs, and what it produces that cannot be named.',
    availability: win(-4), // id 27
  },
  {
    id: 28,
    title: 'Lost in the Fog',
    image: 'https://images.unsplash.com/photo-1663422879687-4979355e0f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2clMjBteXN0ZXJpb3VzJTIwYXRtb3NwaGVyZXxlbnwxfHx8fDE3Njc4NzQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A mystery shrouded in communal silence.',
    synopsis: 'A detective arrives in a fishing village to investigate a disappearance and finds a community organised entirely around a secret it cannot speak. The fog is literal and figural: the film is deliberately ambiguous about what is real.',
    director: 'Emre Kaya',
    genres: ['Mystery', 'Drama', 'Atmospheric'],
    runtime: 104,
    releaseYear: 2024,
    awards: ['Official Selection – TIFF 2024', 'Winner – Best Screenplay, Sitges 2024'],
    critique: 'Lost in the Fog constructs mystery as atmosphere rather than puzzle, and in that choice reveals its true ambitions: this is not a film about what happened but about the conditions that make some things unhappenable, the community structures that produce collective silence as a survival mechanism. Emre Kaya\'s fishing village is built from the inside out — we feel its social architecture, its hierarchies and dependencies and unspoken contracts, before we understand any of its specific secrets. The fog is not atmosphere but argument: things cannot be seen clearly here because the community has agreed not to see them clearly, and the detective\'s investigation runs into this agreement at every turn. Kaya shoots with a saturated, heavy palette that makes even daylight feel obscured, and the sound design layers the village\'s acoustic textures — water, wind, the specific silences of people who know what they\'re not saying — into something that feels genuinely uncanny. The film is deliberately ambiguous about what is real and what the detective imagines, and this ambiguity is productive rather than evasive: it implicates us in the same epistemological fog as its protagonist, making us feel the weight of a truth that resists illumination. The investigation reveals not a solution but a deeper question about community, memory, and the cost of collective knowing.',
    availability: win(-3), // id 28
  },
  {
    id: 29,
    title: 'Night Walk',
    image: 'https://images.unsplash.com/photo-1673095288333-ac62dbbad575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBuaWdodCUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3Njc4NzQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A single 94-minute take through São Paulo after midnight.',
    synopsis: 'Shot in a single continuous take, Night Walk follows a woman through São Paulo\'s old quarter between 2 and 4 AM. The gradual revelation of why she is alone at this hour is the film\'s quiet, devastating centre.',
    director: 'Fernanda Lima',
    genres: ['Drama', 'Experimental', 'Urban'],
    runtime: 94,
    releaseYear: 2023,
    awards: ["Winner – Special Jury Prize, Cannes 2023 – Critics' Week"],
    critique: 'Night Walk is a philosophical commitment disguised as a technical feat. Fernanda Lima\'s single 94-minute take is not a stunt but an argument: that cinema owes its subjects the duration of lived experience, that the cut is always also an act of editorial control that shapes what we are permitted to feel. By refusing that control — walking with her protagonist through São Paulo\'s old quarter in real time, for the full duration of the experience — Lima discovers what the long take can still do that edited cinema cannot: collapse the distance between viewer and subject until you are not watching a woman walk but walking alongside her, feeling the specific weight of 3 AM on feet that have been moving for hours. The city becomes the film\'s co-protagonist — its rhythms, its dangers, its pockets of warmth in the small hours, the particular social ecology of streets after midnight. Lima shoots with a sensitivity to the city\'s acoustic and visual textures that reveals São Paulo as a character with its own emotional weather. The gradual revelation of the woman\'s reasons for being alone at this hour is handled with extraordinary restraint, arriving not as revelation but as accumulated understanding — the way real knowledge of another person arrives, through time and attention rather than disclosure.',
    availability: win(-2), // id 29
  },
  {
    id: 30,
    title: 'The Archives',
    image: 'https://images.unsplash.com/photo-1763368230669-3a2e97368032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwdmludGFnZSUyMGJvb2tzfGVufDF8fHx8MTc2Nzg3NDAyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A documentary about preserving film history against time and neglect.',
    synopsis: 'Eighty percent of all silent films are lost forever. The Archives follows the restorers and obsessives racing against the decay of nitrate and the institutional erosion of funding, treating preservation as a form of love.',
    director: 'Camille Breton',
    genres: ['Documentary', 'Film History', 'Art'],
    runtime: 90,
    releaseYear: 2024,
    awards: ['Official Selection – Cannes Classics 2024', 'Winner – Best Documentary, Tribeca 2024'],
    critique: 'The Archives is the most moving film about cinema since Godard turned the medium on itself, and it achieves its emotional force through a simple, devastating proposition: that every film saved is a stay against forgetting, and every film lost is a kind of death. Camille Breton\'s archivists are not technicians but mourners — people who work with the full knowledge that they will lose most of what they love, and who work anyway, with the careful, precise love of someone who understands that the act of preservation is itself a form of meaning regardless of its ultimate outcome. The film observes the material reality of film archives with a tactile fascination — the smell of vinegar syndrome, the amber of nitrate under UV light, the sound of a restored print passing through a projector for the first time in eighty years — that transforms technical process into ritual. Breton is also alert to the politics of preservation: what gets saved is not determined by quality or historical importance but by the accidents of institutional survival and private obsession, and the film makes visible the systematic losses that result from decades of underfunding and cultural indifference. The Archives is ultimately about the relationship between love and loss, about what we preserve and what we allow to disappear, and it makes that relationship feel urgent not just for cinema but for everything we keep and everything we fail to.',
    availability: win(-1), // id 30
  },
  {
    id: 31,
    title: 'Fragments',
    image: 'https://images.unsplash.com/photo-1606522104957-b56686d56e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGZpbG0lMjBkYXJrJTIwY2luZW1hdGljfGVufDF8fHx8MTc2Nzg3NDAxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Piecing together a self from the testimony of those who claim to know it.',
    synopsis: 'A man recovering from a traumatic brain injury must reconstruct who he is from the contradictory testimony of people who claim to know him. Identity, the film argues, is always a collaborative fiction.',
    director: 'Daria Volkov',
    genres: ['Drama', 'Psychological', 'Mystery'],
    runtime: 100,
    releaseYear: 2023,
    awards: ['Winner – FIPRESCI Prize, Venice Film Festival 2023', 'Official Selection – TIFF 2023'],
    critique: 'Fragments is formally brilliant and emotionally harrowing — a film about identity constructed as a demonstration of its own argument. Daria Volkov builds her narrative from contradictory testimony, giving us a protagonist who must choose which version of himself to believe from accounts that cannot all be true, and structures the film to give the audience the same impossible task. We piece together who this man is from the same fragmentary, unreliable evidence he has, and the experience of doing so makes viscerally real what philosophy has long argued: that identity is not discovered but constructed, and the construction is always suspect. Volkov\'s formal choices are precise rather than showy — the non-linear structure is not disorientation for its own sake but the exact right grammar for a story about a self that cannot sequence its own past. The performances are calibrated to the film\'s epistemological project: each person claiming to know the protagonist gives us a subtly different person, and the gaps between versions are as revealing as the accounts themselves. What Fragments ultimately argues — through its form as much as its content — is that the self is not a thing we possess but a practice we perform in relation to others, and that this makes it both more fragile and more resilient than we would like to believe.',
    availability: win(0), // id 31 — starts today, ends in 30 days
  },
];

export const HERO_FILM_IDS = [2, 3, 4]; // 3 available films for the hero carousel
export const GRID_FILM_IDS = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // 27 more = 30 total library films

export function isFilmAvailable(film: FilmData, now: Date = new Date()): boolean {
  const start = new Date(film.availability.start);
  const end = new Date(film.availability.end);
  return now >= start && now <= end;
}

export function getFilmById(id: number): FilmData | undefined {
  return ALL_FILMS.find(f => f.id === id);
}

export function getAvailableFilms(now: Date = new Date()): FilmData[] {
  return ALL_FILMS.filter(f => isFilmAvailable(f, now));
}
