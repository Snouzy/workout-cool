import { Locale } from "locales/types";

export type SectionId = "how-to" | "formula" | "chart" | "conversion" | "u100" | "water" | "mistakes" | "faq";

export interface PeptideSection {
  id: SectionId;
  heading: string;
  lead: string;
  body: string[];
}

export interface PeptideTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface PeptideFAQ {
  question: string;
  answer: string;
}

export interface PeptidePageContent {
  heroSubtitle: string;
  sections: PeptideSection[];
  reconstitutionTable: PeptideTable;
  conversionTable: PeptideTable;
  faq: PeptideFAQ[];
  disclaimer: string;
}

const en: PeptidePageContent = {
  heroSubtitle:
    "Enter your vial size, the bacteriostatic water you added and your dose. Get the exact volume in millilitres and the mark to draw to on a U-100 insulin syringe.",
  sections: [
    {
      id: "how-to",
      heading: "How to use this peptide calculator",
      lead: "Three numbers drive every result on this peptide calculator: the milligrams of peptide printed on the vial, the millilitres of bacteriostatic water you add, and the dose in micrograms you intend to draw. Enter them and the calculator returns the volume in millilitres and the matching mark on your insulin syringe.",
      body: [
        "Start with the vial. A label reading 10 mg is the dry peptide mass, not a volume — there is nothing to measure until you add liquid. Enter 10 mg as the vial size.",
        "Enter the bacteriostatic water next. This is the volume you push into the vial, and it is your choice within the vial's capacity: 5 mL of water into a 10 mg vial gives a concentration of 2 mg per mL. Less water gives a stronger solution and a smaller volume per dose; more water gives a weaker solution and a larger, easier-to-measure volume.",
        "Enter the dose last, in micrograms, exactly as it appears on your prescription or your product's labelling. The calculator does not judge that number — it converts it. A 250 mcg dose at 2 mg per mL is 0.125 mL, which is 12.5 units on a U-100 syringe, and the 10 mg vial holds 40 such doses.",
        "Read the result on the syringe diagram before you draw. The units figure is what you line the plunger up with; the millilitre figure is the same quantity in the unit printed on the barrel of a tuberculin syringe. Both describe one identical volume.",
      ],
    },
    {
      id: "formula",
      heading: "The reconstitution formula, explained",
      lead: "Peptide reconstitution runs on two divisions: concentration equals peptide mass divided by water volume, and dose volume equals dose divided by concentration. A 10 mg vial reconstituted with 5 mL of bacteriostatic water yields 2 mg per mL, so a 250 mcg dose occupies 0.125 mL.",
      body: [
        "Convert to one mass unit before dividing, or the arithmetic falls apart. Micrograms and milligrams differ by a factor of 1,000: 250 mcg is 0.25 mg, and 1,000 mcg is 1 mg. Every mismatch between the two is a tenfold or hundredfold error in the volume you draw.",
        "Work the running example step by step. 10 mg of peptide divided by 5 mL of water is 2 mg/mL. A 250 mcg dose is 0.25 mg. 0.25 mg divided by 2 mg/mL is 0.125 mL. That volume is the answer in millilitres, and everything after it is a change of scale, not a change of quantity.",
        "Doses per vial comes from the same two numbers: total peptide divided by dose. 10 mg is 10,000 mcg, and 10,000 divided by 250 is 40 doses. That figure is a quick sanity check — if the calculator says a 10 mg vial holds three doses of 250 mcg, something in your inputs is wrong.",
      ],
    },
    {
      id: "chart",
      heading: "Peptide reconstitution chart",
      lead: "The rows in a reconstitution chart are arithmetic, not suggestions: each pairs a peptide mass with a volume of bacteriostatic water and gives the concentration that results. 10 mg with 2 mL gives 5 mg/mL; the same 10 mg with 5 mL gives 2 mg/mL. Adding water never changes the peptide mass.",
      body: [
        "Choose a row by the volume you want to be measuring, not by the number that looks tidiest. Higher concentrations mean less liquid per injection and less water sitting in the vial; lower concentrations spread the same dose across more units on the syringe, which makes small doses easier to read accurately.",
        "Nothing in this chart says how much peptide to use. Every row holds the same total mass before and after mixing — adding water changes the concentration and the volume you draw, never the amount of peptide in the vial. Your dose comes from your prescriber or your product's labelling; the chart only tells you what a given mix works out to.",
      ],
    },
    {
      id: "conversion",
      heading: "Converting mcg to insulin syringe units",
      lead: "Insulin syringe units convert from micrograms with a single formula: units equal the dose in micrograms divided by ten times the concentration in mg/mL. At 2 mg/mL, a 250 mcg dose is 250 divided by 20, or 12.5 units. The same dose at 10 mg/mL is 2.5 units.",
      body: [
        "The factor of ten comes from the syringe, not the peptide. One unit on a U-100 syringe is 0.01 mL, so 0.125 mL is 12.5 units. Multiplying the millilitre figure by 100 gets you there just as reliably as the formula above.",
        "Concentration and units move in opposite directions. Double the concentration and the units halve, because the same mass of peptide is packed into half the liquid. That is why the table below reads 12.5, 5 and 2.5 units across a single row: one dose, three mixes, three different marks on the barrel.",
        "Check which syringe you are holding before trusting any unit figure. A U-100 syringe reads 100 units per millilitre; a U-40 syringe reads 40 units per millilitre, and the same 0.125 mL would be 5 units on it. Units are a scale printed on a barrel, not a fixed quantity.",
      ],
    },
    {
      id: "u100",
      heading: "Why a U-100 syringe reads 100 units per millilitre",
      lead: "U-100 is an insulin concentration standard: 100 international units of insulin per millilitre. The barrel is graduated so 100 units fills exactly 1 mL, which makes one unit 0.01 mL. For a reconstituted peptide, the scale carries no insulin meaning — it is simply a fine ruler for hundredths of a millilitre.",
      body: [
        "Syringe capacity and the unit scale are separate things. A 0.3 mL U-100 syringe is marked to 30 units, a 0.5 mL to 50, a 1 mL to 100 — but a unit is 0.01 mL on all three. A 12.5 unit draw fits every one of them; a 60 unit draw does not fit the first two.",
        "Smaller barrels are easier to read. On a 0.3 mL syringe the gradations sit further apart, so 12.5 units lands clearly between two marks rather than crowded against them. When your calculated volume fits, the smaller syringe usually gives the more accurate draw.",
        "Half-unit marks are not universal. Some barrels are printed in one-unit steps only, in which case 12.5 units has to be estimated between marks, or the mix adjusted so the number lands on a printed line. Look at your own syringe before assuming the precision the calculator implies.",
      ],
    },
    {
      id: "water",
      heading: "Bacteriostatic water vs sterile water",
      lead: "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol, a preservative that inhibits bacterial growth and allows a vial to be entered more than once. Sterile water carries no preservative, so once its seal is pierced it offers no protection against contamination between draws.",
      body: [
        "Neither liquid changes the arithmetic. 5 mL is 5 mL, and a 10 mg vial reconstituted with either one gives 2 mg/mL. The choice affects how long a reconstituted vial stays usable and how it must be stored, not the volume you draw.",
        "Follow the diluent named on your product's labelling. Some peptides are specified with bacteriostatic water, some with sterile water, and some with a different diluent entirely; benzyl alcohol is itself the reason certain products are never reconstituted with it. Where the labelling and a forum post disagree, the labelling wins.",
        "Add the water slowly down the inside wall of the vial rather than squirting it onto the powder, and let the vial sit until the solution runs clear. Do not shake it. Peptides are fragile molecules, and agitation degrades them without changing anything the calculator measures.",
      ],
    },
    {
      id: "mistakes",
      heading: "Common peptide calculation mistakes",
      lead: "Most peptide calculation errors are unit errors, and they are large: confusing micrograms with milligrams misplaces the decimal by a factor of 1,000, and reading a U-40 syringe as though it were U-100 misreads the volume by a factor of 2.5. Both produce a number that looks plausible on the barrel.",
      body: [
        "Assuming the water volume is fixed comes next. There is no standard amount of bacteriostatic water for a 10 mg vial — 2 mL gives 5 mg/mL and 5 mL gives 2 mg/mL — so a unit figure copied from someone else's vial is wrong on yours. Recalculate for the volume you actually added.",
        "Reusing a figure after changing the mix is the same mistake in slow motion. If 250 mcg was 12.5 units on your last vial, it is 12.5 units on this one only when the concentration is identical. Rerun the numbers every time you reconstitute.",
        "Two smaller ones are worth a check. The powder itself occupies a little volume, so the final liquid can sit slightly above the water you added; the calculator assumes it does not. And a peptide labelled in international units rather than milligrams cannot be entered into a mg-based calculation without the conversion factor for that specific product.",
      ],
    },
    {
      id: "faq",
      heading: "Frequently asked questions",
      lead: "Common questions about peptide reconstitution, bacteriostatic water volumes and insulin syringe units are answered below. Each answer applies the same two steps the calculator uses: divide the peptide mass by the water volume to get a concentration, then divide the dose by that concentration to get a volume.",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "Peptide reconstitution chart",
    headers: ["Peptide amount", "Bacteriostatic water added", "Final concentration"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2.5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Dose to insulin syringe units",
    headers: ["Dose", "at 2 mg/mL", "at 5 mg/mL", "at 10 mg/mL"],
    rows: [
      ["250 mcg", "12.5 U", "5 U", "2.5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1000 mcg", "50 U", "20 U", "10 U"],
      ["2000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "How to calculate peptide reconstitution?",
      answer:
        "Divide the peptide mass by the volume of bacteriostatic water to get the concentration, then divide your dose by that concentration to get the volume to draw. A 10 mg vial with 5 mL of water is 2 mg/mL, so a 250 mcg dose is 0.125 mL, or 12.5 units.",
    },
    {
      question: "How many mL of bacteriostatic water to mix with peptides?",
      answer:
        "Any volume the vial holds — the amount you add sets the concentration rather than the potency. 2 mL into a 10 mg vial gives 5 mg/mL; 5 mL gives 2 mg/mL. Larger volumes make small doses easier to read on the syringe. Follow the diluent volume on your product's labelling.",
    },
    {
      question: "How many mL to reconstitute 10 mg?",
      answer:
        "Any volume between roughly 1 mL and the vial's capacity works, and each gives a different concentration: 1 mL gives 10 mg/mL, 2 mL gives 5 mg/mL, and 5 mL gives 2 mg/mL. Pick the volume named on your product's labelling, then calculate your dose against the resulting concentration.",
    },
    {
      question: "How to reconstitute 30 mg of peptides?",
      answer:
        "Add your chosen volume of bacteriostatic water slowly down the vial wall and let it dissolve without shaking. 3 mL into a 30 mg vial gives 10 mg/mL, and 6 mL gives 5 mg/mL. Divide 30 mg by the millilitres you added to get the concentration, then convert your dose against it.",
    },
    {
      question: "How much water to reconstitute 10 mg of peptide?",
      answer:
        "Water volume is your choice, and it determines concentration: 1 mL of bacteriostatic water gives 10 mg/mL, 2 mL gives 5 mg/mL, 4 mL gives 2.5 mg/mL, and 5 mL gives 2 mg/mL. All four contain the same 10 mg of peptide — only the volume you draw per dose changes.",
    },
    {
      question: "How to figure out reconstitution?",
      answer:
        "Work in two divisions. First, peptide mass divided by water volume gives the concentration in mg/mL. Second, your dose divided by that concentration gives the volume in mL. Multiply that volume by 100 for units on a U-100 syringe. Convert micrograms to milligrams first — 250 mcg is 0.25 mg.",
    },
    {
      question: "How many units is 250 mcg on an insulin syringe?",
      answer:
        "Units depend on the concentration of your vial. On a U-100 syringe, 250 mcg is 12.5 units at 2 mg/mL, 5 units at 5 mg/mL, and 2.5 units at 10 mg/mL. Divide the dose in micrograms by ten times the concentration in mg/mL to get units for any other mix.",
    },
    {
      question: "What does U-100 mean on an insulin syringe?",
      answer:
        "U-100 means the barrel is graduated for a concentration of 100 units per millilitre, so one unit equals 0.01 mL and 100 units fills 1 mL. U-40 syringes are graduated at 40 units per millilitre instead. Reading a volume on the wrong scale gives a 2.5-fold error.",
    },
  ],
  disclaimer:
    "Conversion tool only. Always verify concentration, syringe unit scale and any prescription with a qualified healthcare professional. This calculator does not provide medical advice.",
};

const pt: PeptidePageContent = {
  heroSubtitle:
    "Informe a quantidade no frasco, a água bacteriostática que você adicionou e a sua dose. Receba o volume exato em mililitros e a marca até onde puxar em uma seringa de insulina U-100.",
  sections: [
    {
      id: "how-to",
      heading: "Como usar esta calculadora de peptídeos",
      lead: "Três números determinam todo resultado desta calculadora de peptídeos: os miligramas de peptídeo impressos no frasco, os mililitros de água bacteriostática que você adiciona e a dose em microgramas que você pretende puxar. Informe os três e a calculadora devolve o volume em mililitros e a marca correspondente na sua seringa de insulina.",
      body: [
        "Comece pelo frasco. Um rótulo que diz 10 mg indica a massa de peptídeo seco, não um volume — não há nada para medir até você adicionar líquido. Informe 10 mg como a quantidade no frasco.",
        "Depois informe a água bacteriostática. Esse é o volume que você empurra para dentro do frasco, e a escolha é sua, dentro da capacidade dele: 5 mL de água em um frasco de 10 mg dão uma concentração de 2 mg/mL. Menos água deixa a solução mais forte e o volume por dose menor; mais água deixa a solução mais fraca e o volume maior, mais fácil de medir.",
        "Informe a dose por último, em microgramas, exatamente como ela aparece na sua prescrição ou no rótulo do produto. A calculadora não julga esse número — ela o converte. Uma dose de 250 mcg a 2 mg/mL ocupa 0,125 mL, o que corresponde a 12,5 unidades em uma seringa U-100, e o frasco de 10 mg rende 40 doses dessas.",
        "Leia o resultado no diagrama da seringa antes de puxar. O número de unidades é onde você alinha o êmbolo; o número em mililitros é a mesma quantidade na unidade impressa no corpo de uma seringa de tuberculina. Os dois descrevem um único volume idêntico.",
      ],
    },
    {
      id: "formula",
      heading: "A fórmula da reconstituição de peptídeos, explicada",
      lead: "A reconstituição de peptídeos se resolve com duas divisões: a concentração é a massa de peptídeo dividida pelo volume de água, e o volume da dose é a dose dividida pela concentração. Um frasco de 10 mg reconstituído com 5 mL de água bacteriostática dá 2 mg/mL, então uma dose de 250 mcg ocupa 0,125 mL.",
      body: [
        "Converta tudo para uma única unidade de massa antes de dividir, ou a conta desanda. Microgramas e miligramas diferem por um fator de 1.000: 250 mcg são 0,25 mg, e 1.000 mcg são 1 mg. Cada troca entre as duas unidades vira um erro de dez ou de cem vezes no volume que você puxa.",
        "No exemplo, 10 mg de peptídeo divididos por 5 mL de água dão 2 mg/mL. A dose de 250 mcg equivale a 0,25 mg, e 0,25 mg divididos por 2 mg/mL dão 0,125 mL. Esse volume é a resposta em mililitros; tudo o que vem depois dele é mudança de escala, não de quantidade.",
        "As doses por frasco saem dos mesmos dois números: peptídeo total dividido pela dose. 10 mg são 10.000 mcg, e 10.000 divididos por 250 dão 40 doses. Esse número serve de conferência rápida — se a calculadora disser que um frasco de 10 mg rende três doses de 250 mcg, alguma entrada está errada.",
      ],
    },
    {
      id: "chart",
      heading: "Tabela de reconstituição de peptídeos",
      lead: "Cada linha de uma tabela de reconstituição de peptídeos é aritmética, não sugestão: ela cruza uma massa de peptídeo com um volume de água bacteriostática e mostra a concentração resultante. 10 mg com 2 mL dão 5 mg/mL; os mesmos 10 mg com 5 mL dão 2 mg/mL. Adicionar água nunca altera a massa de peptídeo.",
      body: [
        "Escolha a linha pelo volume que você quer estar medindo, não pelo número que parece mais redondo. Concentrações mais altas significam menos líquido por injeção e menos água parada no frasco; concentrações mais baixas espalham a mesma dose por mais unidades da seringa, o que torna doses pequenas mais fáceis de ler com precisão.",
        "Nenhuma linha desta tabela diz quanto peptídeo usar. Toda linha guarda a mesma massa total antes e depois da mistura — adicionar água muda a concentração e o volume que você puxa, nunca a quantidade de peptídeo dentro do frasco. Sua dose vem de quem a prescreveu ou do rótulo do produto; a tabela só mostra em que resulta uma determinada mistura.",
      ],
    },
    {
      id: "conversion",
      heading: "Conversão de mcg para unidades na seringa de insulina",
      lead: "As unidades da seringa de insulina saem dos microgramas com uma fórmula só: unidades são a dose em microgramas dividida por dez vezes a concentração em mg/mL. A 2 mg/mL, uma dose de 250 mcg é 250 dividido por 20, ou seja, 12,5 unidades. A mesma dose a 10 mg/mL são 2,5 unidades.",
      body: [
        "O fator dez vem da seringa, não do peptídeo. Uma unidade em uma seringa U-100 é 0,01 mL, então 0,125 mL são 12,5 unidades. Multiplicar o valor em mililitros por 100 chega ao mesmo lugar, com a mesma confiabilidade da fórmula.",
        "Concentração e unidades andam em direções opostas. Dobre a concentração e as unidades caem à metade, porque a mesma massa de peptídeo fica comprimida em metade do líquido. É por isso que uma única linha da tabela de conversão traz 12,5 unidades, 5 unidades e 2,5 unidades: uma dose, três misturas, três marcas diferentes no corpo da seringa.",
        "Confira qual seringa você tem na mão antes de confiar em qualquer número de unidades. Uma seringa U-100 marca 100 unidades por mililitro; uma U-40 marca 40 unidades por mililitro, e os mesmos 0,125 mL seriam 5 unidades nela. Unidade é uma escala impressa no corpo da seringa, não uma quantidade fixa.",
      ],
    },
    {
      id: "u100",
      heading: "Por que a seringa U-100 marca 100 unidades por mililitro",
      lead: "U-100 é um padrão de concentração de insulina: 100 unidades internacionais por mililitro. O corpo da seringa é graduado para que 100 unidades preencham exatamente 1 mL, o que faz de uma unidade 0,01 mL. Em um peptídeo reconstituído, essa escala não carrega sentido de insulina — é só uma régua fina de centésimos de mililitro.",
      body: [
        "Capacidade da seringa e escala de unidades são coisas distintas. Uma seringa U-100 de 0,3 mL vai até 30 unidades, uma de 0,5 mL até 50, uma de 1 mL até 100 — mas em todas as três uma unidade vale 0,01 mL. Dá para aspirar 12,5 unidades em qualquer uma das três; 60 unidades não cabem nas duas primeiras.",
        "Corpos menores são mais fáceis de ler. Em uma seringa de 0,3 mL as graduações ficam mais afastadas, então 12,5 unidades caem claramente entre duas marcas, em vez de espremidas contra elas. Quando o volume calculado cabe, a seringa menor costuma dar a leitura mais precisa.",
        "As marcas de meia unidade não estão em toda seringa. Alguns corpos são impressos só de unidade em unidade, e nesse caso 12,5 unidades têm de ser estimadas entre duas marcas, ou a mistura ajustada para que o número caia sobre uma linha impressa. Olhe a sua própria seringa antes de supor a precisão que a calculadora sugere.",
      ],
    },
    {
      id: "water",
      heading: "Água bacteriostática ou água estéril?",
      lead: "Água bacteriostática é água estéril com 0,9% de álcool benzílico, um conservante que inibe o crescimento bacteriano e permite entrar no frasco mais de uma vez. Água estéril não tem conservante, então, depois que o lacre é perfurado, ela não oferece proteção contra contaminação entre uma retirada e outra.",
      body: [
        "Nenhum dos dois líquidos muda a aritmética. 5 mL são 5 mL, e um frasco de 10 mg reconstituído com qualquer um dos dois dá 2 mg/mL. A escolha afeta por quanto tempo o frasco reconstituído continua utilizável e como ele deve ser guardado, não o volume que você puxa.",
        "Use o diluente indicado no rótulo do seu produto. Alguns peptídeos são especificados com água bacteriostática, outros com água estéril, outros com um diluente completamente diferente; o próprio álcool benzílico é a razão pela qual certos produtos nunca são reconstituídos com ela. Quando o rótulo e um post de fórum divergem, o rótulo vence.",
        "Adicione a água devagar, escorrendo pela parede interna do frasco, em vez de jogá-la sobre o pó, e deixe o frasco parado até a solução ficar transparente. Não agite. Peptídeos são moléculas frágeis, e a agitação as degrada sem mudar nada do que a calculadora mede.",
      ],
    },
    {
      id: "mistakes",
      heading: "Erros comuns no cálculo da dose de peptídeo",
      lead: "A maioria dos erros de cálculo com peptídeos é erro de unidade, e são erros grandes: confundir microgramas com miligramas desloca a vírgula por um fator de 1.000, e ler uma seringa U-40 como se fosse U-100 erra o volume por um fator de 2,5. Os dois produzem um número que parece plausível na seringa.",
      body: [
        "Supor que o volume de água é fixo vem em seguida. Não existe quantidade padrão de água bacteriostática para um frasco de 10 mg — 2 mL dão 5 mg/mL e 5 mL dão 2 mg/mL —, então um número de unidades copiado do frasco de outra pessoa está errado no seu. Recalcule para o volume que você realmente adicionou.",
        "Reaproveitar um número depois de mudar a mistura é o mesmo erro em câmera lenta. Se 250 mcg eram 12,5 unidades no frasco anterior, continuam sendo 12,5 unidades neste só se a concentração for idêntica. Refaça a conta a cada reconstituição.",
        "O pó liofilizado ocupa um pouco de volume, então o líquido final pode ficar ligeiramente acima da água que você adicionou; a calculadora assume que isso não acontece. E um peptídeo rotulado em unidades internacionais, e não em miligramas, não entra em um cálculo baseado em mg sem o fator de conversão daquele produto específico.",
      ],
    },
    {
      id: "faq",
      heading: "Perguntas frequentes",
      lead: "As perguntas mais comuns sobre reconstituição de peptídeos, volume de água bacteriostática e unidades da seringa de insulina estão respondidas abaixo. Cada resposta aplica os mesmos dois passos da calculadora: divida a massa de peptídeo pelo volume de água para achar a concentração, depois divida a dose por essa concentração para achar o volume.",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "Tabela de reconstituição de peptídeos",
    headers: ["Quantidade de peptídeo", "Água bacteriostática adicionada", "Concentração final"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2.5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Dose convertida em unidades da seringa de insulina",
    headers: ["Dose", "a 2 mg/mL", "a 5 mg/mL", "a 10 mg/mL"],
    rows: [
      ["250 mcg", "12.5 U", "5 U", "2.5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1000 mcg", "50 U", "20 U", "10 U"],
      ["2000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "Como calcular a reconstituição de peptídeos?",
      answer:
        "Divida a massa de peptídeo pelo volume de água bacteriostática para obter a concentração, depois divida a sua dose por essa concentração para obter o volume a puxar. Um frasco de 10 mg com 5 mL de água dá 2 mg/mL, então uma dose de 250 mcg é 0,125 mL, ou 12,5 unidades.",
    },
    {
      question: "Quantos mL de água bacteriostática misturar no peptídeo?",
      answer:
        "Qualquer volume que caiba no frasco — a quantidade que você adiciona define a concentração, não a potência. 2 mL em um frasco de 10 mg dão 5 mg/mL; 5 mL dão 2 mg/mL. Volumes maiores tornam doses pequenas mais fáceis de ler na seringa. Siga o volume de diluente indicado no rótulo do produto.",
    },
    {
      question: "Quantos mL para reconstituir 10 mg?",
      answer:
        "Qualquer volume entre cerca de 1 mL e a capacidade do frasco funciona, e cada um dá uma concentração diferente: 1 mL dá 10 mg/mL, 2 mL dão 5 mg/mL e 5 mL dão 2 mg/mL. Escolha o volume indicado no rótulo do produto e calcule a sua dose contra a concentração resultante.",
    },
    {
      question: "Como reconstituir 30 mg de peptídeo?",
      answer:
        "Adicione o volume escolhido de água bacteriostática devagar, pela parede do frasco, e deixe dissolver sem agitar. 3 mL em um frasco de 30 mg dão 10 mg/mL, e 6 mL dão 5 mg/mL. Divida 30 mg pelos mililitros que você adicionou para achar a concentração, depois converta a sua dose contra ela.",
    },
    {
      question: "Quanta água usar para reconstituir 10 mg de peptídeo?",
      answer:
        "O volume de água é escolha sua, e é ele que determina a concentração: 1 mL de água bacteriostática dá 10 mg/mL, 2 mL dão 5 mg/mL, 4 mL dão 2,5 mg/mL e 5 mL dão 2 mg/mL. Os quatro contêm os mesmos 10 mg de peptídeo — só muda o volume puxado por dose.",
    },
    {
      question: "Como fazer o cálculo da reconstituição?",
      answer:
        "São duas divisões. Primeiro, a massa de peptídeo dividida pelo volume de água dá a concentração em mg/mL. Segundo, a sua dose dividida por essa concentração dá o volume em mL. Multiplique esse volume por 100 para ter as unidades em uma seringa U-100. Converta microgramas em miligramas antes: 250 mcg são 0,25 mg.",
    },
    {
      question: "Quantas unidades são 250 mcg na seringa de insulina?",
      answer:
        "As unidades dependem da concentração do seu frasco. Em uma seringa U-100, 250 mcg são 12,5 unidades a 2 mg/mL, 5 unidades a 5 mg/mL e 2,5 unidades a 10 mg/mL. Divida a dose em microgramas por dez vezes a concentração em mg/mL para achar as unidades de qualquer outra mistura.",
    },
    {
      question: "O que significa U-100 na seringa de insulina?",
      answer:
        "U-100 significa que o corpo da seringa é graduado para uma concentração de 100 unidades por mililitro, então uma unidade equivale a 0,01 mL e 100 unidades preenchem 1 mL. As seringas U-40 são graduadas a 40 unidades por mililitro. Ler um volume na escala errada gera um erro de 2,5 vezes.",
    },
  ],
  disclaimer:
    "Ferramenta de conversão apenas. Confirme sempre a concentração, a escala de unidades da seringa e qualquer prescrição com um profissional de saúde qualificado. Esta calculadora não fornece orientação médica.",
};

export const PEPTIDE_CALCULATOR_CONTENT: Partial<Record<Locale, PeptidePageContent>> = { en, pt };

/** Repli utilisé tant qu'une locale n'a pas son contenu rédigé. */
export const PEPTIDE_CALCULATOR_CONTENT_FALLBACK = en;
