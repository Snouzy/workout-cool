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
        "Convert to one mass unit before dividing, or the arithmetic falls apart. Micrograms and milligrams differ by a factor of 1,000: 250 mcg is 0.25 mg, and 1,000 mcg is 1 mg. Every mismatch between the two is a thousandfold error in the volume you draw.",
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
      ["1,000 mcg", "50 U", "20 U", "10 U"],
      ["2,000 mcg", "100 U", "40 U", "20 U"],
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
    "Informe a quantidade no frasco, a água bacteriostática que você adicionou e a sua dose. Veja o volume exato em mililitros e a marca até onde puxar em uma seringa de insulina U-100.",
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
        "Converta tudo para uma única unidade de massa antes de dividir, ou a conta desanda. Microgramas e miligramas diferem por um fator de 1.000: 250 mcg são 0,25 mg, e 1.000 mcg são 1 mg. Cada troca entre as duas unidades vira um erro de mil vezes no volume que você puxa.",
        "No exemplo, 10 mg de peptídeo divididos por 5 mL de água dão 2 mg/mL. A dose de 250 mcg equivale a 0,25 mg, e 0,25 mg divididos por 2 mg/mL dão 0,125 mL. Esse volume é a resposta em mililitros; tudo o que vem depois dele é mudança de escala, não de quantidade.",
        "As doses por frasco saem dos mesmos dois números: peptídeo total dividido pela dose. 10 mg são 10.000 mcg, e 10.000 divididos por 250 dão 40 doses. Esse número serve de conferência rápida — se a calculadora disser que um frasco de 10 mg rende três doses de 250 mcg, alguma entrada está errada.",
      ],
    },
    {
      id: "chart",
      heading: "Tabela de reconstituição de peptídeos",
      lead: "Cada linha de uma tabela de reconstituição de peptídeos é aritmética, não sugestão: ela cruza uma massa de peptídeo com um volume de água bacteriostática e mostra a concentração resultante. 10 mg com 2 mL dão 5 mg/mL; os mesmos 10 mg com 5 mL dão 2 mg/mL. Adicionar água nunca altera a massa de peptídeo.",
      body: [
        "Escolha a linha pelo volume que você quer medir, não pelo número que parece mais redondo. Concentrações mais altas significam menos líquido por injeção e menos água parada no frasco; concentrações mais baixas espalham a mesma dose por mais unidades da seringa, o que torna doses pequenas mais fáceis de ler com precisão.",
        "Nenhuma linha desta tabela diz quanto peptídeo usar. Toda linha guarda a mesma massa total antes e depois da mistura — adicionar água muda a concentração e o volume que você puxa, nunca a quantidade de peptídeo dentro do frasco. Sua dose vem de quem a prescreveu ou do rótulo do produto; a tabela só mostra em que resulta uma determinada mistura.",
      ],
    },
    {
      id: "conversion",
      heading: "Conversão de mcg para unidades na seringa de insulina",
      lead: "As unidades da seringa de insulina saem dos microgramas com uma fórmula só: unidades são a dose em microgramas dividida por dez vezes a concentração em mg/mL. A 2 mg/mL, uma dose de 250 mcg é 250 dividido por 20, ou seja, 12,5 unidades. A mesma dose a 10 mg/mL são 2,5 unidades.",
      body: [
        "O fator dez vem da seringa, não do peptídeo. Uma unidade em uma seringa U-100 é 0,01 mL, então 0,125 mL são 12,5 unidades. Multiplicar o valor em mililitros por 100 dá no mesmo, com a mesma confiabilidade da fórmula.",
        "Concentração e unidades andam em direções opostas. Dobre a concentração e as unidades caem à metade, porque a mesma massa de peptídeo fica comprimida em metade do líquido. É por isso que uma única linha da tabela de conversão traz 12,5; 5 e 2,5 unidades: uma dose, três misturas, três marcas diferentes no corpo da seringa.",
        "Confira qual seringa você tem na mão antes de confiar em qualquer número de unidades. Uma seringa U-100 marca 100 unidades por mililitro; uma U-40 marca 40 unidades por mililitro, e os mesmos 0,125 mL seriam 5 unidades nela. Unidade é uma escala impressa no corpo da seringa, não uma quantidade fixa.",
      ],
    },
    {
      id: "u100",
      heading: "Por que a seringa U-100 marca 100 unidades por mililitro",
      lead: "U-100 é um padrão de concentração de insulina: 100 unidades internacionais por mililitro. O corpo da seringa é graduado para que 100 unidades preencham exatamente 1 mL, de modo que uma unidade equivale a 0,01 mL. Em um peptídeo reconstituído, essa escala não tem nada a ver com insulina — é só uma régua fina de centésimos de mililitro.",
      body: [
        "Capacidade da seringa e escala de unidades são coisas distintas. Uma seringa U-100 de 0,3 mL vai até 30 unidades, uma de 0,5 mL até 50, uma de 1 mL até 100 — mas em todas as três uma unidade vale 0,01 mL. Dá para aspirar 12,5 unidades em qualquer uma das três; 60 unidades não cabem nas duas primeiras.",
        "Corpos menores são mais fáceis de ler. Em uma seringa de 0,3 mL as graduações ficam mais afastadas, então 12,5 unidades caem claramente entre duas marcas, em vez de ficarem espremidas contra elas. Quando o volume calculado cabe, a seringa menor costuma dar a leitura mais precisa.",
        "As marcas de meia unidade não estão em toda seringa. Alguns corpos de seringa são impressos só de unidade em unidade, e nesse caso 12,5 unidades têm de ser estimadas entre duas marcas, ou a mistura ajustada para que o número caia sobre uma linha impressa. Olhe a sua própria seringa antes de supor a precisão que a calculadora sugere.",
      ],
    },
    {
      id: "water",
      heading: "Água bacteriostática ou água estéril?",
      lead: "Água bacteriostática é água estéril com 0,9% de álcool benzílico, um conservante que inibe o crescimento bacteriano e permite puncionar o frasco mais de uma vez. Água estéril não tem conservante, então, depois que o lacre é perfurado, ela não oferece proteção contra contaminação entre uma retirada e outra.",
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
        "O erro seguinte é supor que o volume de água é fixo. Não existe quantidade padrão de água bacteriostática para um frasco de 10 mg — 2 mL dão 5 mg/mL e 5 mL dão 2 mg/mL —, então um número de unidades copiado do frasco de outra pessoa está errado no seu. Recalcule para o volume que você realmente adicionou.",
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
      ["5 mg", "2 mL", "2,5 mg/mL"],
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
      ["250 mcg", "12,5 U", "5 U", "2,5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1.000 mcg", "50 U", "20 U", "10 U"],
      ["2.000 mcg", "100 U", "40 U", "20 U"],
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
        "Qualquer volume entre cerca de 1 mL e a capacidade do frasco funciona, e cada um dá uma concentração diferente: 1 mL dá 10 mg/mL, 2 mL dão 5 mg/mL e 5 mL dão 2 mg/mL. Escolha o volume indicado no rótulo do produto e calcule a sua dose com base na concentração resultante.",
    },
    {
      question: "Como reconstituir 30 mg de peptídeo?",
      answer:
        "Adicione o volume escolhido de água bacteriostática devagar, pela parede do frasco, e deixe dissolver sem agitar. 3 mL em um frasco de 30 mg dão 10 mg/mL, e 6 mL dão 5 mg/mL. Divida 30 mg pelos mililitros que você adicionou para achar a concentração, depois converta a sua dose usando essa concentração.",
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

const fr: PeptidePageContent = {
  heroSubtitle:
    "Indiquez la quantité inscrite sur votre flacon, l'eau bactériostatique que vous avez ajoutée et votre dose. Vous obtenez le volume exact en millilitres et la graduation à atteindre sur une seringue à insuline U-100.",
  sections: [
    {
      id: "how-to",
      heading: "Comment utiliser ce calculateur de peptides",
      lead: "Trois nombres suffisent à ce calculateur de peptides : les milligrammes de peptide inscrits sur le flacon, les millilitres d'eau bactériostatique que vous ajoutez et la dose en mcg que vous voulez prélever. Entrez-les et vous obtenez le volume en millilitres et la graduation correspondante sur votre seringue à insuline.",
      body: [
        "Commencez par le flacon. L'étiquette qui indique 10 mg donne la masse de peptide sec, pas un volume : il n'y a rien à mesurer avant d'avoir ajouté du liquide. Entrez 10 mg comme quantité dans le flacon.",
        "Entrez ensuite l'eau bactériostatique. C'est le volume que vous poussez dans le flacon, et c'est vous qui le choisissez, dans la limite de la contenance du flacon : 5 mL d'eau dans un flacon de 10 mg donnent une concentration de 2 mg/mL. Moins d'eau, solution plus concentrée et volume plus petit par dose ; plus d'eau, solution plus diluée et volume plus grand, donc plus facile à mesurer.",
        "Entrez la dose en dernier, en mcg, telle qu'elle figure sur votre ordonnance ou sur l'étiquette du produit. Le calculateur ne juge pas ce nombre, il le convertit. Une dose de 250 mcg à 2 mg/mL occupe 0,125 mL, soit 12,5 unités sur une seringue U-100, et le flacon de 10 mg en contient 40.",
        "Lisez le résultat sur le schéma de la seringue avant de prélever. Le nombre d'unités est la graduation où vous alignez le piston ; le volume en millilitres est cette même quantité dans l'unité imprimée sur le corps d'une seringue à tuberculine. Les deux décrivent un seul et même volume.",
      ],
    },
    {
      id: "formula",
      heading: "La formule de reconstitution des peptides",
      lead: "La reconstitution d'un peptide tient en deux divisions : la concentration est la masse de peptide divisée par le volume d'eau, et le volume de la dose est la dose divisée par la concentration. Un flacon de 10 mg reconstitué avec 5 mL d'eau bactériostatique donne 2 mg/mL, donc 250 mcg occupent 0,125 mL.",
      body: [
        "Ramenez tout à une seule unité de masse avant de diviser, sinon le calcul s'effondre. Un facteur 1 000 sépare le microgramme du milligramme : 250 mcg valent 0,25 mg, et 1 000 mcg valent 1 mg. Chaque confusion entre les deux fausse le volume prélevé d'un facteur 1 000.",
        "10 mg de peptide divisés par 5 mL d'eau font 2 mg/mL. La dose de 250 mcg vaut 0,25 mg. 0,25 mg divisé par 2 mg/mL fait 0,125 mL. Ce volume est la réponse en millilitres ; tout ce qui vient après n'est qu'un changement d'échelle, pas de quantité.",
        "Le nombre de doses par flacon sort des deux mêmes nombres : peptide total divisé par la dose. 10 mg valent 10 000 mcg, et 10 000 divisés par 250 donnent 40 doses. Ce chiffre sert de contrôle rapide : si le calculateur annonce trois doses de 250 mcg dans un flacon de 10 mg, une de vos entrées est fausse.",
      ],
    },
    {
      id: "chart",
      heading: "Tableau de reconstitution des peptides",
      lead: "Les lignes d'un tableau de reconstitution sont de l'arithmétique, pas des suggestions : chacune associe une masse de peptide à un volume d'eau bactériostatique et donne la concentration obtenue. 10 mg avec 2 mL donnent 5 mg/mL ; les mêmes 10 mg avec 5 mL donnent 2 mg/mL. Ajouter de l'eau ne change jamais la masse de peptide.",
      body: [
        "Choisissez une ligne selon le volume que vous voulez mesurer, pas selon le chiffre le plus rond. Une concentration élevée signifie moins de liquide par injection et moins d'eau qui dort dans le flacon ; une concentration faible étale la même dose sur plus de graduations, ce qui rend les petites doses plus lisibles.",
        "Aucune ligne de ce tableau ne dit quelle quantité de peptide utiliser. Chaque ligne contient la même masse totale avant et après le mélange : ajouter de l'eau change la concentration et le volume prélevé, jamais la quantité de peptide dans le flacon. Votre dose vient de votre prescripteur ou de l'étiquette du produit ; le tableau indique seulement le résultat d'un mélange donné.",
      ],
    },
    {
      id: "conversion",
      heading: "Convertir des mcg en unités de seringue à insuline",
      lead: "Les unités de seringue à insuline se déduisent des mcg par une seule formule : les unités valent la dose en mcg divisée par dix fois la concentration en mg/mL. À 2 mg/mL, une dose de 250 mcg fait 250 divisé par 20, soit 12,5 unités. La même dose à 10 mg/mL fait 2,5 unités.",
      body: [
        "Le facteur dix vient de la seringue, pas du peptide. Une unité sur une seringue U-100 vaut 0,01 mL, donc 0,125 mL fait 12,5 unités. Multiplier le volume en millilitres par 100 donne le même résultat, aussi sûrement que la formule.",
        "Concentration et unités varient en sens inverse. Doublez la concentration et les unités diminuent de moitié, puisque la même masse de peptide tient dans deux fois moins de liquide. C'est pourquoi une même ligne du tableau de conversion donne 12,5 unités, puis 5, puis 2,5 : une dose, trois mélanges, trois graduations différentes.",
        "Vérifiez quelle seringue vous avez en main avant de vous fier à un nombre d'unités. Une seringue U-100 compte 100 unités par millilitre, une U-40 n'en compte que 40, et les mêmes 0,125 mL y feraient 5 unités. Une unité est une graduation imprimée sur un corps de seringue, pas une quantité fixe.",
      ],
    },
    {
      id: "u100",
      heading: "Pourquoi une seringue U-100 est graduée à 100 unités par millilitre",
      lead: "U-100 est une norme de concentration de l'insuline : 100 unités internationales par millilitre. Le corps de la seringue est gradué pour que 100 unités remplissent exactement 1 mL, ce qui fait une unité de 0,01 mL. Pour un peptide reconstitué, cette échelle ne dit rien de l'insuline : c'est une règle graduée en centièmes de millilitre.",
      body: [
        "La contenance de la seringue et l'échelle des unités sont deux choses distinctes. Une seringue U-100 de 0,3 mL est graduée jusqu'à 30 unités, une de 0,5 mL jusqu'à 50, une de 1 mL jusqu'à 100 ; dans les trois cas, une unité vaut 0,01 mL. Un prélèvement de 12,5 unités passe dans les trois ; 60 unités ne passent pas dans les deux premières.",
        "Les petits corps de seringue se lisent mieux. Sur une seringue de 0,3 mL, les graduations sont plus espacées : 12,5 unités tombent nettement entre deux traits au lieu d'être écrasées contre eux. Quand le volume calculé y tient, la plus petite seringue donne le prélèvement le plus précis.",
        "Les demi-graduations ne sont pas imprimées sur toutes les seringues. Certains corps sont gradués à l'unité seulement : vous devez alors estimer 12,5 unités entre deux traits, ou ajuster le mélange pour que le nombre tombe sur un trait imprimé. Regardez votre propre seringue avant de croire à la précision que le calculateur suggère.",
      ],
    },
    {
      id: "water",
      heading: "Eau bactériostatique ou eau stérile ?",
      lead: "L'eau bactériostatique est de l'eau stérile contenant 0,9 % d'alcool benzylique, un conservateur qui freine la croissance bactérienne et permet de percer le flacon plusieurs fois. L'eau stérile n'a pas de conservateur : une fois son opercule percé, elle ne protège plus de la contamination entre deux prélèvements.",
      body: [
        "Aucune des deux ne change le calcul. 5 mL font 5 mL, et un flacon de 10 mg reconstitué avec l'une ou l'autre donne 2 mg/mL. Le choix joue sur la durée de conservation du flacon reconstitué et sur son mode de stockage, pas sur le volume que vous prélevez.",
        "Utilisez le solvant indiqué sur l'étiquette de votre produit. Certains peptides sont prévus avec de l'eau bactériostatique, d'autres avec de l'eau stérile, d'autres encore avec un solvant tout différent ; l'alcool benzylique est d'ailleurs la raison pour laquelle certains produits ne sont jamais reconstitués avec de l'eau bactériostatique. Quand l'étiquette et un message de forum se contredisent, c'est l'étiquette qui tranche.",
        "Versez l'eau lentement le long de la paroi interne du flacon plutôt que directement sur la poudre, et laissez reposer jusqu'à ce que la solution soit limpide. Ne secouez pas. Les peptides sont des molécules fragiles, et l'agitation les dégrade sans rien changer à ce que mesure le calculateur.",
      ],
    },
    {
      id: "mistakes",
      heading: "Erreurs fréquentes dans le calcul d'une dose de peptide",
      lead: "La plupart des erreurs de calcul d'une dose de peptide sont des erreurs d'unité, et elles sont énormes : confondre les mcg et les mg fausse le volume d'un facteur 1 000, et lire une seringue U-40 comme une U-100 le fausse d'un facteur 2,5. Les deux donnent un nombre crédible sur la seringue.",
      body: [
        "L'erreur suivante consiste à croire que le volume d'eau est imposé. Il n'existe pas de quantité standard d'eau bactériostatique pour un flacon de 10 mg — 2 mL donnent 5 mg/mL, 5 mL donnent 2 mg/mL — donc un nombre d'unités recopié du flacon de quelqu'un d'autre est faux sur le vôtre. Recalculez avec le volume que vous avez réellement ajouté.",
        "Réutiliser un chiffre après avoir changé le mélange est la même erreur au ralenti. Si 250 mcg faisaient 12,5 unités sur votre flacon précédent, ils font 12,5 unités sur celui-ci uniquement à concentration identique. Refaites le calcul à chaque reconstitution.",
        "La poudre lyophilisée occupe elle-même un peu de volume : le volume final peut donc dépasser légèrement le volume d'eau que vous avez ajouté, et le calculateur n'en tient pas compte. Autre limite : un peptide étiqueté en unités internationales plutôt qu'en milligrammes n'entre pas dans un calcul en mg sans le facteur de conversion propre à ce produit.",
      ],
    },
    {
      id: "faq",
      heading: "Questions fréquentes",
      lead: "Les questions les plus courantes sur la reconstitution des peptides, le volume d'eau bactériostatique et les unités de seringue à insuline trouvent leur réponse ci-dessous. Chaque réponse applique les deux mêmes étapes que le calculateur : divisez la masse de peptide par le volume d'eau pour la concentration, puis la dose par cette concentration pour le volume.",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "Tableau de reconstitution des peptides",
    headers: ["Quantité de peptide", "Eau bactériostatique ajoutée", "Concentration finale"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2,5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Dose convertie en unités de seringue à insuline",
    headers: ["Dose", "à 2 mg/mL", "à 5 mg/mL", "à 10 mg/mL"],
    rows: [
      ["250 mcg", "12,5 U", "5 U", "2,5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1 000 mcg", "50 U", "20 U", "10 U"],
      ["2 000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "Comment calculer la reconstitution d'un peptide ?",
      answer:
        "Divisez la masse de peptide par le volume d'eau bactériostatique pour obtenir la concentration, puis divisez votre dose par cette concentration pour obtenir le volume à prélever. Un flacon de 10 mg avec 5 mL d'eau donne 2 mg/mL, donc une dose de 250 mcg fait 0,125 mL, soit 12,5 unités.",
    },
    {
      question: "Combien de mL d'eau bactériostatique mettre dans un flacon de peptide ?",
      answer:
        "N'importe quel volume que le flacon peut contenir : la quantité ajoutée fixe la concentration, pas la puissance du produit. 2 mL dans un flacon de 10 mg donnent 5 mg/mL, 5 mL donnent 2 mg/mL. Un grand volume rend les petites doses plus lisibles. Suivez le volume indiqué sur l'étiquette.",
    },
    {
      question: "Combien de mL pour reconstituer 10 mg ?",
      answer:
        "Tout volume entre environ 1 mL et la contenance du flacon fonctionne, et chacun donne une concentration différente : 1 mL donne 10 mg/mL, 2 mL donnent 5 mg/mL, 5 mL donnent 2 mg/mL. Prenez le volume indiqué sur l'étiquette de votre produit, puis calculez votre dose d'après la concentration obtenue.",
    },
    {
      question: "Comment reconstituer 30 mg de peptide ?",
      answer:
        "Versez lentement, le long de la paroi du flacon, le volume d'eau bactériostatique choisi, et laissez la poudre se dissoudre sans secouer. 3 mL dans un flacon de 30 mg donnent 10 mg/mL, 6 mL donnent 5 mg/mL. Divisez 30 mg par les millilitres ajoutés pour la concentration, puis convertissez votre dose.",
    },
    {
      question: "Quelle quantité d'eau pour reconstituer 10 mg de peptide ?",
      answer:
        "Le volume d'eau est votre choix et c'est lui qui détermine la concentration : 1 mL d'eau bactériostatique donne 10 mg/mL, 2 mL donnent 5 mg/mL, 4 mL donnent 2,5 mg/mL, 5 mL donnent 2 mg/mL. Les quatre contiennent les mêmes 10 mg de peptide ; seul le volume prélevé par dose change.",
    },
    {
      question: "Comment faire le calcul de la reconstitution ?",
      answer:
        "Deux divisions suffisent. D'abord, la masse de peptide divisée par le volume d'eau donne la concentration en mg/mL. Ensuite, votre dose divisée par cette concentration donne le volume en mL. Multipliez ce volume par 100 pour les unités sur une seringue U-100. Convertissez les mcg en mg au préalable : 250 mcg valent 0,25 mg.",
    },
    {
      question: "Combien d'unités font 250 mcg sur une seringue à insuline ?",
      answer:
        "Le nombre d'unités dépend de la concentration de votre flacon. Sur une seringue U-100, 250 mcg font 12,5 unités à 2 mg/mL, 5 unités à 5 mg/mL et 2,5 unités à 10 mg/mL. Divisez la dose en mcg par dix fois la concentration en mg/mL pour tout autre mélange.",
    },
    {
      question: "Que veut dire U-100 sur une seringue à insuline ?",
      answer:
        "U-100 veut dire que le corps de la seringue est gradué pour une concentration de 100 unités par millilitre : une unité vaut 0,01 mL et 100 unités remplissent 1 mL. Les seringues U-40 sont graduées à 40 unités par millilitre. Lire un volume sur la mauvaise échelle fausse le résultat d'un facteur 2,5.",
    },
  ],
  disclaimer:
    "Outil de conversion uniquement. Vérifiez toujours la concentration, l'échelle d'unités de votre seringue et toute ordonnance auprès d'un professionnel de santé qualifié. Ce calculateur ne donne pas d'avis médical.",
};

const es: PeptidePageContent = {
  heroSubtitle:
    "Introduce la cantidad que indica tu vial, el agua bacteriostática que añadiste y tu dosis. Obtienes el volumen exacto en mililitros y hasta qué graduación cargar en una jeringa de insulina U-100.",
  sections: [
    {
      id: "how-to",
      heading: "Cómo usar esta calculadora de péptidos",
      lead: "Esta calculadora de péptidos trabaja con tres números: los miligramos de péptido impresos en el vial, los mililitros de agua bacteriostática que añades y la dosis en mcg que quieres cargar. Introdúcelos y obtienes el volumen en mililitros y la graduación correspondiente en tu jeringa de insulina.",
      body: [
        "Empieza por el vial. Una etiqueta que dice 10 mg indica la masa de péptido seco, no un volumen: no hay nada que medir hasta que añades líquido. Introduce 10 mg como cantidad en el vial.",
        "Introduce después el agua bacteriostática. Es el volumen que empujas dentro del vial, y lo eliges tú dentro de su capacidad: 5 mL de agua en un vial de 10 mg dan una concentración de 2 mg/mL. Con menos agua la solución queda más concentrada y el volumen por dosis es menor; con más agua queda más diluida y el volumen es mayor, más fácil de medir.",
        "Introduce la dosis al final, en mcg, tal como aparece en tu receta o en la etiqueta del producto. La calculadora no juzga ese número: lo convierte. Una dosis de 250 mcg a 2 mg/mL ocupa 0,125 mL, es decir 12,5 unidades en una jeringa U-100, y el vial de 10 mg contiene 40 dosis de ese tamaño.",
        "Lee el resultado en el diagrama de la jeringa antes de cargar. La cifra en unidades es la graduación donde alineas el émbolo; la cifra en mililitros es esa misma cantidad en la unidad impresa en el cuerpo de una jeringa de tuberculina. Las dos describen el mismo volumen.",
      ],
    },
    {
      id: "formula",
      heading: "La fórmula de la reconstitución de péptidos",
      lead: "Reconstituir un péptido son dos divisiones: la concentración es la masa de péptido dividida entre el volumen de agua, y el volumen de la dosis es la dosis dividida entre la concentración. Un vial de 10 mg con 5 mL de agua bacteriostática da 2 mg/mL, así que 250 mcg ocupan 0,125 mL.",
      body: [
        "Pasa todo a una sola unidad de masa antes de dividir, o la cuenta no cuadra. Entre el microgramo y el miligramo hay un factor de 1000: 250 mcg son 0,25 mg, y 1000 mcg son 1 mg. Confundirlos falsea el volumen que cargas por un factor de 1000.",
        "10 mg de péptido divididos entre 5 mL de agua dan 2 mg/mL. La dosis de 250 mcg equivale a 0,25 mg, y 0,25 mg entre 2 mg/mL da 0,125 mL. Ese volumen es la respuesta en mililitros; todo lo que viene después es un cambio de escala, no de cantidad.",
        "Las dosis por vial salen de los mismos dos números: péptido total dividido entre la dosis. 10 mg son 10 000 mcg, y 10 000 entre 250 dan 40 dosis. Esa cifra sirve de comprobación rápida: si la calculadora dice que un vial de 10 mg rinde tres dosis de 250 mcg, algún dato que introdujiste está mal.",
      ],
    },
    {
      id: "chart",
      heading: "Tabla de reconstitución de péptidos",
      lead: "Las filas de una tabla de reconstitución de péptidos son aritmética, no sugerencias: cada una cruza una masa de péptido con un volumen de agua bacteriostática y da la concentración resultante. 10 mg con 2 mL dan 5 mg/mL; los mismos 10 mg con 5 mL dan 2 mg/mL. Añadir agua nunca cambia la masa de péptido.",
      body: [
        "Elige una fila por el volumen que quieres medir, no por la cifra que parece más redonda. Una concentración alta significa menos líquido por inyección y menos agua sin usar en el vial; una concentración baja reparte la misma dosis entre más unidades de la jeringa, y las dosis pequeñas resultan más fáciles de leer con precisión.",
        "Ninguna fila de esta tabla dice cuánto péptido usar. Todas guardan la misma masa total antes y después de la mezcla: añadir agua cambia la concentración y el volumen que cargas, nunca la cantidad de péptido que hay dentro del vial. Tu dosis viene de quien te la prescribe o de la etiqueta del producto; la tabla solo dice qué concentración da una mezcla determinada.",
      ],
    },
    {
      id: "conversion",
      heading: "Convertir mcg a unidades de jeringa de insulina",
      lead: "Las unidades de una jeringa de insulina salen de los mcg con una sola fórmula: las unidades son la dosis en mcg dividida entre diez veces la concentración en mg/mL. A 2 mg/mL, una dosis de 250 mcg es 250 entre 20, o sea 12,5 unidades. La misma dosis a 10 mg/mL son 2,5 unidades.",
      body: [
        "El factor 10 viene de la jeringa, no del péptido. Una unidad en una jeringa U-100 es 0,01 mL, así que 0,125 mL equivale a 12,5 unidades. Multiplicar la cifra en mililitros por 100 da el mismo resultado, con la misma fiabilidad que la fórmula.",
        "Concentración y unidades van en sentidos opuestos. Duplica la concentración y las unidades caen a la mitad, porque la misma masa de péptido queda comprimida en la mitad de líquido. Por eso una sola fila de la tabla de conversión da 12,5 unidades, luego 5 y luego 2,5: una dosis, tres mezclas, tres graduaciones distintas.",
        "Comprueba qué jeringa tienes en la mano antes de fiarte de una cifra de unidades. Una jeringa U-100 marca 100 unidades por mililitro; una U-40 marca 40 unidades por mililitro, y esos mismos 0,125 mL serían 5 unidades en ella. Las unidades son una escala impresa en un cuerpo de jeringa, no una cantidad fija.",
      ],
    },
    {
      id: "u100",
      heading: "Por qué una jeringa U-100 marca 100 unidades por mililitro",
      lead: "U-100 es un estándar de concentración de insulina: 100 unidades internacionales por mililitro. El cuerpo de la jeringa está graduado para que 100 unidades llenen exactamente 1 mL, así que una unidad equivale a 0,01 mL. En un péptido reconstituido esa escala no dice nada de insulina: es una regla graduada en centésimas de mililitro.",
      body: [
        "La capacidad de la jeringa y la escala de unidades son dos cosas distintas. Una jeringa U-100 de 0,3 mL está graduada hasta 30 unidades, una de 0,5 mL hasta 50 y una de 1 mL hasta 100; en las tres, una unidad vale 0,01 mL. Una carga de 12,5 unidades entra en las tres; una de 60 unidades no entra en las dos primeras.",
        "Una jeringa pequeña te da una lectura más clara. En una de 0,3 mL las graduaciones quedan más separadas, así que 12,5 unidades caen claramente entre dos marcas en lugar de quedar apretadas contra ellas. Cuando el volumen calculado cabe, la jeringa más pequeña suele darte la carga más precisa.",
        "Las marcas de media unidad no están impresas en todas las jeringas. Algunos cuerpos vienen graduados solo de unidad en unidad, y entonces tienes que estimar 12,5 unidades entre dos marcas, o ajustar la mezcla para que la cifra caiga sobre una línea impresa. Mira tu propia jeringa antes de dar por buena la precisión que sugiere la calculadora.",
      ],
    },
    {
      id: "water",
      heading: "¿Agua bacteriostática o agua estéril?",
      lead: "El agua bacteriostática es agua estéril con un 0,9 % de alcohol bencílico, un conservante que frena el crecimiento bacteriano y permite perforar el vial más de una vez. El agua estéril no lleva conservante, así que una vez perforado su sello no protege de la contaminación entre una carga y otra.",
      body: [
        "Ninguno de los dos líquidos cambia la aritmética. 5 mL son 5 mL, y un vial de 10 mg reconstituido con uno o con otro da 2 mg/mL. La elección cambia cuánto tiempo dura el vial reconstituido y cómo lo guardas, no el volumen que cargas.",
        "Usa el diluyente que indica la etiqueta de tu producto. Algunos péptidos piden agua bacteriostática, otros agua estéril y otros un diluyente distinto; el propio alcohol bencílico es la razón por la que ciertos productos nunca llevan agua bacteriostática. Cuando la etiqueta y un mensaje de foro se contradicen, manda la etiqueta.",
        "Echa el agua despacio, por la pared interior del vial en lugar de lanzarla sobre el polvo, y deja el vial quieto hasta que la solución quede transparente. No lo agites. Los péptidos son moléculas frágiles, y la agitación las degrada sin cambiar nada de lo que mide la calculadora.",
      ],
    },
    {
      id: "mistakes",
      heading: "Errores frecuentes al calcular una dosis de péptido",
      lead: "La mayoría de los errores al calcular una dosis de péptido son errores de unidad, y son enormes: confundir mcg con mg falsea el volumen por un factor de 1000, y leer una jeringa U-40 como si fuera U-100 lo falsea por un factor de 2,5. Los dos dan una cifra creíble en la jeringa.",
      body: [
        "El error siguiente consiste en creer que el volumen de agua es fijo. No existe una cantidad estándar de agua bacteriostática para un vial de 10 mg —2 mL dan 5 mg/mL y 5 mL dan 2 mg/mL—, así que una cifra de unidades copiada del vial de otra persona está mal en el tuyo. Vuelve a calcular con el volumen que añadiste realmente.",
        "Reutilizar una cifra después de cambiar la mezcla es el mismo error a cámara lenta. Si 250 mcg eran 12,5 unidades en tu vial anterior, siguen siendo 12,5 unidades en este solo si la concentración es idéntica. Repite la cuenta cada vez que reconstituyes.",
        "El polvo liofilizado ocupa algo de espacio, así que el volumen final puede superar ligeramente el volumen de agua que añadiste, y la calculadora no lo tiene en cuenta. Otro límite: un péptido etiquetado en unidades internacionales y no en miligramos no entra en un cálculo en mg sin el factor de conversión propio de ese producto.",
      ],
    },
    {
      id: "faq",
      heading: "Preguntas frecuentes",
      lead: "Las preguntas más frecuentes sobre reconstitución de péptidos, volumen de agua bacteriostática y unidades de jeringa de insulina tienen respuesta más abajo. Cada respuesta aplica los mismos dos pasos de la calculadora: dividir la masa de péptido entre el volumen de agua para la concentración, y luego la dosis entre esa concentración para el volumen.",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "Tabla de reconstitución de péptidos",
    headers: ["Cantidad de péptido", "Agua bacteriostática añadida", "Concentración final"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2,5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Dosis convertida en unidades de jeringa de insulina",
    headers: ["Dosis", "a 2 mg/mL", "a 5 mg/mL", "a 10 mg/mL"],
    rows: [
      ["250 mcg", "12,5 U", "5 U", "2,5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1000 mcg", "50 U", "20 U", "10 U"],
      ["2000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "¿Cómo calcular la reconstitución de péptidos?",
      answer:
        "Divide la masa de péptido entre el volumen de agua bacteriostática para obtener la concentración, y luego tu dosis entre esa concentración para obtener el volumen que tienes que cargar. Un vial de 10 mg con 5 mL de agua da 2 mg/mL, así que una dosis de 250 mcg es 0,125 mL, o 12,5 unidades.",
    },
    {
      question: "¿Cuántos mL de agua bacteriostática mezclar con un péptido?",
      answer:
        "Cualquier volumen que quepa en el vial: la cantidad que añades fija la concentración, no la potencia del producto. 2 mL en un vial de 10 mg dan 5 mg/mL; 5 mL dan 2 mg/mL. Los volúmenes grandes hacen que las dosis pequeñas sean más fáciles de leer. Sigue el volumen de diluyente que indica la etiqueta.",
    },
    {
      question: "¿Cuántos mL para reconstituir 10 mg?",
      answer:
        "Funciona cualquier volumen entre aproximadamente 1 mL y la capacidad del vial, y cada uno da una concentración distinta: 1 mL da 10 mg/mL, 2 mL dan 5 mg/mL y 5 mL dan 2 mg/mL. Elige el volumen que indica la etiqueta de tu producto y calcula tu dosis a partir de la concentración resultante.",
    },
    {
      question: "¿Cómo reconstituir 30 mg de péptido?",
      answer:
        "Echa despacio el agua bacteriostática que hayas elegido, por la pared del vial, y deja que el polvo se disuelva sin agitar el vial. 3 mL en un vial de 30 mg dan 10 mg/mL, y 6 mL dan 5 mg/mL. Divide 30 mg entre los mililitros que añadiste y convierte tu dosis a partir de esa concentración.",
    },
    {
      question: "¿Cuánta agua para reconstituir 10 mg de péptido?",
      answer:
        "El volumen de agua lo eliges tú, y es lo que determina la concentración: 1 mL de agua bacteriostática da 10 mg/mL, 2 mL dan 5 mg/mL, 4 mL dan 2,5 mg/mL y 5 mL dan 2 mg/mL. Los cuatro contienen los mismos 10 mg de péptido; solo cambia el volumen que cargas por dosis.",
    },
    {
      question: "¿Cómo hacer el cálculo de la reconstitución?",
      answer:
        "Con dos divisiones. Primero, la masa de péptido entre el volumen de agua da la concentración en mg/mL. Segundo, tu dosis entre esa concentración da el volumen en mL. Multiplica ese volumen por 100 para las unidades en una jeringa U-100. Pasa antes los mcg a mg: 250 mcg son 0,25 mg.",
    },
    {
      question: "¿Cuántas unidades son 250 mcg en una jeringa de insulina?",
      answer:
        "El número de unidades depende de la concentración de tu vial. En una jeringa U-100, 250 mcg son 12,5 unidades a 2 mg/mL, 5 unidades a 5 mg/mL y 2,5 unidades a 10 mg/mL. Divide la dosis en mcg entre diez veces la concentración en mg/mL para cualquier otra mezcla.",
    },
    {
      question: "¿Qué significa U-100 en una jeringa de insulina?",
      answer:
        "U-100 significa que el cuerpo de la jeringa está graduado para una concentración de 100 unidades por mililitro: una unidad vale 0,01 mL y 100 unidades llenan 1 mL. Las jeringas U-40 están graduadas a 40 unidades por mililitro. Leer un volumen en la escala equivocada falsea el resultado por un factor de 2,5.",
    },
  ],
  disclaimer:
    "Solo herramienta de conversión. Verifica siempre la concentración, la escala de unidades de tu jeringa y cualquier receta con un profesional de la salud cualificado. Esta calculadora no da consejo médico.",
};

const ru: PeptidePageContent = {
  heroSubtitle:
    "Укажите количество во флаконе, объём бактериостатической воды, который вы добавили, и вашу дозу. Вы получите точный объём в миллилитрах и отметку, до которой набирать раствор на инсулиновом шприце U-100.",
  sections: [
    {
      id: "how-to",
      heading: "Как пользоваться калькулятором пептидов",
      lead: "Калькулятор пептидов работает с тремя числами: миллиграммы пептида, указанные на флаконе, миллилитры бактериостатической воды, которые вы добавили, и доза в мкг, которую вы собираетесь набрать. Введите все три — и вы получите объём в миллилитрах и то деление, до которого набирать раствор на инсулиновом шприце U-100.",
      body: [
        "Начните с флакона. Надпись «10 мг» на этикетке — это масса сухого пептида, а не объём: пока вы не добавили жидкость, измерять нечего. Введите 10 мг как количество во флаконе.",
        "Затем укажите объём бактериостатической воды. Это тот объём, который вы вливаете во флакон, и выбираете его вы сами, в пределах вместимости флакона: 5 мл воды во флаконе на 10 мг дают концентрацию 2 мг/мл. Меньше воды — раствор крепче и объём на дозу меньше; больше воды — раствор слабее, а объём больше, и его легче отмерить.",
        "Дозу вводите последней, в мкг, точно так, как она записана в назначении врача или в инструкции к препарату. Калькулятор не оценивает это число — он его переводит. Доза 250 мкг при концентрации 2 мг/мл занимает 0,125 мл, то есть 12,5 единицы на шприце U-100, а во флаконе на 10 мг содержится 40 таких доз.",
        "Прежде чем набирать, посмотрите на схему шприца. Число единиц — это отметка, с которой вы совмещаете поршень; число в миллилитрах — та же величина в той единице измерения, что напечатана на цилиндре туберкулинового шприца. Оба числа описывают один и тот же объём.",
      ],
    },
    {
      id: "formula",
      heading: "Формула разведения пептидов",
      lead: "Разведение пептида рассчитывается в два шага, и каждый из них — деление одного числа на другое: концентрация равна массе пептида, поделённой на объём воды, а объём дозы равен дозе, поделённой на концентрацию. Флакон на 10 мг, разведённый 5 мл бактериостатической воды, даёт 2 мг/мл, поэтому доза 250 мкг занимает 0,125 мл.",
      body: [
        "Перед делением приведите всё к одной единице массы, иначе арифметика развалится. Микрограммы и миллиграммы отличаются в 1 000 раз: 250 мкг — это 0,25 мг, а 1 000 мкг — это 1 мг. Каждая путаница между ними — ошибка объёма в тысячу раз.",
        "Пройдите пример по шагам. 10 мг пептида, поделённые на 5 мл воды, дают 2 мг/мл. Доза 250 мкг — это 0,25 мг. 0,25 мг поделить на 2 мг/мл — получается 0,125 мл. Это и есть ответ в миллилитрах; всё, что идёт после него, — смена масштаба, а не количества.",
        "Число доз во флаконе выводится из тех же двух чисел: весь пептид поделить на дозу. 10 мг — это 10 000 мкг, а 10 000 поделить на 250 — получается 40 доз. Это быстрая проверка на здравый смысл: если калькулятор показывает, что во флаконе на 10 мг всего три дозы по 250 мкг, что-то введено неверно.",
      ],
    },
    {
      id: "chart",
      heading: "Таблица разведения пептидов",
      lead: "Строки таблицы разведения пептидов — это арифметика, а не советы: каждая соединяет массу пептида с объёмом бактериостатической воды и показывает получившуюся концентрацию. 10 мг с 2 мл дают 5 мг/мл; те же 10 мг с 5 мл дают 2 мг/мл. Добавленная вода никогда не меняет массу пептида во флаконе.",
      body: [
        "Выбирайте строку по тому объёму, который вам удобно отмерять, а не по самому круглому числу. Высокая концентрация — меньше жидкости на инъекцию и меньше воды, стоящей во флаконе; низкая концентрация растягивает ту же дозу на большее число делений, и маленькие дозы становится легче прочитать точно.",
        "Ни одна строка этой таблицы не говорит, сколько пептида брать. В каждой строке общая масса до и после смешивания одна и та же: вода меняет концентрацию и объём набора, но не количество пептида во флаконе. Дозу назначает врач, либо она указана в инструкции к препарату — таблица лишь показывает, что получается из конкретного разведения.",
      ],
    },
    {
      id: "conversion",
      heading: "Перевод мкг в единицы инсулинового шприца",
      lead: "Микрограммы переводятся в единицы инсулинового шприца одной формулой: разделите дозу в мкг на концентрацию в мг/мл, а результат — ещё на десять. При 2 мг/мл доза 250 мкг — это 250, поделённое на 20, то есть 12,5 единицы. Та же доза при 10 мг/мл — 2,5 единицы.",
      body: [
        "Множитель десять берётся из шприца, а не из пептида. Одна единица на шприце U-100 — это 0,01 мл, поэтому 0,125 мл и есть 12,5 единицы. Умножить объём в миллилитрах на 100 — способ такой же надёжный, как формула выше.",
        "Концентрация и единицы движутся в противоположные стороны. Удвойте концентрацию — единиц станет вдвое меньше, потому что та же масса пептида растворена во вдвое меньшем объёме. Поэтому в одной строке таблицы перевода стоят сначала 12,5 единицы, потом 5, потом 2,5: одна доза, три разведения, три разные отметки на цилиндре.",
        "Прежде чем верить любому числу единиц, посмотрите, какой шприц у вас в руке. Шприц U-100 размечен на 100 единиц в миллилитре, шприц U-40 — на 40 единиц в миллилитре, и те же 0,125 мл дадут на нём 5 единиц. Единица — это деление шкалы, напечатанной на цилиндре, а не постоянное количество.",
      ],
    },
    {
      id: "u100",
      heading: "Почему на шприце U-100 в миллилитре 100 единиц",
      lead: "U-100 — это стандарт концентрации инсулина: 100 международных единиц в миллилитре. Цилиндр размечен так, что 100 единиц занимают ровно 1 мл, а значит, одна единица — это 0,01 мл. Для разведённого пептида эта шкала ничего не говорит об инсулине: это просто точная линейка для сотых долей миллилитра.",
      body: [
        "Объём шприца и шкала единиц — разные вещи. Шприц U-100 на 0,3 мл размечен до 30 единиц, на 0,5 мл — до 50, на 1 мл — до 100, но единица во всех трёх равна 0,01 мл. Набор в 12,5 единицы поместится в любой из них; 60 единиц в первые два не войдут.",
        "Маленький цилиндр читается легче. На шприце объёмом 0,3 мл деления стоят дальше друг от друга, и 12,5 единицы отчётливо попадает между двумя штрихами, а не жмётся к ним. Если рассчитанный объём туда укладывается, маленький шприц обычно даёт более точный набор.",
        "Деления по половине единицы напечатаны не на каждом шприце. Некоторые цилиндры размечены только по целым единицам, и тогда 12,5 единицы приходится прикидывать между двумя штрихами или менять разведение так, чтобы число легло на напечатанную отметку. Посмотрите на свой шприц, прежде чем полагаться на точность, которую подразумевает калькулятор.",
      ],
    },
    {
      id: "water",
      heading: "Бактериостатическая вода или стерильная?",
      lead: "Бактериостатическая вода — это стерильная вода с 0,9 % бензилового спирта, консерванта, который сдерживает рост бактерий и позволяет прокалывать флакон не один раз. В стерильной воде консерванта нет, поэтому после прокола пробки она уже не защищает содержимое от загрязнения между двумя наборами.",
      body: [
        "На арифметику не влияет ни та, ни другая. 5 мл — это 5 мл, и флакон на 10 мг с любой из них даёт 2 мг/мл. Выбор влияет на то, как долго разведённый флакон останется пригодным и как его хранить, но не на объём, который вы набираете.",
        "Берите тот растворитель, который назван в инструкции к препарату. Для одних пептидов указана бактериостатическая вода, для других — стерильная, для третьих — совсем другой растворитель; сам бензиловый спирт и есть причина, по которой отдельные препараты никогда не разводят бактериостатической водой. Когда инструкция и сообщение на форуме расходятся, последнее слово за инструкцией.",
        "Вливайте воду медленно по внутренней стенке флакона, а не струёй на порошок, и дайте флакону постоять, пока раствор не станет прозрачным. Не встряхивайте флакон. Пептиды — хрупкие молекулы, и взбалтывание разрушает их, ничего не меняя в том, что считает калькулятор.",
      ],
    },
    {
      id: "mistakes",
      heading: "Частые ошибки в расчёте дозы пептида",
      lead: "Большинство ошибок в расчёте дозы пептида — ошибки единиц измерения, и они огромные: путаница микрограммов с миллиграммами сдвигает запятую на три знака, а шприц U-40, прочитанный как U-100, искажает объём в 2,5 раза. И то и другое даёт число, которое на цилиндре выглядит правдоподобно.",
      body: [
        "Следом идёт уверенность, что объём воды задан заранее. Стандартного количества бактериостатической воды для флакона на 10 мг не существует — 2 мл дают 5 мг/мл, а 5 мл дают 2 мг/мл, — поэтому число единиц, списанное с чужого флакона, на вашем окажется неверным. Пересчитайте по тому объёму, который вы действительно добавили.",
        "Взять старую цифру после смены разведения — та же ошибка, только медленнее. Если на прошлом флаконе 250 мкг давали 12,5 единицы, то на этом столько же получится только при той же концентрации. Пересчитывайте каждый раз, когда разводите новый флакон.",
        "Проверьте отдельно ещё две детали. Лиофилизированный порошок сам занимает немного объёма, поэтому итоговой жидкости может оказаться чуть больше, чем воды, которую вы влили, — калькулятор этого не учитывает. И пептид, маркированный в международных единицах, а не в миллиграммах, не подставить в расчёт по мг без коэффициента пересчёта именно для этого препарата.",
      ],
    },
    {
      id: "faq",
      heading: "Частые вопросы",
      lead: "Ниже собраны частые вопросы о разведении пептидов, объёме бактериостатической воды и единицах инсулинового шприца U-100. В каждом ответе работают те же два шага, что и в калькуляторе: массу пептида поделить на объём воды — получится концентрация, дозу поделить на эту концентрацию — получится объём.",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "Таблица разведения пептидов",
    headers: ["Количество пептида", "Добавлено бактериостатической воды", "Итоговая концентрация"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2,5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Доза в единицах инсулинового шприца",
    headers: ["Доза", "при 2 мг/мл", "при 5 мг/мл", "при 10 мг/мл"],
    rows: [
      ["250 mcg", "12,5 U", "5 U", "2,5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1 000 mcg", "50 U", "20 U", "10 U"],
      ["2 000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "Как рассчитать разведение пептида?",
      answer:
        "Поделите массу пептида на объём бактериостатической воды — получите концентрацию, затем поделите свою дозу на эту концентрацию — получите объём набора. Флакон на 10 мг с 5 мл воды даёт 2 мг/мл, поэтому доза 250 мкг — это 0,125 мл, то есть 12,5 единицы на шприце U-100.",
    },
    {
      question: "Сколько мл бактериостатической воды добавлять к пептиду?",
      answer:
        "Любой объём, который вмещает флакон: добавленное количество задаёт концентрацию, а не силу препарата. 2 мл во флакон на 10 мг дают 5 мг/мл, 5 мл дают 2 мг/мл. Чем больше объём, тем легче читать маленькие дозы на шприце. Следуйте объёму растворителя, указанному в инструкции к препарату.",
    },
    {
      question: "Сколько мл добавить, чтобы развести 10 мг?",
      answer:
        "Подходит любой объём примерно от 1 мл до вместимости флакона, и каждый даёт свою концентрацию: 1 мл — 10 мг/мл, 2 мл — 5 мг/мл, 5 мл — 2 мг/мл. Возьмите объём, названный в инструкции к препарату, и рассчитайте дозу исходя из получившейся концентрации.",
    },
    {
      question: "Как развести 30 мг пептида?",
      answer:
        "Влейте выбранный объём бактериостатической воды медленно по стенке флакона и дайте порошку раствориться без встряхивания. 3 мл во флакон на 30 мг дают 10 мг/мл, а 6 мл дают 5 мг/мл. Поделите 30 мг на добавленные миллилитры — получите концентрацию, затем переведите по ней свою дозу.",
    },
    {
      question: "Сколько воды на 10 мг пептида?",
      answer:
        "Объём воды выбираете вы, и он определяет концентрацию: 1 мл бактериостатической воды даёт 10 мг/мл, 2 мл — 5 мг/мл, 4 мл — 2,5 мг/мл, 5 мл — 2 мг/мл. Во всех четырёх случаях в растворе те же 10 мг пептида; меняется только объём, который вы набираете на дозу.",
    },
    {
      question: "Как вообще посчитать разведение?",
      answer:
        "В два действия. Сначала масса пептида, поделённая на объём воды, даёт концентрацию в мг/мл. Затем ваша доза, поделённая на эту концентрацию, даёт объём в мл. Умножьте этот объём на 100 — получите единицы на шприце U-100. Микрограммы переведите в миллиграммы заранее: 250 мкг — это 0,25 мг.",
    },
    {
      question: "Сколько единиц в 250 мкг на инсулиновом шприце?",
      answer:
        "Число единиц зависит от концентрации в вашем флаконе. На шприце U-100 250 мкг — это 12,5 единицы при 2 мг/мл, 5 единиц при 5 мг/мл и 2,5 единицы при 10 мг/мл. Для любого другого разведения поделите дозу в мкг на концентрацию в мг/мл, а результат — ещё на десять.",
    },
    {
      question: "Что означает U-100 на инсулиновом шприце?",
      answer:
        "U-100 означает, что цилиндр размечен под концентрацию 100 единиц в миллилитре: одна единица равна 0,01 мл, а 100 единиц заполняют 1 мл. Шприцы U-40 размечены иначе — 40 единиц в миллилитре. Объём, прочитанный не по той шкале, даёт ошибку в 2,5 раза.",
    },
  ],
  disclaimer:
    "Только инструмент перевода. Всегда проверяйте концентрацию, шкалу единиц вашего шприца и любое назначение у квалифицированного медицинского специалиста. Этот калькулятор не даёт медицинских рекомендаций.",
};

const zhCN: PeptidePageContent = {
  heroSubtitle: "填入西林瓶用量、你加入的抑菌水体积和目标剂量，得到精确的毫升数，并看到在 U-100 胰岛素注射器上该抽取至哪一格刻度。",
  sections: [
    {
      id: "how-to",
      heading: "多肽计算器怎么用",
      lead: "多肽计算器只要三个数字：西林瓶标签上的多肽毫克数、你加进去的抑菌水毫升数，以及你要抽取的剂量微克数。三个都填好，你就拿到对应的毫升体积，以及 U-100 胰岛素注射器上该抽取的那一格刻度。",
      body: [
        "先看西林瓶。标签写 10 mg 指的是干粉的质量，不是体积——没加液体之前没有什么可量。把 10 mg 填进西林瓶用量。",
        "接着填抑菌水。这是你推进瓶里的体积，在西林瓶容量之内由你定：10 mg 的瓶加 5 mL 水，浓度就是 2 mg/mL。水少，溶液更浓，每次抽的体积更小；水多，溶液更稀，体积更大也更好量。",
        "剂量最后填，写成 mcg，照处方或产品标签上的数字填。计算器不评判这个数字，它只做换算。2 mg/mL 下的 250 mcg 剂量是 0.125 mL，在 U-100 注射器上是 12.5 单位，一瓶 10 mg 的多肽装得下 40 剂。",
        "抽之前先看注射器示意图。单位数是你对齐活塞的那一格；毫升数是同一个量，换成结核菌素注射器针筒上印的那种单位。两个数字说的是同一个体积。",
      ],
    },
    {
      id: "formula",
      heading: "多肽复溶公式详解",
      lead: "多肽复溶只有两次除法：浓度等于多肽质量除以加水体积，剂量体积等于剂量除以浓度。10 mg 的西林瓶用 5 mL 抑菌水复溶得到 2 mg/mL，所以 250 mcg 的剂量占 0.125 mL。",
      body: [
        "除之前先把质量统一成一个单位，不然整个算式就全错了。微克和毫克差 1000 倍：250 mcg 是 0.25 mg，1000 mcg 是 1 mg。两者混用一次，抽出来的体积就差 1000 倍。",
        "把这个例子一步步走完。10 mg 多肽除以 5 mL 水是 2 mg/mL。250 mcg 剂量是 0.25 mg。0.25 mg 除以 2 mg/mL 是 0.125 mL。这个毫升数就是答案，后面所有换算只是换刻度，不是换量。",
        "每瓶剂量数出自同样两个数：总多肽量除以单次剂量。10 mg 是 10000 mcg，10000 除以 250 得 40 剂。这个数字顺手能当校验用——如果计算器说 10 mg 的瓶只有三剂 250 mcg，你填的数里有一项错了。",
      ],
    },
    {
      id: "chart",
      heading: "多肽复溶对照表",
      lead: "多肽复溶对照表的每一行都是算术，不是推荐用量：一行把一个多肽质量和一个抑菌水体积配在一起，给出得到的浓度。10 mg 配 2 mL 得 5 mg/mL，同样的 10 mg 配 5 mL 得 2 mg/mL。加水从来不改变瓶里的多肽质量。",
      body: [
        "按你想量的体积挑一行，不要挑那个看起来最整的数字。浓度高，每次注射的液体少，瓶里搁着的水也少；浓度低，同一个剂量摊在更多格刻度上，小剂量更容易读准。",
        "这张表里没有任何一行告诉你该用多少多肽。每一行混合前后的总质量都一样——加水改变的是浓度和你抽取的体积，不是瓶里多肽的量。剂量来自给你开药的医生或产品标签，表只告诉你某个配比算出来是多少。",
      ],
    },
    {
      id: "conversion",
      heading: "微克换算胰岛素注射器单位",
      lead: "微克换算成胰岛素注射器单位只用一个式子：单位数等于剂量微克数除以浓度 mg/mL 的十倍。2 mg/mL 下，250 mcg 剂量是 250 除以 20，等于 12.5 单位。同一个剂量在 10 mg/mL 下是 2.5 单位。",
      body: [
        "那个十倍来自注射器，不来自多肽。U-100 注射器上一个单位是 0.01 mL，所以 0.125 mL 就是 12.5 单位。把毫升数乘 100，跟上面那个式子一样可靠。",
        "浓度和单位反着走。浓度翻倍，单位数减半，因为同样质量的多肽挤进了一半的液体里。所以换算表的一行里会依次出现 12.5、5 和 2.5 单位：一个剂量，三种配比，针筒上三个不同的位置。",
        "在相信任何单位数之前，先确认手里是哪种注射器。U-100 注射器一毫升是 100 单位；U-40 注射器一毫升是 40 单位，同样的 0.125 mL 在它上面是 5 单位。一个单位是针筒上那套刻度里的一格，不是一个固定的量。",
      ],
    },
    {
      id: "u100",
      heading: "U-100 注射器为什么一毫升是 100 单位",
      lead: "U-100 是胰岛素的浓度标准：每毫升 100 国际单位。针筒照这个标准印刻度，100 单位刚好填满 1 mL，一个单位就是 0.01 mL。用在复溶好的多肽上，这套刻度和胰岛素没有任何关系，它只是一把量百分之一毫升的细尺。",
      body: [
        "注射器容量和单位刻度是两件事。0.3 mL 的 U-100 注射器印到 30 单位，0.5 mL 的印到 50，1 mL 的印到 100，但三支上的一个单位都是 0.01 mL。12.5 单位三支都装得下，60 单位前两支装不下。",
        "针筒越小越好读。0.3 mL 的注射器上刻度隔得更开，12.5 单位清楚地落在两格之间，不会挤在一起。算出来的体积装得下时，小注射器抽得更准。",
        "半单位的刻度不是每支都印。有些针筒只印整单位，这时 12.5 单位得在两格之间估，或者改配比让数字正好落在印出来的线上。先看你自己那支注射器，再决定要不要相信计算器暗示的精度。",
      ],
    },
    {
      id: "water",
      heading: "抑菌水和无菌水的区别",
      lead: "抑菌水是含 0.9% 苯甲醇的无菌水，苯甲醇是防腐剂，能抑制细菌生长，让一支西林瓶可以反复穿刺取用。无菌水里没有防腐剂，胶塞被刺破之后，它挡不住两次抽取之间的污染。",
      body: [
        "两种水都不改变算术。5 mL 就是 5 mL，10 mg 的瓶用哪一种复溶都是 2 mg/mL。选哪种影响的是复溶后能放多久、怎么存，不是你抽出来的体积。",
        "按产品标签指定的溶剂来。有些多肽写明用抑菌水，有些写无菌水，有些用完全不同的溶剂；苯甲醇本身就是某些产品绝对不能用抑菌水复溶的原因。标签和论坛帖子说的不一样时，听标签的。",
        "加水时沿瓶内壁慢慢流下去，别直接冲在粉上，然后让瓶子静置到溶液变清。不要摇。多肽是脆弱的分子，晃动会把它降解掉，而计算器量的那些数字一个都不会变。",
      ],
    },
    {
      id: "mistakes",
      heading: "多肽剂量计算的常见错误",
      lead: "多肽剂量算错，多数是单位错，而且错得很大：微克和毫克搞混，小数点挪了三位，结果差 1000 倍；把 U-40 注射器当成 U-100 来读，体积差 2.5 倍。算出来的数字在针筒上都像个正常数字。",
      body: [
        "另一个常见错误是以为加水量是固定的。10 mg 的西林瓶没有标准加水量——2 mL 得 5 mg/mL，5 mL 得 2 mg/mL——所以从别人瓶子上抄来的单位数，在你的瓶上是错的。按你实际加进去的体积重算。",
        "换了配比还沿用旧数字，本质上是同一个错误，只是不容易当场发现。上一瓶 250 mcg 是 12.5 单位，这一瓶也是 12.5 单位，只在浓度完全相同时成立。每复溶一瓶就重算一次。",
        "还有两个小问题值得查一下。冻干粉自己也占一点体积，最后的液体可能比你加进去的水略多一些，而计算器假设它不占；还有，用国际单位而不是毫克标注的多肽，没有那个产品专用的换算系数，填不进按 mg 算的计算器。",
      ],
    },
    {
      id: "faq",
      heading: "常见问题",
      lead: "关于多肽复溶、抑菌水加多少以及胰岛素注射器单位的常见问题，下面逐条回答。每个回答走的都是计算器的那两步：多肽质量除以加水体积得到浓度，剂量除以浓度得到体积。",
      body: [],
    },
  ],
  reconstitutionTable: {
    caption: "多肽复溶对照表",
    headers: ["多肽用量", "加入的抑菌水", "最终浓度"],
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
    caption: "剂量对应的胰岛素注射器单位",
    headers: ["剂量", "2 mg/mL 时", "5 mg/mL 时", "10 mg/mL 时"],
    rows: [
      ["250 mcg", "12.5 U", "5 U", "2.5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1000 mcg", "50 U", "20 U", "10 U"],
      ["2000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    {
      question: "多肽复溶怎么算？",
      answer:
        "把多肽质量除以抑菌水体积得到浓度，再把你的剂量除以这个浓度，得到要抽取的体积。10 mg 的西林瓶加 5 mL 水是 2 mg/mL，所以 250 mcg 的剂量是 0.125 mL，在 U-100 注射器上是 12.5 单位。",
    },
    {
      question: "多肽要加多少 mL 抑菌水？",
      answer:
        "西林瓶装得下的任何体积都可以——加多少定的是浓度，不是药效。10 mg 的瓶加 2 mL 得 5 mg/mL，加 5 mL 得 2 mg/mL。体积大一些，小剂量在注射器上更好读。加水量按产品标签写的溶剂体积来。",
    },
    {
      question: "10 mg 的多肽用多少 mL 复溶？",
      answer:
        "大约 1 mL 到西林瓶容量之间的任何体积都行，每一种得到的浓度不同：1 mL 得 10 mg/mL，2 mL 得 5 mg/mL，5 mL 得 2 mg/mL。挑产品标签上写的那个体积，再拿你的剂量对着算出来的浓度换算。",
    },
    {
      question: "30 mg 的多肽怎么复溶？",
      answer:
        "把你定好体积的抑菌水沿瓶壁慢慢加进去，让它自己溶开，不要摇。30 mg 的瓶加 3 mL 得 10 mg/mL，加 6 mL 得 5 mg/mL。用 30 mg 除以你加进去的毫升数得到浓度，再拿剂量对着它换算。",
    },
    {
      question: "10 mg 多肽加多少水？",
      answer:
        "加水量由你定，它决定浓度：1 mL 抑菌水得 10 mg/mL，2 mL 得 5 mg/mL，4 mL 得 2.5 mg/mL，5 mL 得 2 mg/mL。四种里装的都是同样的 10 mg 多肽，变的只是你每次抽取的体积。",
    },
    {
      question: "复溶的量怎么推算？",
      answer:
        "两次除法。第一次，多肽质量除以加水体积，得到 mg/mL 的浓度。第二次，你的剂量除以这个浓度，得到 mL 的体积。把体积乘 100，就是 U-100 注射器上的单位数。微克先换成毫克：250 mcg 是 0.25 mg。",
    },
    {
      question: "250 mcg 在胰岛素注射器上是多少单位？",
      answer:
        "看你瓶里的浓度。在 U-100 注射器上，250 mcg 在 2 mg/mL 下是 12.5 单位，在 5 mg/mL 下是 5 单位，在 10 mg/mL 下是 2.5 单位。换成别的配比，把剂量微克数除以浓度 mg/mL 的十倍就得到单位数。",
    },
    {
      question: "胰岛素注射器上的 U-100 是什么意思？",
      answer:
        "U-100 指的是针筒按每毫升 100 单位的浓度印刻度，所以一个单位是 0.01 mL，100 单位填满 1 mL。U-40 注射器印的是每毫升 40 单位。用错的那套刻度读体积，会差 2.5 倍。",
    },
  ],
  disclaimer: "仅为换算工具。浓度、注射器的单位刻度以及任何处方，都请向有资质的医疗专业人员核实。本计算器不提供医疗意见。",
};

export const PEPTIDE_CALCULATOR_CONTENT: Record<Locale, PeptidePageContent> = { en, es, fr, pt, ru, "zh-CN": zhCN };

/** Repli utilisé tant qu'une locale n'a pas son contenu rédigé. */
export const PEPTIDE_CALCULATOR_CONTENT_FALLBACK = en;
