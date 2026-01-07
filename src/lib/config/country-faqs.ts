import type { FAQItem } from './countries';

export const COUNTRY_FAQS: Record<string, FAQItem[]> = {
	sweden: [
		{ question: 'Where can I read Swedish news in English?', answer: 'Nordics Today publishes daily Swedish news in English, with original reporting on Riksdag parliament, Stockholm business, and cultural events for expats and international readers.' },
		{ question: 'What topics does Swedish English news cover?', answer: 'Swedish news in English covers politics, business, technology, immigration, housing, and society from Stockholm, Gothenburg, Malmö, and across the country.' },
		{ question: 'How do expats stay informed about Sweden?', answer: 'Expats follow Swedish news through English-language publications covering Riksdag debates, government policy, cost of living, and practical guides for living in Sweden.' },
		{ question: 'What Swedish cities have English news coverage?', answer: 'English news covers major Swedish cities including Stockholm, Gothenburg, Malmö, Uppsala, and regional news from across Sweden.' },
		{ question: 'Is Swedish business news available in English?', answer: 'Yes, Swedish business news in English covers Stockholm\'s financial sector, Volvo, Ericsson, Swedish startups, and economic developments.' },
		{ question: 'How can I follow Swedish politics in English?', answer: 'Swedish political news in English covers Riksdag debates, government policy changes, election updates, and analysis of Swedish political developments.' }
	],
	norway: [
		{ question: 'Where can I read Norwegian news in English?', answer: 'Nordics Today publishes daily Norwegian news in English, with original reporting on Storting parliament, Oslo business, and the oil and gas industry.' },
		{ question: 'What topics does Norwegian English news cover?', answer: 'Norwegian news in English covers politics, oil and gas, shipping, maritime sector, immigration, and society from Oslo and across Norway.' },
		{ question: 'How do expats stay informed about Norway?', answer: 'Expats follow Norwegian news through English-language publications covering Storting debates, government policy, cost of living, and practical guides for living in Norway.' },
		{ question: 'What Norwegian industries have English coverage?', answer: 'English news covers Norway\'s key industries including oil and gas, shipping, maritime, renewable energy, fishing, and technology sectors.' },
		{ question: 'Is Norwegian business news available in English?', answer: 'Yes, Norwegian business news in English covers Oslo\'s financial sector, Equinor, oil companies, shipping industry, and economic developments.' },
		{ question: 'How can I follow Norwegian politics in English?', answer: 'Norwegian political news in English covers Storting debates, government policy changes, election updates, and analysis of Norwegian political developments.' }
	],
	denmark: [
		{ question: 'Where can I read Danish news in English?', answer: 'Nordics Today publishes daily Danish news in English, with original reporting on Folketing parliament, Copenhagen business, and wind energy industry.' },
		{ question: 'What topics does Danish English news cover?', answer: 'Danish news in English covers politics, wind energy, green technology, pharmaceuticals, immigration, and society from Copenhagen and across Denmark.' },
		{ question: 'How do expats stay informed about Denmark?', answer: 'Expats follow Danish news through English-language publications covering Folketing debates, government policy, cost of living, and practical guides for living in Denmark.' },
		{ question: 'What Danish industries have English coverage?', answer: 'English news covers Denmark\'s key industries including wind energy, green technology, shipping, pharmaceuticals, and renewable energy sectors.' },
		{ question: 'Is Danish business news available in English?', answer: 'Yes, Danish business news in English covers Copenhagen\'s financial sector, Maersk, Novo Nordisk, wind energy companies, and economic developments.' },
		{ question: 'How can I follow Danish politics in English?', answer: 'Danish political news in English covers Folketing debates, government policy changes, election updates, and analysis of Danish political developments.' }
	],
	finland: [
		{ question: 'Where can I read Finnish news in English?', answer: 'Nordics Today publishes daily Finnish news in English, with original reporting on Eduskunta parliament, Helsinki business, and the tech sector.' },
		{ question: 'What topics does Finnish English news cover?', answer: 'Finnish news in English covers politics, technology, gaming, Arctic affairs, immigration, and society from Helsinki and across Finland.' },
		{ question: 'How do expats stay informed about Finland?', answer: 'Expats follow Finnish news through English-language publications covering Eduskunta debates, government policy, cost of living, and practical guides for living in Finland.' },
		{ question: 'What Finnish industries have English coverage?', answer: 'English news covers Finland\'s key industries including Nokia, gaming, tech startups, forestry, and Arctic affairs.' },
		{ question: 'Is Finnish business news available in English?', answer: 'Yes, Finnish business news in English covers Helsinki\'s financial sector, Nokia, gaming industry, tech startups, and economic developments.' },
		{ question: 'How can I follow Finnish politics in English?', answer: 'Finnish political news in English covers Eduskunta debates, government policy changes, election updates, and analysis of Finnish political developments.' }
	],
	iceland: [
		{ question: 'Where can I read Icelandic news in English?', answer: 'Nordics Today publishes daily Icelandic news in English, with original reporting on Althing parliament, Reykjavik business, and volcanic activity.' },
		{ question: 'What topics does Icelandic English news cover?', answer: 'Icelandic news in English covers politics, volcanic activity, geothermal power, tourism, fishing, and society from Reykjavik and across Iceland.' },
		{ question: 'How do expats stay informed about Iceland?', answer: 'Expats follow Icelandic news through English-language publications covering Althing debates, government policy, cost of living, and practical guides for living in Iceland.' },
		{ question: 'What Icelandic topics have English coverage?', answer: 'English news covers Iceland\'s unique topics including volcanic activity, geothermal power, renewable energy, tourism, and fishing industry.' },
		{ question: 'Is Icelandic business news available in English?', answer: 'Yes, Icelandic business news in English covers Reykjavik\'s financial sector, tourism industry, renewable energy companies, and economic developments.' },
		{ question: 'How can I follow Icelandic politics in English?', answer: 'Icelandic political news in English covers Althing debates, government policy changes, election updates, and analysis of Icelandic political developments.' }
	]
};

export const COUNTRY_INTROS: Record<string, string> = {
	sweden: 'Stay informed with Swedish news in English covering politics from the Riksdag parliament, Stockholm business, Volvo and the tech sector, and cultural events. Follow government policy changes, Swedish business developments in Gothenburg and Malmö, and daily life across Sweden.',
	norway: 'Stay informed with Norwegian news in English covering politics from the Storting parliament, Oslo business, the oil and gas industry, and maritime sector. Follow government policy changes, Norway\'s energy sector developments, and daily life across Norway.',
	denmark: 'Stay informed with Danish news in English covering politics from the Folketing parliament, Copenhagen business, wind energy, and green technology. Follow government policy changes, Denmark\'s renewable energy developments, and daily life across Denmark.',
	finland: 'Stay informed with Finnish news in English covering politics from the Eduskunta parliament, Helsinki business, Nokia and the tech sector, and Arctic region news. Follow government policy changes, Finland\'s technology developments, and daily life across Finland.',
	iceland: 'Stay informed with Icelandic news in English covering politics from the Althing parliament, Reykjavik business, volcanic activity, and geothermal power. Follow government policy changes, Iceland\'s renewable energy developments, and daily life across Iceland.'
};
