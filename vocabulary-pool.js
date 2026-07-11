// SAT Vocabulary Web Application - Preloaded Pool & Dictionary API Utility

const DEFAULT_VOCAB_POOL = [
    {
        "word": "copious",
        "synonyms": [
            "profusion",
            "abundant",
            "fecundity"
        ],
        "definition": "Abundant in supply or quantity; plentiful.",
        "sentence": "The researcher took ______ notes during the three-hour lecture, filling every page of her notebook.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "fecundity",
        "synonyms": [
            "profusion",
            "copious",
            "fertileness",
            "abundant"
        ],
        "definition": "The ability to produce an abundance of offspring or growth.",
        "sentence": "______ declines rapidly after the age of 40.",
        "difficulty": "medium",
        "distractors": [
            "iconoclasm",
            "expediency",
            "animosity"
        ]
    },
    {
        "word": "abundant",
        "synonyms": [
            "overflowing",
            "teeming",
            "exuberant",
            "profusion"
        ],
        "definition": "Existing or available in large quantities; overflowing.",
        "sentence": "Plant fossils are ______ in some types of rock.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "profusion",
        "synonyms": [
            "copious",
            "fecundity",
            "abundant"
        ],
        "definition": "An abundance or large quantity of something.",
        "sentence": "The book teems with a Flemish ______ of detail.",
        "difficulty": "medium",
        "distractors": [
            "iconoclasm",
            "expediency",
            "animosity"
        ]
    },
    {
        "word": "operative",
        "synonyms": [],
        "definition": "Functioning or having effect.",
        "sentence": "The station will be ______ again in January.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "attenuate",
            "repertory"
        ]
    },
    {
        "word": "elasticity",
        "synonyms": [],
        "definition": "Adaptability; the ability to change or stretch based on context.",
        "sentence": "As the skin grows older it loses its ______.",
        "difficulty": "hard",
        "distractors": [
            "oblique",
            "demarcation",
            "restitution"
        ]
    },
    {
        "word": "annotate",
        "synonyms": [],
        "definition": "To add explanatory notes to a text or diagram.",
        "sentence": "Students were required to ______ each passage in the novel with textual evidence supporting their interpretations.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "preclude"
        ]
    },
    {
        "word": "adhere",
        "synonyms": [
            "cleave",
            "stick",
            "cling"
        ],
        "definition": "To firmly stick to a practice, belief, rule, or tradition.",
        "sentence": "The eggs of these fish ______ to plant leaves.",
        "difficulty": "easy",
        "distractors": [
            "refute",
            "assert",
            "preclude"
        ]
    },
    {
        "word": "acquiesced",
        "synonyms": [
            "go along with",
            "consent",
            "consensus",
            "accept"
        ],
        "definition": "Accepted something reluctantly but without protest.",
        "sentence": "Though she disagreed with the decision, she ______ rather than prolong the argument further.",
        "difficulty": "hard",
        "distractors": [
            "alleviate",
            "reprieve",
            "circumvent"
        ]
    },
    {
        "word": "concede",
        "synonyms": [
            "let in",
            "come around",
            "give way",
            "acquiesced"
        ],
        "definition": "To admit that something is true or valid after first denying it.",
        "sentence": "After reviewing the data, the scientist was forced to ______ that his original hypothesis was flawed.",
        "difficulty": "medium",
        "distractors": [
            "alleviate",
            "reprieve",
            "circumvent"
        ]
    },
    {
        "word": "consensus",
        "synonyms": [
            "concede",
            "acquiesced"
        ],
        "definition": "A general agreement among a group.",
        "sentence": "The committee finally reached a ______ that the budget should be increased by fifteen percent.",
        "difficulty": "medium",
        "distractors": [
            "oblique",
            "demarcation",
            "restitution"
        ]
    },
    {
        "word": "equivocal",
        "synonyms": [
            "nebulous",
            "opaque",
            "doubtful",
            "double entendre"
        ],
        "definition": "Open to more than one interpretation; ambiguous or uncertain.",
        "sentence": "The results of the police enquiry were ______.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "ambiguous",
        "synonyms": [
            "nebulous",
            "opaque",
            "arcane",
            "indecipherable"
        ],
        "definition": "Open to more than one interpretation; inexact or unclear.",
        "sentence": "The statutory language was deliberately ______, allowing courts discretion in applying it to novel situations.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "indecipherable",
        "synonyms": [
            "nebulous",
            "opaque",
            "arcane",
            "undecipherable"
        ],
        "definition": "Not able to be read, decoded, or understood.",
        "sentence": "The ancient manuscript was written in an ______ script that no modern linguist could decode.",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "nebulous",
        "synonyms": [
            "opaque",
            "arcane",
            "indecipherable",
            "mystifying"
        ],
        "definition": "In the form of a cloud or haze; hazy, vague, or ill-defined.",
        "sentence": "So - called truth is a ______ thing at best.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "opaque",
        "synonyms": [
            "nebulous",
            "cloud",
            "arcane",
            "indecipherable"
        ],
        "definition": "Not able to be seen through; hard to understand.",
        "sentence": "The report was written in long, ______ sentences.",
        "difficulty": "easy",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "arcane",
        "synonyms": [
            "nebulous",
            "opaque",
            "clandestine",
            "enigmatic"
        ],
        "definition": "Understood by few; mysterious or secret.",
        "sentence": "The triple jump is certainly an ______ discipline.",
        "difficulty": "easy",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "mystifying",
        "synonyms": [
            "nebulous",
            "opaque",
            "arcane",
            "indecipherable"
        ],
        "definition": "Utterly bewildering or perplexing.",
        "sentence": "The thing was shown with ______ certitude.",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "perceptible",
            "counterintuitive"
        ]
    },
    {
        "word": "placate",
        "synonyms": [
            "conciliate",
            "satisfy",
            "propitiate",
            "appease"
        ],
        "definition": "To make someone less angry or hostile; appease.",
        "sentence": "Management offered a modest pay raise in an attempt to ______ the frustrated workforce.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "preclude"
        ]
    },
    {
        "word": "contentious",
        "synonyms": [
            "animosity",
            "antagonistic"
        ],
        "definition": "Causing or likely to cause an argument; highly controversial.",
        "sentence": "Logging on public lands is a ______ issue.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "animosity",
        "synonyms": [
            "opposition",
            "contentious",
            "acrimony",
            "hatred"
        ],
        "definition": "Strong hostility or friction.",
        "sentence": "She felt a certain amount of ______ towards him.",
        "difficulty": "medium",
        "distractors": [
            "oblique",
            "demarcation",
            "restitution"
        ]
    },
    {
        "word": "antagonistic",
        "synonyms": [
            "animosity",
            "contentious"
        ],
        "definition": "Showing or feeling active opposition or hostility toward something.",
        "sentence": "He's extremely ______ towards all critics.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "appraised",
        "synonyms": [
            "calibration"
        ],
        "definition": "Assessed the value, quality, or proficiency of something.",
        "sentence": "The auctioneer ______ the painting at nearly two million dollars, shocking its unsuspecting owner.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "preclude"
        ]
    },
    {
        "word": "calibration",
        "synonyms": [
            "appraised"
        ],
        "definition": "The adjustment or precise marking of an instrument or plan.",
        "sentence": "The ______ of the laboratory instruments must be verified before each experiment to ensure accuracy.",
        "difficulty": "hard",
        "distractors": [
            "oblique",
            "demarcation",
            "restitution"
        ]
    },
    {
        "word": "ascribe",
        "synonyms": [
            "attribute",
            "impute"
        ],
        "definition": "To attribute something to a specific cause, source, or author.",
        "sentence": "One may ______ these problems to the federal government; however, at this stage it is unclear what caused them.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "preclude"
        ]
    },
    {
        "word": "eschew",
        "synonyms": [],
        "definition": "Deliberately avoid using; abstain from or shun.",
        "sentence": "We should obviously ______ political fanaticism.",
        "difficulty": "easy",
        "distractors": [
            "refute",
            "assert",
            "preclude"
        ]
    },
    {
        "word": "preclude",
        "synonyms": [
            "circumvent",
            "obviated",
            "hampered",
            "stymie"
        ],
        "definition": "To prevent from happening; make impossible.",
        "sentence": "A prior engagement will ______ me from coming.",
        "difficulty": "medium",
        "distractors": [
            "substantiate",
            "alleviate",
            "attrition"
        ]
    },
    {
        "word": "circumvent",
        "synonyms": [
            "stymie",
            "obviated",
            "preclude",
            "hampered"
        ],
        "definition": "To find a way around an obstacle or rule.",
        "sentence": "The concept of ______ is demonstrated when to find a way around an obstacle or rule, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "substantiate",
            "alleviate",
            "attrition"
        ]
    },
    {
        "word": "stymie",
        "synonyms": [
            "block",
            "circumvent",
            "obviated",
            "thwart"
        ],
        "definition": "To prevent or hinder the progress of an action or plan.",
        "sentence": "I was completely ______ by her refusal to help.",
        "difficulty": "easy",
        "distractors": [
            "substantiate",
            "alleviate",
            "attrition"
        ]
    },
    {
        "word": "hampered",
        "synonyms": [
            "hinder",
            "inveigle",
            "encumber",
            "circumvent"
        ],
        "definition": "Hindered or impeded the movement or progress of.",
        "sentence": "Competition pigeons are ______ for the truck trip to the point of release where the race back starts.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "attenuate",
            "repertory"
        ]
    },
    {
        "word": "obviated",
        "synonyms": [
            "circumvent",
            "preclude",
            "hampered",
            "stymie"
        ],
        "definition": "Removed a need or difficulty; avoided.",
        "sentence": "The concept of ______ is demonstrated when removed a need or difficulty; avoided, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "substantiate",
            "alleviate",
            "attrition"
        ]
    },
    {
        "word": "rudimentary",
        "synonyms": [],
        "definition": "Involving or limited to basic or undeveloped principles.",
        "sentence": "The classroom equipment is pretty ______.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "attenuate",
            "repertory"
        ]
    },
    {
        "word": "banal",
        "synonyms": [
            "tedious",
            "prosaic",
            "everyday"
        ],
        "definition": "So lacking in originality as to be obvious and boring.",
        "sentence": "The speech was technically accomplished but ultimately ______, filled with familiar sentiments that no one in the audience would remember.",
        "difficulty": "easy",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "tedious",
        "synonyms": [
            "banal"
        ],
        "definition": "Too long, slow, or dull; tiresome or monotonous.",
        "sentence": "Her visits were starting to get a bit ______.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "demarcation",
        "synonyms": [
            "circumscription"
        ],
        "definition": "The action of fixing a boundary, limit, or distinction.",
        "sentence": "The concept of ______ is demonstrated when the action of fixing a boundary, limit, or distinction, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "iconoclasm",
            "expediency",
            "elasticity"
        ]
    },
    {
        "word": "circumscription",
        "synonyms": [
            "demarcation"
        ],
        "definition": "The act of restricting or bounding something within limits.",
        "sentence": "The ______ in the APG system of the family Malvaceae includes the former families Bombacaceae, Sterculiaceae and Tiliaceae.",
        "difficulty": "hard",
        "distractors": [
            "iconoclasm",
            "expediency",
            "elasticity"
        ]
    },
    {
        "word": "discretion",
        "synonyms": [
            "prudently",
            "discerning",
            "shrewd"
        ],
        "definition": "The quality of behaving or speaking with careful judgment.",
        "sentence": "______ is the better part of valor.",
        "difficulty": "hard",
        "distractors": [
            "oblique",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "discerning",
        "synonyms": [
            "ken",
            "distinguish",
            "prudently",
            "shrewd"
        ],
        "definition": "Having or showing good judgment and sharp perception.",
        "sentence": "A ______ reader recognizes when an author is using emotional language to bypass rather than support rational argument.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "prudently",
        "synonyms": [
            "discretion",
            "discerning",
            "shrewd"
        ],
        "definition": "In a way that shows care and thought for the future.",
        "sentence": "The concept of ______ is demonstrated when in a way that shows care and thought for the future, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "foment",
            "extrapolate",
            "concede"
        ]
    },
    {
        "word": "shrewd",
        "synonyms": [
            "discretion",
            "prudently",
            "discerning"
        ],
        "definition": "Having or showing sharp powers of judgment.",
        "sentence": "The ______ negotiator waited until the other party had committed to a deadline before revealing her leverage.",
        "difficulty": "easy",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "scrupulous",
        "synonyms": [
            "scrutinized",
            "vigilance",
            "deliberation",
            "meticulous"
        ],
        "definition": "Diligent, thorough, and extremely attentive to details.",
        "sentence": "The accountant was ______ in her documentation, maintaining records that could withstand scrutiny even years after the fact.",
        "difficulty": "hard",
        "distractors": [
            "quintessential",
            "incipient",
            "unpretentious"
        ]
    },
    {
        "word": "meticulous",
        "synonyms": [
            "scrutinized",
            "scrupulous",
            "vigilance",
            "deliberation"
        ],
        "definition": "Showing great attention to detail; very careful and precise.",
        "sentence": "My father was ______ about his appearance.",
        "difficulty": "hard",
        "distractors": [
            "quintessential",
            "incipient",
            "unpretentious"
        ]
    },
    {
        "word": "deliberation",
        "synonyms": [
            "scrutinized",
            "scrupulous",
            "vigilance",
            "meticulous"
        ],
        "definition": "Long and careful consideration or discussion.",
        "sentence": "After much ______, a decision was reached.",
        "difficulty": "hard",
        "distractors": [
            "quintessential",
            "incipient",
            "unpretentious"
        ]
    },
    {
        "word": "scrutinized",
        "synonyms": [
            "vigilance",
            "scrupulous",
            "deliberation",
            "meticulous"
        ],
        "definition": "Examined or inspected closely and thoroughly.",
        "sentence": "The concept of ______ is demonstrated when examined or inspected closely and thoroughly, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "quintessential",
            "incipient",
            "unpretentious"
        ]
    },
    {
        "word": "vigilance",
        "synonyms": [
            "scrutinized",
            "scrupulous",
            "deliberation",
            "meticulous"
        ],
        "definition": "The action or state of keeping careful watch for danger.",
        "sentence": "The concept of ______ is demonstrated when the action or state of keeping careful watch for danger, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "quintessential",
            "incipient",
            "unpretentious"
        ]
    },
    {
        "word": "perfunctory",
        "synonyms": [
            "facile"
        ],
        "definition": "Carried out with a minimum of effort, care, or reflection.",
        "sentence": "A 6-3 third set lasted only 26 ______ minutes.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "facile",
        "synonyms": [
            "perfunctory"
        ],
        "definition": "Appearing neat only by ignoring true complexities; superficial.",
        "sentence": "Her ______ nature adapted itself to any company.",
        "difficulty": "easy",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "engender",
        "synonyms": [
            "foment",
            "catalyze"
        ],
        "definition": "To cause or give rise to a specific feeling, situation, or condition.",
        "sentence": "The minister's speech did not ______ confidence in his judgment.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "catalyze",
        "synonyms": [
            "engender",
            "foment"
        ],
        "definition": "To cause or accelerate a reaction or change.",
        "sentence": "The concept of ______ is demonstrated when to cause or accelerate a reaction or change, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "foment",
        "synonyms": [
            "engender",
            "catalyze"
        ],
        "definition": "Instigate or stir up an undesirable or violent course of action.",
        "sentence": "The rebels know the truth and seek to ______ revolution.",
        "difficulty": "easy",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "irrefutable",
        "synonyms": [
            "infallible"
        ],
        "definition": "Impossible to deny or disprove.",
        "sentence": "Only truth that is tested by practice is ______.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "infallible",
        "synonyms": [
            "irrefutable"
        ],
        "definition": "Incapable of making mistakes or being wrong.",
        "sentence": "Although he was experienced, he was not ______.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "variable",
        "synonyms": [
            "variable quantity",
            "changeable",
            "parameter",
            "alterable",
            "flexible"
        ],
        "definition": "Not consistent or having a fixed pattern; liable to change.",
        "sentence": "The speed of the windscreen wipers is ______.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "attenuate",
            "repertory"
        ]
    },
    {
        "word": "vindicate",
        "synonyms": [],
        "definition": "To clear someone of blame or suspicion; prove to be right.",
        "sentence": "The petitioner asks whether Seia can ______.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "attenuate",
            "repertory"
        ]
    },
    {
        "word": "manifest",
        "synonyms": [
            "palpable",
            "perceptible",
            "explicable",
            "unequivocal"
        ],
        "definition": "(adj) Clear or obvious to the eye or mind; easy to perceive (v.) to reveal, demonstrate",
        "sentence": "The anger he felt is ______ in his paintings.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "unequivocal",
        "synonyms": [
            "palpable",
            "perceptible",
            "explicable",
            "manifest"
        ],
        "definition": "Leaving no doubt; clear, unambiguous, and plain.",
        "sentence": "The answer to our request was an ______ \"no\".",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "palpable",
        "synonyms": [
            "perceptible",
            "explicable",
            "manifest",
            "unequivocal"
        ],
        "definition": "So intense as to seem almost tangible; plain to see or feel.",
        "sentence": "The concept of ______ is demonstrated when so intense as to seem almost tangible; plain to see or feel, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "conspicuous",
        "synonyms": [
            "palpable",
            "perceptible",
            "explicable",
            "manifest"
        ],
        "definition": "Standing out so as to be clearly visible; attracting notice.",
        "sentence": "The stain on her dress was horribly ______.",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "discern",
        "synonyms": [
            "palpable",
            "perceptible",
            "explicable",
            "manifest"
        ],
        "definition": "To distinguish, perceive, or recognize clearly.",
        "sentence": "I could just ______ a figure in the darkness.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "perceptible",
        "synonyms": [
            "palpable",
            "explicable",
            "manifest",
            "unequivocal"
        ],
        "definition": "Able to be seen, noticed, or detected by the mind.",
        "sentence": "Her voice was barely ______ over the noise, but her gestures made her meaning clear.",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "explicable",
        "synonyms": [
            "palpable",
            "perceptible",
            "manifest",
            "unequivocal"
        ],
        "definition": "Able to be accounted for or understood.",
        "sentence": "The concept of ______ is demonstrated when able to be accounted for or understood, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "variable",
            "counterintuitive"
        ]
    },
    {
        "word": "repertory",
        "synonyms": [],
        "definition": "A stock of skills, items, or behaviors habitually used.",
        "sentence": "Jane weighed down her ______ with these plays.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "attenuate",
            "explicable"
        ]
    },
    {
        "word": "conflate",
        "synonyms": [
            "coalesce",
            "amalgam",
            "cohesion"
        ],
        "definition": "To combine two or more separate text ideas or concepts into one.",
        "sentence": "The concept of ______ is demonstrated when to combine two or more separate text ideas or concepts into one, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "amalgam",
        "synonyms": [
            "cohesion",
            "coalesce",
            "conflate"
        ],
        "definition": "A mixture or blend of different elements.",
        "sentence": "The film script is an ______ of all three books.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "coalesce",
        "synonyms": [
            "amalgam",
            "unite",
            "amalgamate",
            "merge"
        ],
        "definition": "To come together to form one mass or whole.",
        "sentence": "Particles do not ______ with other particles.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "cohesion",
        "synonyms": [
            "coalesce",
            "amalgam",
            "conflate"
        ],
        "definition": "The action or fact of forming a united whole.",
        "sentence": "The Bears will have to find ______ in a hurry.",
        "difficulty": "medium",
        "distractors": [
            "oblique",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "dictate",
        "synonyms": [
            "prescribed"
        ],
        "definition": "To lay down authoritatively; prescribe or determine.",
        "sentence": "The concept of ______ is demonstrated when to lay down authoritatively; prescribe or determine, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "alleviate",
            "reprieve",
            "eschew"
        ]
    },
    {
        "word": "prescribed",
        "synonyms": [
            "dictate"
        ],
        "definition": "Stated authoritatively as a rule or course of action.",
        "sentence": "The doctor ______ aspirin.",
        "difficulty": "hard",
        "distractors": [
            "alleviate",
            "reprieve",
            "eschew"
        ]
    },
    {
        "word": "analogous",
        "synonyms": [
            "correspondence",
            "tantamount",
            "similar",
            "comparable"
        ],
        "definition": "Comparable in certain respects, typically to make a clearer explanation.",
        "sentence": "The concept of ______ is demonstrated when comparable in certain respects, typically to make a clearer explanation, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "tantamount",
        "synonyms": [
            "correspondence",
            "analogous",
            "analogy"
        ],
        "definition": "Equivalent in seriousness to; virtually the same as.",
        "sentence": "The concept of ______ is demonstrated when equivalent in seriousness to; virtually the same as, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "analogy",
        "synonyms": [
            "correspondence",
            "analogous",
            "tantamount"
        ],
        "definition": "A comparison between two things, typically for clarification.",
        "sentence": "The concept of ______ is demonstrated when a comparison between two things, typically for clarification, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "iconoclasm",
            "expediency",
            "elasticity"
        ]
    },
    {
        "word": "correspondence",
        "synonyms": [
            "analogous",
            "analogy",
            "tantamount"
        ],
        "definition": "A close similarity, connection, or equivalence between things.",
        "sentence": "The concept of ______ is demonstrated when a close similarity, connection, or equivalence between things, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "iconoclasm",
            "expediency",
            "elasticity"
        ]
    },
    {
        "word": "intricate",
        "synonyms": [
            "nuanced"
        ],
        "definition": "Very complicated, detailed, or interconnected.",
        "sentence": "A good defense lawyer has an ______ network.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "nuanced",
        "synonyms": [
            "intricate"
        ],
        "definition": "Characterized by subtle shades of meaning or expression.",
        "sentence": "The concept of ______ is demonstrated when characterized by subtle shades of meaning or expression, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "exhaustive",
        "synonyms": [
            "all-encompassing",
            "tiring",
            "weariful",
            "thorough"
        ],
        "definition": "Fully comprehensive, leaving no elements or stone unturned.",
        "sentence": "The report represented an ______ survey of the existing literature, leaving readers with no reason to doubt the breadth of the authors' research.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "attenuate",
            "explicable"
        ]
    },
    {
        "word": "comprise",
        "synonyms": [
            "form",
            "make up",
            "encompass"
        ],
        "definition": "To consist of; be made up of.",
        "sentence": "The concept of ______ is demonstrated when to consist of; be made up of, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "alleviate",
            "reprieve",
            "eschew"
        ]
    },
    {
        "word": "encompass",
        "synonyms": [
            "embrace",
            "comprise",
            "comprehend"
        ],
        "definition": "To surround and hold within; include comprehensively.",
        "sentence": "The course will ______ physics, chemistry and biology.",
        "difficulty": "medium",
        "distractors": [
            "alleviate",
            "reprieve",
            "eschew"
        ]
    },
    {
        "word": "paradoxically",
        "synonyms": [],
        "definition": "In a seemingly absurd or self-contradictory way.",
        "sentence": "______, the more strictly the curfew was enforced, the more teenagers seemed determined to break it.",
        "difficulty": "hard",
        "distractors": [
            "vigilance",
            "intricate",
            "premeditated"
        ]
    },
    {
        "word": "counterintuitive",
        "synonyms": [],
        "definition": "Contrary to intuition or common-sense expectation.",
        "sentence": "When we do that are often quite ______ results.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "attenuate",
            "explicable"
        ]
    },
    {
        "word": "rectify",
        "synonyms": [],
        "definition": "To put something right; correct a mistake or issue.",
        "sentence": "The concept of ______ is demonstrated when to put something right; correct a mistake or issue, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "detractor",
        "synonyms": [
            "mudslinger",
            "cynic",
            "defamer",
            "libeler"
        ],
        "definition": "A person who disparages someone or something, casting doubt.",
        "sentence": "She put up a game fight against her ______.",
        "difficulty": "medium",
        "distractors": [
            "oblique",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "disparage",
        "synonyms": [
            "decry",
            "denigrate"
        ],
        "definition": "To regard or represent as being of little worth; deprecate.",
        "sentence": "V : Now, now. Do not ______ the noble hexagon.",
        "difficulty": "medium",
        "distractors": [
            "extol",
            "assuage",
            "repudiate"
        ]
    },
    {
        "word": "decry",
        "synonyms": [
            "disparage",
            "denigrate"
        ],
        "definition": "To publicly denounce or condemn.",
        "sentence": "The concept of ______ is demonstrated when to publicly denounce or condemn, as evident in many academic texts.",
        "difficulty": "easy",
        "distractors": [
            "extol",
            "assuage",
            "repudiate"
        ]
    },
    {
        "word": "denigrate",
        "synonyms": [
            "disparage",
            "decry"
        ],
        "definition": "To criticize unfairly; disparage.",
        "sentence": "The campaign's strategy was to ______ its opponents rather than present a coherent policy platform.",
        "difficulty": "medium",
        "distractors": [
            "extol",
            "assuage",
            "repudiate"
        ]
    },
    {
        "word": "adorn",
        "synonyms": [
            "grace",
            "beautify",
            "ornament",
            "prettify"
        ],
        "definition": "To make more beautiful or attractive; decorate.",
        "sentence": "The concept of ______ is demonstrated when to make more beautiful or attractive; decorate, as evident in many academic texts.",
        "difficulty": "easy",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "ornamental",
        "synonyms": [
            "beautifying",
            "embellishing",
            "decorative",
            "adorn"
        ],
        "definition": "Serving as an aesthetic decoration rather than a function.",
        "sentence": "There was a tray on an ______ garden table.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "abate",
        "synonyms": [
            "soothe",
            "pacify",
            "cut short",
            "depress"
        ],
        "definition": "To become less intense, active, or widespread; subside.",
        "sentence": "City officials hoped the new zoning law would ______ the rapid spread of overdevelopment in the neighborhood.",
        "difficulty": "easy",
        "distractors": [
            "repudiate",
            "convene",
            "substantiate"
        ]
    },
    {
        "word": "mitigate",
        "synonyms": [
            "assuage",
            "diminish",
            "check",
            "attrition"
        ],
        "definition": "To make less severe, serious, painful, or sharp.",
        "sentence": "Governments should endeavour to ______ distress.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "convene",
            "substantiate"
        ]
    },
    {
        "word": "attrition",
        "synonyms": [
            "assuage",
            "attrit",
            "depleted",
            "natural wastage"
        ],
        "definition": "The process of gradually reducing the strength or effectiveness of something.",
        "sentence": "The concept of ______ is demonstrated when the process of gradually reducing the strength or effectiveness of something, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "convene",
            "substantiate"
        ]
    },
    {
        "word": "assuage",
        "synonyms": [
            "attrition",
            "depleted",
            "alleviate",
            "abate"
        ],
        "definition": "To make an unpleasant feeling less intense.",
        "sentence": "His reply did little to ______ my suspicions.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "convene",
            "substantiate"
        ]
    },
    {
        "word": "attenuate",
        "synonyms": [
            "assuage",
            "attrition",
            "depleted",
            "alleviate"
        ],
        "definition": "To reduce the force, effect, value, or thickness of.",
        "sentence": "In a forest, wet wood and needles ______ the signals.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "alleviate",
        "synonyms": [
            "assuage",
            "relieve",
            "attrition",
            "depleted"
        ],
        "definition": "To make suffering or a problem less severe.",
        "sentence": "The pain medication did little to ______ the patient's chronic discomfort.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "convene",
            "substantiate"
        ]
    },
    {
        "word": "curtailed",
        "synonyms": [
            "assuage",
            "restrain",
            "behedge",
            "attrition"
        ],
        "definition": "Reduced in extent or quantity; imposed a restriction on.",
        "sentence": "The concept of ______ is demonstrated when reduced in extent or quantity; imposed a restriction on, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "convene",
            "substantiate"
        ]
    },
    {
        "word": "depleted",
        "synonyms": [
            "assuage",
            "attrition",
            "alleviate",
            "abate"
        ],
        "definition": "Diminished in number or quantity.",
        "sentence": "The concept of ______ is demonstrated when diminished in number or quantity, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "dwindling",
        "synonyms": [
            "assuage",
            "attrition",
            "depleted",
            "alleviate"
        ],
        "definition": "Gradually diminishing in size, amount, or strength.",
        "sentence": "The number of wild animals on the earth is ______.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "profound",
        "synonyms": [],
        "definition": "Having or showing great insight, intensity, or depth.",
        "sentence": "Her speech made a ______ impact on everyone.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "reprieve",
        "synonyms": [],
        "definition": "A cancellation or postponement of an undesirable event.",
        "sentence": "The concept of ______ is demonstrated when a cancellation or postponement of an undesirable event, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "annihilate",
        "synonyms": [],
        "definition": "To destroy utterly; obliterate.",
        "sentence": "The heavy bombing almost ______ the town.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "resolute",
        "synonyms": [],
        "definition": "Admirably purposeful, determined, and unwavering.",
        "sentence": "She's utterly ______ in her refusal to apologise.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "arduous",
        "synonyms": [
            "grapple",
            "insurmountable"
        ],
        "definition": "Involving or requiring strenuous effort; difficult and tiring.",
        "sentence": "The concept of ______ is demonstrated when involving or requiring strenuous effort; difficult and tiring, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "insurmountable",
        "synonyms": [
            "arduous",
            "grapple"
        ],
        "definition": "Too great to be overcome or resolved.",
        "sentence": "It would not constitute an ______ problem.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "grapple",
        "synonyms": [
            "arduous",
            "insurmountable"
        ],
        "definition": "To struggle to deal with or understand a difficult problem.",
        "sentence": "______ up there and you'll find two Riddler trophies.http://",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "partition",
        "synonyms": [],
        "definition": "The action of dividing or separating something into distinct parts.",
        "sentence": "The workers ______ a room into three parts.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "elicited",
        "synonyms": [],
        "definition": "Evoked or drew out a reaction or response from someone.",
        "sentence": "At that time, behavior is ______ by stimulation.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "preliminary",
        "synonyms": [],
        "definition": "Denoting an action or event preceding something more important.",
        "sentence": "The concept of ______ is demonstrated when denoting an action or event preceding something more important, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "efficacy",
        "synonyms": [],
        "definition": "The ability to produce a desired or intended result.",
        "sentence": "Recent medical studies confirm the ______ of a healthier lifestyle.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "accentuate",
        "synonyms": [],
        "definition": "To make more noticeable or prominent; emphasize.",
        "sentence": "It helps ______ my curls, and It'smells great.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "foster",
        "synonyms": [],
        "definition": "To encourage or promote the development of something.",
        "sentence": "Mr ______ is a tower of strength to his party.",
        "difficulty": "easy",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "indulge",
        "synonyms": [],
        "definition": "Allow oneself to enjoy the pleasure of.",
        "sentence": "The concept of ______ is demonstrated when allow oneself to enjoy the pleasure of, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "entrenched",
        "synonyms": [
            "trench",
            "consolidate",
            "dig in"
        ],
        "definition": "Firmly established and difficult or unlikely to change.",
        "sentence": "Bureaucratic resistance to change is often most ______ in organizations that have operated without external competition.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "ubiquitous",
        "synonyms": [
            "pervasive"
        ],
        "definition": "Present, appearing, or found everywhere at once.",
        "sentence": "______ skylarks sang madly in the blue above.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "pervasive",
        "synonyms": [
            "ubiquitous"
        ],
        "definition": "Spreading widely throughout an area, group, or system.",
        "sentence": "First(), it is not so ______.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "epitomize",
        "synonyms": [
            "quintessential",
            "archetypal"
        ],
        "definition": "To serve as a perfect, definitive example of a quality or type.",
        "sentence": "The architect's final design came to ______ the modernist principle that form must follow function.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "quintessential",
        "synonyms": [
            "archetypal",
            "epitomize"
        ],
        "definition": "Representing the most perfect or typical example of a class.",
        "sentence": "This was ______ Midwestern farming country.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "archetypal",
        "synonyms": [
            "quintessential",
            "epitomize"
        ],
        "definition": "Very typical of a certain kind of person or thing; original model.",
        "sentence": "Da Vinci was an ______ Renaissance figure.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "marginalize",
        "synonyms": [
            "alienate",
            "invisibilize",
            "peripheralize"
        ],
        "definition": "To treat a person or group as insignificant or peripheral.",
        "sentence": "We must not ______ the poor in our society.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "expound",
        "synonyms": [
            "spell out"
        ],
        "definition": "To present and explain a theory or idea systematically and in detail.",
        "sentence": "The policy brief gave the economist a platform to ______ at length on the implications of the proposed tariffs.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "extrapolate",
        "synonyms": [],
        "definition": "To extend application of a method/conclusion to an unknown context.",
        "sentence": "Economists attempted to ______ future unemployment trends from the current quarter's labor data.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "spurious",
        "synonyms": [
            "counterfactual",
            "contrived",
            "belie"
        ],
        "definition": "Not being what it purports to be; false, fake, or illegitimate.",
        "sentence": "He demolished the Opposition's ______ arguments.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "contrived",
        "synonyms": [
            "becast",
            "hatch",
            "plot",
            "staged"
        ],
        "definition": "Deliberately created or forced rather than arising naturally; artificial.",
        "sentence": "The concept of ______ is demonstrated when deliberately created or forced rather than arising naturally; artificial, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "belie",
        "synonyms": [
            "counterfactual",
            "contrived",
            "spurious"
        ],
        "definition": "To fail to give a true notion or impression of something; disguise or contradict.",
        "sentence": "The concept of ______ is demonstrated when to fail to give a true notion or impression of something; disguise or contradict, as evident in many academic texts.",
        "difficulty": "easy",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "counterfactual",
        "synonyms": [
            "contrived",
            "spurious",
            "belie"
        ],
        "definition": "Expressing what has not happened or is contrary to stated fact.",
        "sentence": "Predicting the future is a form of forward ______ thinking.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "latitude",
        "synonyms": [],
        "definition": "Scope for freedom of action or thought.",
        "sentence": "His parents gave him a great deal of ______.",
        "difficulty": "medium",
        "distractors": [
            "oblique",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "saturated",
        "synonyms": [
            "drenched",
            "sodden"
        ],
        "definition": "Thoroughly soaked; containing maximum threshold.",
        "sentence": "The sittingroom was ______ with perfume.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "convene",
        "synonyms": [
            "congregate",
            "unite",
            "convoke",
            "meet"
        ],
        "definition": "To come or bring together for a meeting or activity; assemble.",
        "sentence": "With no parliament, the board can not ______.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "succumb",
        "synonyms": [],
        "definition": "Fail to resist pressure, temptation, or some other negative force.",
        "sentence": "Gandhi did not often ______ to that temptation.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "forfeiture",
        "synonyms": [
            "waive"
        ],
        "definition": "The loss or giving up of something as a penalty or choice.",
        "sentence": "The concept of ______ is demonstrated when the loss or giving up of something as a penalty or choice, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "oblique",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "waive",
        "synonyms": [
            "forfeiture"
        ],
        "definition": "To refrain from insisting on or using a right or claim.",
        "sentence": "If you ______ the right to be silent, anything you say can be used against you in a court of law.",
        "difficulty": "easy",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "conjecture",
        "synonyms": [
            "supposition",
            "halseny",
            "presuppose"
        ],
        "definition": "An opinion or conclusion formed on the basis of incomplete information.",
        "sentence": "What the real cause was is open to ______.",
        "difficulty": "hard",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "presuppose",
        "synonyms": [
            "supposition",
            "conjecture"
        ],
        "definition": "To assume at the beginning of a line of argument.",
        "sentence": "The argument seems to ______ that all voters have access to reliable information, which is rarely the case.",
        "difficulty": "hard",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "supposition",
        "synonyms": [
            "conjecture",
            "presuppose"
        ],
        "definition": "A belief held without proof or certain knowledge; assumption.",
        "sentence": "His version of the events is pure ______.",
        "difficulty": "hard",
        "distractors": [
            "oblique",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "elusive",
        "synonyms": [
            "intangible"
        ],
        "definition": "Difficult to find, catch, or achieve.",
        "sentence": "Eric, as ______ as ever, was nowhere to be found.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "intangible",
        "synonyms": [
            "elusive"
        ],
        "definition": "Unable to be touched or physically grasped; vague.",
        "sentence": "The island has an ______ quality of holiness.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "detrimental",
        "synonyms": [
            "inimical",
            "harmful",
            "injurious"
        ],
        "definition": "Tending to cause harm; damaging.",
        "sentence": "Sugar is positively ______ to bodybuilding.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "inimical",
        "synonyms": [
            "inimic",
            "inimicable",
            "detrimental",
            "antagonistic"
        ],
        "definition": "Tending to obstruct or harm; unfriendly or hostile.",
        "sentence": "His policies are ______ to academic freedom.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "accessory",
        "synonyms": [
            "subsidiary",
            "accompanying",
            "acceding",
            "subservient"
        ],
        "definition": "Contributing to or aiding a secondary activity or function.",
        "sentence": "She was ______ to the riot.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "auxiliary",
        "synonyms": [
            "motorsailer",
            "ancillary",
            "accessory"
        ],
        "definition": "Providing supplementary or additional help and support.",
        "sentence": "Science and technology are ______ to each other.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "inconspicuous",
        "synonyms": [
            "unobtrusive",
            "latent",
            "clandestine",
            "invisible"
        ],
        "definition": "Not clearly visible or attracting attention; subtle.",
        "sentence": "The concept of ______ is demonstrated when not clearly visible or attracting attention; subtle, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "entrenched",
            "incipient",
            "indispensable"
        ]
    },
    {
        "word": "clandestine",
        "synonyms": [
            "furtive",
            "inconspicuous",
            "unobtrusive",
            "covert"
        ],
        "definition": "Kept secret or done secretively, especially because illicit.",
        "sentence": "______ military operations",
        "difficulty": "hard",
        "distractors": [
            "entrenched",
            "incipient",
            "indispensable"
        ]
    },
    {
        "word": "latent",
        "synonyms": [
            "inconspicuous",
            "unobtrusive",
            "clandestine",
            "dormant"
        ],
        "definition": "Existing but not yet developed or manifest; hidden.",
        "sentence": "The concept of ______ is demonstrated when existing but not yet developed or manifest; hidden, as evident in many academic texts.",
        "difficulty": "easy",
        "distractors": [
            "entrenched",
            "incipient",
            "indispensable"
        ]
    },
    {
        "word": "unobtrusive",
        "synonyms": [
            "latent",
            "inconspicuous",
            "clandestine"
        ],
        "definition": "Not conspicuous or attracting attention.",
        "sentence": "Personally he was quiet, modest and ______.",
        "difficulty": "hard",
        "distractors": [
            "entrenched",
            "incipient",
            "indispensable"
        ]
    },
    {
        "word": "encrypt",
        "synonyms": [],
        "definition": "Convert information or data into a cipher or code to prevent access.",
        "sentence": "The concept of ______ is demonstrated when convert information or data into a cipher or code to prevent access, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "misanthropic",
        "synonyms": [],
        "definition": "Disliking humankind and avoiding human society.",
        "sentence": "The concept of ______ is demonstrated when disliking humankind and avoiding human society, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "ameliorate",
        "synonyms": [
            "optimize"
        ],
        "definition": "To make something bad or unsatisfactory better; improve.",
        "sentence": "Nothing can be done to ______ the situation.",
        "difficulty": "hard",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "optimize",
        "synonyms": [
            "perfect",
            "improve",
            "enhance",
            "ameliorate"
        ],
        "definition": "To make the best or most effective use of a resource.",
        "sentence": "What can you do to ______ your family situation?",
        "difficulty": "medium",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "extemporaneous",
        "synonyms": [
            "improvised",
            "extemporal",
            "off-the-cuff"
        ],
        "definition": "Spoken or done without preparation; improvised.",
        "sentence": "\"The lovely words of a prepared speech however cannot erase ______ words and deeds — thousands of them — that have run contrary to those aspirations.”",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "augment",
        "synonyms": [
            "amass"
        ],
        "definition": "To make something greater by adding to it; increase.",
        "sentence": "Why settle for reality when you can ______ it?",
        "difficulty": "medium",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "amass",
        "synonyms": [
            "heap up",
            "mound",
            "augment",
            "accumulate"
        ],
        "definition": "To gather together or accumulate a large quantity of valuable material.",
        "sentence": "She has ______ a huge fortune from her novels.",
        "difficulty": "easy",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "oblique",
        "synonyms": [
            "solidus",
            "forward slash",
            "diagonal",
            "slash mark"
        ],
        "definition": "Not explicit or direct in addressing a point.",
        "sentence": "Both conventional and ______ viewing are possible.",
        "difficulty": "medium",
        "distractors": [
            "supposition",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "ineffectual",
        "synonyms": [
            "futile"
        ],
        "definition": "Not producing any or the desired effect.",
        "sentence": "Our group leader proved highly ______, caving to every whim put forth by the other members.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "apprise",
        "synonyms": [
            "abreast",
            "up to date",
            "up-to-date"
        ],
        "definition": "To inform or tell someone.",
        "sentence": "I shall not fail to ______ you of my arrival.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "interjected",
        "synonyms": [
            "insert",
            "interpose",
            "intervene"
        ],
        "definition": "Said something abruptly, especially as an interruption.",
        "sentence": "The concept of ______ is demonstrated when said something abruptly, especially as an interruption, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "intercede",
        "synonyms": [],
        "definition": "Intervene on behalf of another.",
        "sentence": "He had occasionally tried to ______ for me.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "extraneous",
        "synonyms": [
            "tangential",
            "peripheral"
        ],
        "definition": "Irrelevant or unrelated to the subject being dealt with.",
        "sentence": "______ substances were found on my cup of water.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "tangential",
        "synonyms": [
            "extraneous",
            "peripheral"
        ],
        "definition": "Hardly touching upon a matter; peripheral or divergent.",
        "sentence": "What ______ Factors Might Influence A Jury?",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "peripheral",
        "synonyms": [
            "tangential",
            "extraneous"
        ],
        "definition": "Situated on the edge or margin of something; secondary.",
        "sentence": "The men are somewhat ______ to this society.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "enumerate",
        "synonyms": [
            "itemize"
        ],
        "definition": "To mention a number of things one by one; list systematically.",
        "sentence": "The concept of ______ is demonstrated when to mention a number of things one by one; list systematically, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "itemize",
        "synonyms": [
            "enumerate"
        ],
        "definition": "Present as a list of individual items.",
        "sentence": "______ every element of fears that have you scared.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "protracted",
        "synonyms": [
            "prolong",
            "long-drawn-out"
        ],
        "definition": "Lasting for a long time or longer than expected.",
        "sentence": "The mandible is ______ and retracted in chewing.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "misconstrue",
        "synonyms": [
            "misinterpret",
            "misunderstand"
        ],
        "definition": "To interpret a statement, action, or context wrongly.",
        "sentence": "She said Harris had ______ her comments.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "ambivalent",
        "synonyms": [
            "fluctuating",
            "vacillating",
            "wavering",
            "conflicted",
            "uncertain"
        ],
        "definition": "Having mixed feelings or contradictory ideas about something or someone.",
        "sentence": "She seems to feel ______ about her new job.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "unpretentious",
        "synonyms": [],
        "definition": "Not attempting to impress others with an appearance of importance.",
        "sentence": "The concept of ______ is demonstrated when not attempting to impress others with an appearance of importance, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "indispensable",
        "synonyms": [
            "integral"
        ],
        "definition": "Absolutely necessary.",
        "sentence": "The law was moral and ______. -Bp. Burnet",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "integral",
        "synonyms": [
            "indispensable"
        ],
        "definition": "Necessary to make a whole complete; essential.",
        "sentence": "The ______ of x\\mapsto x^2 on [0,1] is \\frac{1}{3}.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "novel",
        "synonyms": [
            "unusual"
        ],
        "definition": "New, original, or unusual in an interesting way.",
        "sentence": "The ______ is written from personal experience.",
        "difficulty": "easy",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "empirical",
        "synonyms": [
            "empiric"
        ],
        "definition": "Verifiable by observation or experience rather than theory.",
        "sentence": "A related issue concerns ______ methodology.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "defunct",
        "synonyms": [
            "anachronistic",
            "dormant"
        ],
        "definition": "No longer existing or functioning; obsolete.",
        "sentence": "Any hope of heading off with the Kaika was ______.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "anachronistic",
        "synonyms": [
            "defunct",
            "dormant"
        ],
        "definition": "Belonging or appropriate to a period other than that in which it exists.",
        "sentence": "If you know where to look in the movie, you can spot an ______ wrist watch on one of the Roman soldiers.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "dormant",
        "synonyms": [
            "defunct",
            "anachronistic"
        ],
        "definition": "Having normal physical functions suspended or slowed down.",
        "sentence": "Grass goes ______ during the winter, waiting for spring before it grows again.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "adept",
            "tenuous"
        ]
    },
    {
        "word": "sanguine",
        "synonyms": [
            "animated",
            "assured",
            "bright",
            "bullish",
            "buoyant"
        ],
        "definition": "Optimistic or positive, especially in a bad situation.",
        "sentence": "a ______ bodily temperament",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "incongruous",
        "synonyms": [
            "incongruitous"
        ],
        "definition": "Not in harmony or keeping with the surroundings or expectations.",
        "sentence": "All because of this burning, ______ passion.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "intersect",
        "synonyms": [],
        "definition": "To pass or lie across each other; overlap.",
        "sentence": "The two roads ______ at the suburb of the city.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "apex",
        "synonyms": [
            "peak",
            "summit",
            "top",
            "acme",
            "culmination"
        ],
        "definition": "The highest point of something; peak or vertex.",
        "sentence": "the ______ of the building",
        "difficulty": "easy",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "premeditated",
        "synonyms": [],
        "definition": "Thought out or planned beforehand.",
        "sentence": "They were neither ______ nor authorised.",
        "difficulty": "hard",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "feasible",
        "synonyms": [
            "workable",
            "possible",
            "practicable",
            "achievable"
        ],
        "definition": "Possible to do easily or conveniently.",
        "sentence": "His plan to rid Trafalgar Square of pigeons by bringing in peregrine falcons to eat them was dismissed as not ______.",
        "difficulty": "medium",
        "distractors": [
            "prestige",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "expediency",
        "synonyms": [
            "expedience"
        ],
        "definition": "Being convenient and practical despite possibly being improper.",
        "sentence": "The concept of ______ is demonstrated when being convenient and practical despite possibly being improper, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "supposition",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "extol",
        "synonyms": [
            "prestige",
            "esteem",
            "flatter",
            "belaud"
        ],
        "definition": "To praise enthusiastically or highly.",
        "sentence": "The teacher was ______ her work to the skies.",
        "difficulty": "easy",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "esteem",
        "synonyms": [
            "respect",
            "cherish",
            "extol",
            "revere"
        ],
        "definition": "Respect and admiration.",
        "sentence": "I ______ it an honour to visit your university.",
        "difficulty": "easy",
        "distractors": [
            "attrition",
            "alleviate",
            "eschew"
        ]
    },
    {
        "word": "prestige",
        "synonyms": [
            "extol",
            "esteem"
        ],
        "definition": "Widespread respect and admiration given on the basis of quality.",
        "sentence": "Oxford has a university of very high ______.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "lucrative",
        "synonyms": [
            "monetize"
        ],
        "definition": "Producing a great deal of profit.",
        "sentence": "The partnership opened access to an extraordinarily ______ market that the company had previously been unable to enter.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "monetize",
        "synonyms": [
            "lucrative"
        ],
        "definition": "To convert an asset into or express it in terms of currency.",
        "sentence": "So I've put a lot of blame on the Fed because they ______ these debts.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "haphazard",
        "synonyms": [
            "discontinuous",
            "chaotic",
            "erratic",
            "random"
        ],
        "definition": "Lacking any obvious principle of organization; random.",
        "sentence": "The town had grown in a somewhat ______ way.",
        "difficulty": "medium",
        "distractors": [
            "entrenched",
            "incipient",
            "protracted"
        ]
    },
    {
        "word": "desultory",
        "synonyms": [
            "quodlibetical",
            "discontinuous",
            "haphazard",
            "disconnected"
        ],
        "definition": "Lacking a plan, purpose, enthusiasm, or directional focus.",
        "sentence": "He wandered round, cleaning up in a ______ way.",
        "difficulty": "medium",
        "distractors": [
            "entrenched",
            "incipient",
            "protracted"
        ]
    },
    {
        "word": "discontinuous",
        "synonyms": [
            "haphazard",
            "erratic",
            "patchy",
            "spasmodic"
        ],
        "definition": "Having intervals or gaps; not continuous.",
        "sentence": "The concept of ______ is demonstrated when having intervals or gaps; not continuous, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "entrenched",
            "incipient",
            "protracted"
        ]
    },
    {
        "word": "erratic",
        "synonyms": [
            "desultory",
            "discontinuous",
            "haphazard",
            "dropstone"
        ],
        "definition": "Not even or regular in pattern or movement; unpredictable.",
        "sentence": "The scientists pulling his strings are ______.",
        "difficulty": "medium",
        "distractors": [
            "entrenched",
            "incipient",
            "protracted"
        ]
    },
    {
        "word": "prioritize",
        "synonyms": [],
        "definition": "Designate or treat something as being more important than others.",
        "sentence": "Rank and ______ your district's prospects.",
        "difficulty": "hard",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "iconoclasm",
        "synonyms": [],
        "definition": "The rejection or destruction of cherished beliefs or institutions.",
        "sentence": "______ became a prominent feature of jewelry design.",
        "difficulty": "hard",
        "distractors": [
            "supposition",
            "calibration",
            "restitution"
        ]
    },
    {
        "word": "subversive",
        "synonyms": [
            "revolutionary",
            "subverter",
            "seditious",
            "insurgent"
        ],
        "definition": "Seeking or intended to subvert or undermine an institution.",
        "sentence": "The concept of ______ is demonstrated when seeking or intended to subvert or undermine an institution, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "reconstituted",
        "synonyms": [
            "refurbish",
            "restitution"
        ],
        "definition": "Built up again from parts; reconstructed.",
        "sentence": "The concept of ______ is demonstrated when built up again from parts; reconstructed, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "refurbish",
        "synonyms": [
            "reconstituted",
            "restitution"
        ],
        "definition": "Renovate and redecorate something to restore its function.",
        "sentence": "A developer wants to ______ the Green Street Hotel.",
        "difficulty": "medium",
        "distractors": [
            "refute",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "restitution",
        "synonyms": [
            "indemnification",
            "reconstituted",
            "recompense",
            "refurbish"
        ],
        "definition": "The restoration of something lost or stolen to its proper owner.",
        "sentence": "Opinion polls repeatedly showed that ______ was unpopular.",
        "difficulty": "hard",
        "distractors": [
            "supposition",
            "calibration",
            "iconoclasm"
        ]
    },
    {
        "word": "beneficiary",
        "synonyms": [],
        "definition": "A person who derives advantage from something.",
        "sentence": "You are the lucky ______ of this special offer.",
        "difficulty": "hard",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "repudiate",
        "synonyms": [
            "contradict",
            "gainsay",
            "deny",
            "renunciation"
        ],
        "definition": "To refuse to accept or be associated with; reject validity.",
        "sentence": "The concept of ______ is demonstrated when to refuse to accept or be associated with; reject validity, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "optimize",
            "abate",
            "monetize"
        ]
    },
    {
        "word": "refute",
        "synonyms": [
            "disprove",
            "debunk",
            "rebut",
            "gainsay"
        ],
        "definition": "To prove a statement, theory, or claim to be wrong.",
        "sentence": "The attorney called a forensic expert to the stand specifically to ______ the prosecution's theory.",
        "difficulty": "easy",
        "distractors": [
            "optimize",
            "abate",
            "monetize"
        ]
    },
    {
        "word": "recant",
        "synonyms": [
            "renunciation",
            "repudiate",
            "take back",
            "recall"
        ],
        "definition": "To formally reject a previously held opinion or belief.",
        "sentence": "White House officials ordered Williams to ______.",
        "difficulty": "easy",
        "distractors": [
            "optimize",
            "abate",
            "monetize"
        ]
    },
    {
        "word": "renunciation",
        "synonyms": [
            "refute",
            "repudiate",
            "recant"
        ],
        "definition": "The formal rejection of a belief, claim, or action.",
        "sentence": "The concept of ______ is demonstrated when the formal rejection of a belief, claim, or action, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "supposition",
            "calibration",
            "iconoclasm"
        ]
    },
    {
        "word": "supersede",
        "synonyms": [
            "transcending",
            "replace",
            "supplant",
            "outstrip"
        ],
        "definition": "To take the place of a person or thing previously in use.",
        "sentence": "Any one could ______ you as manager in my office.",
        "difficulty": "medium",
        "distractors": [
            "substantiate",
            "abate",
            "decry"
        ]
    },
    {
        "word": "eclipse",
        "synonyms": [
            "outstrip",
            "transcending",
            "supersede"
        ],
        "definition": "To obscure, surpass, or block out the importance of another thing.",
        "sentence": "One cloud is enough to ______ all the sun.&nbsp;",
        "difficulty": "medium",
        "distractors": [
            "substantiate",
            "abate",
            "decry"
        ]
    },
    {
        "word": "outstrip",
        "synonyms": [
            "transcending",
            "overgo",
            "supersede",
            "transgress"
        ],
        "definition": "To move faster than and overtake; exceed or surpass.",
        "sentence": "The concept of ______ is demonstrated when to move faster than and overtake; exceed or surpass, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "substantiate",
            "abate",
            "decry"
        ]
    },
    {
        "word": "transcending",
        "synonyms": [
            "surpass",
            "overgo",
            "supersede",
            "outstrip"
        ],
        "definition": "Surpassing or going beyond the range or limits of.",
        "sentence": "The concept of ______ is demonstrated when surpassing or going beyond the range or limits of, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "substantiate",
            "abate",
            "decry"
        ]
    },
    {
        "word": "dogmatic",
        "synonyms": [],
        "definition": "Inclined to lay down principles as absolute truths.",
        "sentence": "The most dangerous thinkers are often those who are most ______, convinced that their frameworks require no revision.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "homogeneous",
        "synonyms": [
            "uniform"
        ],
        "definition": "Of the same kind; alike or uniform throughout.",
        "sentence": "The concept of ______ is demonstrated when of the same kind; alike or uniform throughout, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "uniform",
        "synonyms": [
            "regular",
            "stable",
            "of a piece",
            "homogeneous"
        ],
        "definition": "Remaining the same in all cases and at all times; unchanging.",
        "sentence": "The rows of houses were ______ in appearance.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "superficial",
            "tenuous"
        ]
    },
    {
        "word": "dearth",
        "synonyms": [
            "paucity",
            "famine",
            "scarcity",
            "shortage"
        ],
        "definition": "A scarcity or lack of something.",
        "sentence": "Farmers have long griped about a ______ of competition.",
        "difficulty": "easy",
        "distractors": [
            "oblique",
            "supposition",
            "elasticity"
        ]
    },
    {
        "word": "paucity",
        "synonyms": [
            "scantiness",
            "scarcity",
            "dearth"
        ],
        "definition": "The presence of something only in insufficient quantities.",
        "sentence": "The report highlighted the ______ of reliable data available on the long-term effects of the new drug.",
        "difficulty": "medium",
        "distractors": [
            "oblique",
            "supposition",
            "elasticity"
        ]
    },
    {
        "word": "diverge",
        "synonyms": [],
        "definition": "To separate from another route or go a different direction.",
        "sentence": "I'm afraid our opinions ______ from each other.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "superficial",
        "synonyms": [
            "surficial"
        ],
        "definition": "Existing or occurring at or on the surface; lacking depth.",
        "sentence": "The concept of ______ is demonstrated when existing or occurring at or on the surface; lacking depth, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "amorphous",
        "synonyms": [
            "formless",
            "shapeless"
        ],
        "definition": "Without a clearly defined shape or form.",
        "sentence": "I really can't understand his ______ ideas.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "evince",
        "synonyms": [],
        "definition": "To reveal the presence of a quality or feeling; indicate clearly.",
        "sentence": "Her meticulous attention to detail throughout the project served to ______ her deep commitment to excellence.",
        "difficulty": "easy",
        "distractors": [
            "repudiate",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "harbinger",
        "synonyms": [
            "forewarning",
            "omen",
            "sign",
            "signal"
        ],
        "definition": "A person or thing that signals the approach of another; forerunner.",
        "sentence": "The crowing of the cock is a ______ of dawn.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "antecedent",
        "synonyms": [
            "forefather",
            "progenitor",
            "forebear",
            "precedent"
        ],
        "definition": "A thing or event that existed before or logically precedes another.",
        "sentence": "Those were events ______ to the revolution.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "homogeneous",
            "tenuous"
        ]
    },
    {
        "word": "precursor",
        "synonyms": [
            "antecedent",
            "harbinger"
        ],
        "definition": "A person or thing that comes before another of the same kind.",
        "sentence": "The concept of ______ is demonstrated when a person or thing that comes before another of the same kind, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "homogeneous",
            "tenuous"
        ]
    },
    {
        "word": "inane",
        "synonyms": [
            "silly",
            "fatuous",
            "vapid"
        ],
        "definition": "Lacking sense or meaning; silly.",
        "sentence": "There are so many ______ television quiz shows.",
        "difficulty": "easy",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "adept",
        "synonyms": [],
        "definition": "Very skilled or proficient at something.",
        "sentence": "The concept of ______ is demonstrated when very skilled or proficient at something, as evident in many academic texts.",
        "difficulty": "easy",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "nominal",
        "synonyms": [
            "inconsequential",
            "diminutive",
            "trifling",
            "normal"
        ],
        "definition": "Existing in name only; far below real value or magnitude.",
        "sentence": "The concept of ______ is demonstrated when existing in name only; far below real value or magnitude, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "incipient",
            "antecedent",
            "tenuous"
        ]
    },
    {
        "word": "inconsequential",
        "synonyms": [
            "unimportant",
            "diminutive",
            "nominal",
            "negligible"
        ],
        "definition": "Not important or significant; of negligible value.",
        "sentence": "Most of what she said was pretty ______.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "antecedent",
            "tenuous"
        ]
    },
    {
        "word": "diminutive",
        "synonyms": [
            "nominal",
            "nomen deminutivum",
            "tiny",
            "inconsequential"
        ],
        "definition": "Extremely or unusually small.",
        "sentence": "She was a ______ figure beside her husband.",
        "difficulty": "hard",
        "distractors": [
            "incipient",
            "antecedent",
            "tenuous"
        ]
    },
    {
        "word": "capacious",
        "synonyms": [
            "commodious",
            "spacious",
            "ample",
            "voluminous"
        ],
        "definition": "Having a lot of space inside; roomy.",
        "sentence": "The concept of ______ is demonstrated when having a lot of space inside; roomy, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "disseminate",
        "synonyms": [
            "circulate",
            "propagate",
            "spread"
        ],
        "definition": "To spread or disperse information widely.",
        "sentence": "The public health agency worked to ______ accurate information before misinformation could spread further online.",
        "difficulty": "hard",
        "distractors": [
            "repudiate",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "activate",
        "synonyms": [
            "get going",
            "incipient",
            "set in motion",
            "start"
        ],
        "definition": "To cause a function or system to begin operating.",
        "sentence": "To ______ your filter, select the View menu.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "assert",
            "eschew"
        ]
    },
    {
        "word": "incipient",
        "synonyms": [
            "emerging",
            "activate",
            "nascent",
            "inchoate"
        ],
        "definition": "In an initial stage; beginning to happen or develop.",
        "sentence": "John's ______ school problems were nipped in the bud.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "assert",
        "synonyms": [
            "aver",
            "asseverate",
            "affirm"
        ],
        "definition": "To state a fact or belief confidently and forcefully.",
        "sentence": "She continued to ______ that she was innocent.",
        "difficulty": "easy",
        "distractors": [
            "repudiate",
            "activate",
            "eschew"
        ]
    },
    {
        "word": "recalcitrant",
        "synonyms": [
            "unruly",
            "argumentative",
            "disobedient",
            "stubborn"
        ],
        "definition": "Having an obstinately uncooperative attitude toward authority.",
        "sentence": "There were hopeful signs from one ______ state.",
        "difficulty": "hard",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "proxy",
        "synonyms": [
            "deputy",
            "emissary",
            "representative"
        ],
        "definition": "A figure, agent, or variable standing in for another.",
        "sentence": "The concept of ______ is demonstrated when a figure, agent, or variable standing in for another, as evident in many academic texts.",
        "difficulty": "easy",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "emissary",
        "synonyms": [
            "proxy"
        ],
        "definition": "A person sent on a special mission, usually as a diplomatic agent.",
        "sentence": "The concept of ______ is demonstrated when a person sent on a special mission, usually as a diplomatic agent, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "supposition",
            "calibration",
            "iconoclasm"
        ]
    },
    {
        "word": "prevail",
        "synonyms": [],
        "definition": "To prove more powerful than opposing forces.",
        "sentence": "May I ______ on you to make a speech after dinner?",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "activate",
            "eschew"
        ]
    },
    {
        "word": "corroborate",
        "synonyms": [
            "validate",
            "buttress",
            "endorse",
            "substantiate"
        ],
        "definition": "To confirm or give support to a statement, theory, or finding.",
        "sentence": "Recent research seems to ______ his theory.",
        "difficulty": "hard",
        "distractors": [
            "extol",
            "attrition",
            "activate"
        ]
    },
    {
        "word": "buttress",
        "synonyms": [
            "validate",
            "counterfort",
            "endorse",
            "brace"
        ],
        "definition": "To increase the strength of or provide justification for; reinforce.",
        "sentence": "It was decided to ______ the crumbling walls.",
        "difficulty": "medium",
        "distractors": [
            "extol",
            "attrition",
            "activate"
        ]
    },
    {
        "word": "substantiate",
        "synonyms": [
            "validate",
            "buttress",
            "endorse",
            "corroborate"
        ],
        "definition": "To provide evidence to support or prove the truth of a claim.",
        "sentence": "The journalist refused to publish the accusation without enough evidence to ______ the claim.",
        "difficulty": "hard",
        "distractors": [
            "extol",
            "attrition",
            "activate"
        ]
    },
    {
        "word": "endorse",
        "synonyms": [
            "validate",
            "buttress",
            "substantiate",
            "corroborate"
        ],
        "definition": "To declare one's public approval or support of.",
        "sentence": "The concept of ______ is demonstrated when to declare one's public approval or support of, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "extol",
            "attrition",
            "activate"
        ]
    },
    {
        "word": "validate",
        "synonyms": [
            "buttress",
            "endorse",
            "substantiate",
            "corroborate"
        ],
        "definition": "To check or prove the validity or accuracy of something.",
        "sentence": "The play ends by seeming to ______ Antigone.",
        "difficulty": "medium",
        "distractors": [
            "extol",
            "attrition",
            "activate"
        ]
    },
    {
        "word": "proponent",
        "synonyms": [
            "exponent"
        ],
        "definition": "A person who advocates a theory, proposal, or project.",
        "sentence": "The concept of ______ is demonstrated when a person who advocates a theory, proposal, or project, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "notional",
        "synonyms": [],
        "definition": "Existing only in theory, speculation, or as an idea.",
        "sentence": "All this with a ______ enemy gunning for us.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "resilient",
        "synonyms": [
            "bendable",
            "flexible",
            "strong"
        ],
        "definition": "The capacity to recover quickly from difficulties; toughness.",
        "sentence": "Jim Harbaugh has been very ______ all year.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "orthodox",
        "synonyms": [
            "conventional",
            "conservative"
        ],
        "definition": "Conforming to traditional or commonly accepted rules.",
        "sentence": "The theory was ______ within the discipline for decades before a series of contradictory findings forced its revision.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "veritable",
        "synonyms": [
            "verisimilitude"
        ],
        "definition": "Used as an intensifier, often to qualify a metaphor (\"truly\").",
        "sentence": "The concept of ______ is demonstrated when used as an intensifier, often to qualify a metaphor (\"truly\"), as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "verisimilitude",
        "synonyms": [
            "veritable"
        ],
        "definition": "The appearance of being true or real.",
        "sentence": "This last gives the novel some technical ______.",
        "difficulty": "hard",
        "distractors": [
            "supposition",
            "calibration",
            "iconoclasm"
        ]
    },
    {
        "word": "idiosyncratic",
        "synonyms": [
            "atypical"
        ],
        "definition": "Relating to a distinctive, peculiar, or individualistic characteristic.",
        "sentence": "In that sense, it is deliberately ______.",
        "difficulty": "hard",
        "distractors": [
            "diminutive",
            "homogeneous",
            "tenuous"
        ]
    },
    {
        "word": "atypical",
        "synonyms": [
            "idiosyncratic"
        ],
        "definition": "Not representative of a type, group, or class; unusual.",
        "sentence": "The patient's ______ response to the medication required the team to reconsider the initial diagnosis.",
        "difficulty": "medium",
        "distractors": [
            "diminutive",
            "homogeneous",
            "tenuous"
        ]
    },
    {
        "word": "redundant",
        "synonyms": [
            "surplus to requirements"
        ],
        "definition": "Not or no longer needed or useful; superfluous.",
        "sentence": "Her second argument was entirely ______, reiterating what had already been proven in the opening statement.",
        "difficulty": "medium",
        "distractors": [
            "feasible",
            "ornamental",
            "explicable"
        ]
    },
    {
        "word": "precarious",
        "synonyms": [
            "shaky",
            "rickety",
            "unsteady",
            "unstable"
        ],
        "definition": "Not securely held; dangerously likely to collapse.",
        "sentence": "Our financial situation had become ______.",
        "difficulty": "hard",
        "distractors": [
            "inconsequential",
            "antecedent",
            "atypical"
        ]
    },
    {
        "word": "tenuous",
        "synonyms": [
            "ethereal",
            "precarious",
            "gossamer",
            "delicate"
        ],
        "definition": "Very weak, slender, slight, or fragilely supported.",
        "sentence": "The concept of ______ is demonstrated when very weak, slender, slight, or fragilely supported, as evident in many academic texts.",
        "difficulty": "medium",
        "distractors": [
            "inconsequential",
            "antecedent",
            "atypical"
        ]
    },
    {
        "word": "untenable",
        "synonyms": [
            "tenuous",
            "precarious"
        ],
        "definition": "Not able to be maintained or defended against objection.",
        "sentence": "Closer investigation showed this idea to be ______.",
        "difficulty": "medium",
        "distractors": [
            "inconsequential",
            "antecedent",
            "atypical"
        ]
    },
    {
        "word": "exploit",
        "synonyms": [
            "take advantage of",
            "use"
        ],
        "definition": "To make full use of and derive benefit from a resource.",
        "sentence": "Farmers have been slow to ______ this market.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "activate",
            "eschew"
        ]
    },
    {
        "word": "heterogeneous",
        "synonyms": [
            "manifold",
            "diverse",
            "multifarious",
            "disparate"
        ],
        "definition": "Diverse in character, content, or composition.",
        "sentence": "Both antibodies are a largely ______ family.",
        "difficulty": "hard",
        "distractors": [
            "inconsequential",
            "antecedent",
            "atypical"
        ]
    },
    {
        "word": "disparate",
        "synonyms": [
            "uncoordinated",
            "mismatched",
            "heterogeneous",
            "different"
        ],
        "definition": "Essentially different in kind; completely distinct or unequal.",
        "sentence": "The five experiments gave quite ______ results.",
        "difficulty": "medium",
        "distractors": [
            "inconsequential",
            "antecedent",
            "atypical"
        ]
    },
    {
        "word": "multifarious",
        "synonyms": [
            "disparate",
            "diverse",
            "various",
            "heterogeneous"
        ],
        "definition": "Many and of various types; great variety.",
        "sentence": "The concept of ______ is demonstrated when many and of various types; great variety, as evident in many academic texts.",
        "difficulty": "hard",
        "distractors": [
            "inconsequential",
            "antecedent",
            "atypical"
        ]
    },
    {
        "word": "undermine",
        "synonyms": [],
        "definition": "To lessen the effectiveness, power, or ability of gradually.",
        "sentence": "High income tax can ______ work incentives.",
        "difficulty": "medium",
        "distractors": [
            "repudiate",
            "activate",
            "eschew"
        ]
    },
    {
        "word": "exacerbate",
        "synonyms": [],
        "definition": "To make a problem, bad situation, or negative feeling worse.",
        "sentence": "Climate change will only ______ such pressures.",
        "difficulty": "hard",
        "distractors": [
            "repudiate",
            "activate",
            "eschew"
        ]
    }
];

// Dynamically fetch word metadata from the Free Dictionary API (used for CSV imports)
async function fetchWordMetadataFromAPI(word) {
    const cleanedWord = word.trim().toLowerCase();

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanedWord}`);
        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();
        const entry = data[0];

        const phonetic = entry.phonetic ||
                         (entry.phonetics && entry.phonetics[0] ? entry.phonetics[0].text : "") ||
                         `/${cleanedWord}/`;

        let definition = "";
        let synonyms = [];
        let exampleSentence = "";

        if (entry.meanings) {
            entry.meanings.forEach(meaning => {
                if (meaning.definitions) {
                    meaning.definitions.forEach(def => {
                        if (!definition && def.definition) definition = def.definition;
                        if (!exampleSentence && def.example) exampleSentence = def.example;
                    });
                }
                if (meaning.synonyms) synonyms = synonyms.concat(meaning.synonyms);
            });
        }

        if (!definition) definition = `A vocabulary term (${cleanedWord}).`;
        if (!exampleSentence) exampleSentence = `The word ${cleanedWord} appears in many academic texts.`;

        // Strip junk synonyms
        const JUNK = new Set(["equivalent","related term","related word","point elasticity","alternate term","correlative","analogue","substitute"]);
        synonyms = [...new Set(synonyms)].filter(s => s.toLowerCase() !== cleanedWord && !JUNK.has(s)).slice(0, 5);
        if (synonyms.length === 0) synonyms = [];

        const regex = new RegExp("\\b" + cleanedWord + "\\b", "gi");
        const sentence = exampleSentence.replace(regex, "______");

        // Pick 3 placeholder distractors — will be overridden by study-engine logic
        const distractors = ["tenuous", "speculative", "fallible"];

        return { word: cleanedWord, synonyms, definition, sentence, difficulty: "medium", distractors };

    } catch (err) {
        console.warn(`Dictionary API error for "${word}". Using minimal fallback.`, err);
        return {
            word: cleanedWord,
            synonyms: [],
            definition: `A vocabulary word: ${cleanedWord}.`,
            sentence: `______ is a word encountered in collegiate-level reading.`,
            difficulty: "medium",
            distractors: ["tenuous", "speculative", "fallible"]
        };
    }
}
