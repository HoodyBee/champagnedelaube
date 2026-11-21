// Textes des pages cépages, rédigés dans le dépôt (sources : docs/cepages-sources.md).
// Tant qu'une fiche « Cépage » n'est pas remplie dans le Studio, les pages affichent ces textes ;
// la photo, elle, vient toujours de la fiche Sanity (document « cepage-<clé> ») quand elle existe.
// Règle : uniquement des faits recoupés par deux sources ; une partie sans source n'est pas écrite.
import type { CepageKey, TerroirKey } from "./brand";
import type { T } from "./terroirs-contenu";

export type SectionCepage = "part" | "aube" | "apport" | "culture" | "histoire";

export type CepageContenu = {
  cle: CepageKey;
  /** principal : cépage principal de l'AOC ; vifa : « variété d'intérêt à fin d'adaptation ». */
  statut: "principal" | "vifa";
  /** Groupe sur la page générale. */
  groupe: "grands" | "rares" | "nouveaux";
  couleur: T;
  /** Deux lignes maximum, pour la page générale. */
  resume: T;
  accroche: T;
  motCle: string;
  seo: { title: T; description: T };
  sections: { id: SectionCepage; titre: T; paragraphes: T[] }[];
  terroirs: TerroirKey[];
  /** Anciens noms ou noms locaux. */
  aussiAppele?: T;
};

const noir: T = { fr: "Raisin noir", en: "Black grape" };
const blanc: T = { fr: "Raisin blanc", en: "White grape" };

export const cepagesContenu: Record<CepageKey, CepageContenu> = {
  "pinot-noir": {
    cle: "pinot-noir",
    statut: "principal",
    groupe: "grands",
    couleur: noir,
    motCle: "pinot noir champagne",
    resume: {
      fr: "Le premier cépage de la Champagne et le roi de la Côte des Bar. Il donne au champagne sa structure.",
      en: "Champagne's leading grape and king of the Côte des Bar. It gives champagne its structure.",
    },
    accroche: {
      fr: "Un raisin noir qui fait des vins blancs, et le cépage qui façonne le paysage de la Côte des Bar.",
      en: "A black grape that makes white wines, and the grape that shapes the landscape of the Côte des Bar.",
    },
    seo: {
      title: { fr: "Pinot noir : le grand cépage noir de la Côte des Bar", en: "Pinot noir: the great black grape of the Côte des Bar" },
      description: {
        fr: "Le pinot noir, premier cépage champenois et très largement majoritaire dans la Côte des Bar : ce qu'il apporte, où il pousse dans l'Aube, le rosé des Riceys.",
        en: "Pinot noir, Champagne's leading grape and by far the main one in the Côte des Bar: what it brings, where it grows in the Aube, Rosé des Riceys.",
      },
    },
    terroirs: ["cote-des-bar", "les-riceys"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation et dans l'Aube", en: "Its place in the appellation and in the Aube" },
        paragraphes: [
          {
            fr: "Avec le meunier et le chardonnay, le pinot noir couvre la quasi-totalité du vignoble champenois, et il arrive en tête. Les pourcentages exacts varient selon les sources : nous ne les citons pas.",
            en: "With meunier and chardonnay, pinot noir covers almost the entire Champagne vineyard, and it comes first. Exact percentages vary between sources, so we do not quote them.",
          },
          {
            fr: "Dans la Côte des Bar, au sud de l'Aube, il est très largement majoritaire : plus de huit vignes sur dix.",
            en: "In the Côte des Bar, in the south of the Aube, it is by far the main grape: more than eight vines in ten.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "Dans la [Côte des Bar](/la-cote-des-bar), autour de Bar-sur-Seine et de Bar-sur-Aube, sur des coteaux de marnes et de calcaires du Kimméridgien, les mêmes qu'à Chablis.",
            en: "In the [Côte des Bar](/la-cote-des-bar), around Bar-sur-Seine and Bar-sur-Aube, on slopes of Kimmeridgian marl and limestone, the same as in Chablis.",
          },
          {
            fr: "Aux [Riceys](/les-riceys), il est aussi très largement majoritaire. C'est la seule commune de Champagne à produire trois appellations : Champagne, Coteaux champenois et Rosé des Riceys.",
            en: "In [Les Riceys](/les-riceys), it is also by far the main grape. It is the only village in Champagne to produce three appellations: Champagne, Coteaux Champenois and Rosé des Riceys.",
          },
        ],
      },
      {
        id: "apport",
        titre: { fr: "Ce qu'il apporte au champagne", en: "What it brings to champagne" },
        paragraphes: [
          {
            fr: "Dans l'assemblage, on lui attribue la structure : il donne au vin sa charpente et de l'ampleur.",
            en: "In a blend, it is credited with structure: it gives the wine its backbone and body.",
          },
          {
            fr: "La couleur d'un raisin noir est dans sa peau ; sa pulpe est incolore. Pressé rapidement et délicatement, le pinot noir donne un jus blanc. C'est ainsi que naît le blanc de noirs, un champagne issu uniquement de raisins noirs, auquel on associe en général plus d'ampleur et des notes de fruits rouges.",
            en: "A black grape's colour lies in its skin; its pulp is colourless. Pressed quickly and gently, pinot noir gives a white juice. That is how blanc de noirs is born: a champagne made only from black grapes, generally associated with more body and red-fruit notes.",
          },
        ],
      },
      {
        id: "culture",
        titre: { fr: "À la vigne", en: "In the vineyard" },
        paragraphes: [
          {
            fr: "Au printemps, ses bourgeons s'ouvrent avant ceux du meunier : il est donc un peu plus exposé aux gelées de printemps.",
            en: "In spring, its buds open before those of meunier, so it is slightly more exposed to spring frosts.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Un peu d'histoire", en: "A little history" },
        paragraphes: [
          {
            fr: "Aux Riceys, le pinot noir donne depuis longtemps un vin tranquille rare : le Rosé des Riceys, appellation d'origine contrôlée depuis un décret du 8 décembre 1947, issu uniquement de pinot noir récolté sur la commune.",
            en: "In Les Riceys, pinot noir has long made a rare still wine: Rosé des Riceys, a protected designation of origin since a decree of 8 December 1947, made solely from pinot noir harvested in the village.",
          },
        ],
      },
    ],
  },

  chardonnay: {
    cle: "chardonnay",
    statut: "principal",
    groupe: "grands",
    couleur: blanc,
    motCle: "chardonnay champagne",
    resume: {
      fr: "Le seul grand cépage blanc de la Champagne. Finesse et fraîcheur, à Montgueux et à Villenauxe-la-Grande.",
      en: "Champagne's only major white grape. Finesse and freshness, in Montgueux and Villenauxe-la-Grande.",
    },
    accroche: {
      fr: "Le cépage du blanc de blancs, qui trouve dans l'Aube deux terroirs à sa mesure.",
      en: "The grape of blanc de blancs, which finds two terroirs of its own in the Aube.",
    },
    seo: {
      title: { fr: "Chardonnay : finesse et fraîcheur, de Montgueux à Villenauxe", en: "Chardonnay: finesse and freshness, Montgueux to Villenauxe" },
      description: {
        fr: "Le chardonnay, seul grand cépage blanc de la Champagne : ce qu'il apporte, le blanc de blancs, ses terroirs dans l'Aube (Montgueux, Villenauxe-la-Grande).",
        en: "Chardonnay, Champagne's only major white grape: what it brings, blanc de blancs, its terroirs in the Aube (Montgueux, Villenauxe-la-Grande).",
      },
    },
    terroirs: ["montgueux", "villenauxe"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation et dans l'Aube", en: "Its place in the appellation and in the Aube" },
        paragraphes: [
          {
            fr: "Des trois grands cépages qui couvrent la quasi-totalité du vignoble champenois, le chardonnay est le seul blanc. Il occupe une surface proche de celle du meunier, derrière le pinot noir.",
            en: "Of the three major grapes that cover almost the entire Champagne vineyard, chardonnay is the only white one. It covers an area close to that of meunier, behind pinot noir.",
          },
          {
            fr: "Dans l'Aube, il est très majoritaire sur la colline de Montgueux et majoritaire à Villenauxe-la-Grande.",
            en: "In the Aube, it is by far the main grape on the hill of Montgueux and the majority grape in Villenauxe-la-Grande.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "À [Montgueux](/montgueux), à une dizaine de kilomètres de Troyes, sur une colline de craie du Turonien exposée au sud et au sud-est.",
            en: "In [Montgueux](/montgueux), about ten kilometres from Troyes, on a hill of Turonian chalk facing south and south-east.",
          },
          {
            fr: "À [Villenauxe-la-Grande](/villenauxe-la-grande), dans la vallée de la Noxe, au nord-ouest du département, avec un peu de pinot noir.",
            en: "In [Villenauxe-la-Grande](/villenauxe-la-grande), in the Noxe valley, in the north-west of the department, alongside a little pinot noir.",
          },
        ],
      },
      {
        id: "apport",
        titre: { fr: "Ce qu'il apporte au champagne", en: "What it brings to champagne" },
        paragraphes: [
          {
            fr: "Dans l'assemblage, on lui attribue la finesse et la fraîcheur. À Montgueux, on cite souvent des arômes d'agrumes et de fruits exotiques.",
            en: "In a blend, it is credited with finesse and freshness. In Montgueux, citrus and exotic-fruit aromas are often mentioned.",
          },
          {
            fr: "Un champagne blanc de blancs est élaboré uniquement à partir de cépages blancs, le plus souvent du chardonnay.",
            en: "A blanc de blancs champagne is made only from white grapes, most often chardonnay.",
          },
        ],
      },
      {
        id: "culture",
        titre: { fr: "À la vigne", en: "In the vineyard" },
        paragraphes: [
          {
            fr: "Comme le pinot noir, il débourre avant le meunier : ses jeunes pousses sont un peu plus exposées aux gelées de printemps.",
            en: "Like pinot noir, it buds before meunier, so its young shoots are slightly more exposed to spring frosts.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Un peu d'histoire", en: "A little history" },
        paragraphes: [
          {
            fr: "Montgueux est entré dans l'appellation Champagne en 1927. À la fin du XIXe siècle, des plants de chardonnay de la colline sont partis jusqu'au Japon.",
            en: "Montgueux joined the Champagne appellation in 1927. At the end of the 19th century, chardonnay plants from the hill travelled as far as Japan.",
          },
        ],
      },
    ],
  },

  meunier: {
    cle: "meunier",
    statut: "principal",
    groupe: "grands",
    couleur: noir,
    motCle: "meunier champagne",
    aussiAppele: { fr: "Longtemps appelé « pinot meunier »", en: "Long known as “pinot meunier”" },
    resume: {
      fr: "Le troisième grand cépage champenois, plus discret dans l'Aube. Il apporte rondeur et fruit.",
      en: "The third great Champagne grape, more discreet in the Aube. It brings roundness and fruit.",
    },
    accroche: {
      fr: "Un nom venu de la farine, un cépage robuste, et le fruit dans l'assemblage.",
      en: "A name that comes from flour, a hardy grape, and fruit in the blend.",
    },
    seo: {
      title: { fr: "Meunier : le cépage champenois du fruit et de la rondeur", en: "Meunier: the Champagne grape of fruit and roundness" },
      description: {
        fr: "Le meunier, l'un des trois grands cépages de la Champagne : d'où vient son nom, ce qu'il apporte au champagne, pourquoi il craint moins les gelées.",
        en: "Meunier, one of Champagne's three great grapes: where its name comes from, what it brings to champagne, and why it is less exposed to spring frosts.",
      },
    },
    terroirs: ["montgueux"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation et dans l'Aube", en: "Its place in the appellation and in the Aube" },
        paragraphes: [
          {
            fr: "Avec le pinot noir et le chardonnay, il forme le trio qui couvre la quasi-totalité du vignoble champenois. Le meunier et le chardonnay occupent des surfaces proches, derrière le pinot noir.",
            en: "With pinot noir and chardonnay, it forms the trio that covers almost the entire Champagne vineyard. Meunier and chardonnay cover similar areas, behind pinot noir.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "Dans l'Aube, il reste minoritaire face au pinot noir et au chardonnay. On en trouve par exemple un peu à [Montgueux](/montgueux), à côté du chardonnay et du pinot noir.",
            en: "In the Aube, it remains a minority grape next to pinot noir and chardonnay. A little is grown, for example, in [Montgueux](/montgueux), alongside chardonnay and pinot noir.",
          },
        ],
      },
      {
        id: "apport",
        titre: { fr: "Ce qu'il apporte au champagne", en: "What it brings to champagne" },
        paragraphes: [
          {
            fr: "Dans l'assemblage, on lui attribue la rondeur et le fruit : il donne de la souplesse au vin. C'est un raisin noir : comme le pinot noir, il peut entrer dans un blanc de noirs, seul ou avec lui.",
            en: "In a blend, it is credited with roundness and fruit: it gives the wine suppleness. It is a black grape: like pinot noir, it can go into a blanc de noirs, alone or with it.",
          },
        ],
      },
      {
        id: "culture",
        titre: { fr: "À la vigne", en: "In the vineyard" },
        paragraphes: [
          {
            fr: "Le meunier débourre plus tard que le pinot noir et le chardonnay : ses bourgeons s'ouvrent après les leurs. Il est donc un peu moins exposé aux gelées de printemps, un atout dans un vignoble aussi septentrional.",
            en: "Meunier buds later than pinot noir and chardonnay: its buds open after theirs. It is therefore slightly less exposed to spring frosts, an asset in such a northerly vineyard.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Un nom venu de la farine", en: "A name that comes from flour" },
        paragraphes: [
          {
            fr: "Le dessous de ses feuilles est couvert d'un fin duvet blanc, comme saupoudré de farine : c'est de là que vient son nom. Longtemps appelé « pinot meunier », on le nomme aujourd'hui le plus souvent simplement « meunier ».",
            en: "The underside of its leaves is covered with a fine white down, as if dusted with flour: that is where its name comes from. Long called “pinot meunier”, it is now usually simply called “meunier”.",
          },
        ],
      },
    ],
  },

  "pinot-blanc": {
    cle: "pinot-blanc",
    statut: "principal",
    groupe: "rares",
    couleur: blanc,
    motCle: "pinot blanc champagne",
    aussiAppele: { fr: "« Blanc vrai » dans l'Aube", en: "“Blanc vrai” in the Aube" },
    resume: {
      fr: "Autorisé en Champagne mais rarement planté. Il garde quelques fidèles dans la Côte des Bar.",
      en: "Permitted in Champagne but rarely planted. It keeps a few loyal growers in the Côte des Bar.",
    },
    accroche: { fr: "Un cépage ancien et discret, qu'on appelle parfois « blanc vrai » dans l'Aube.", en: "A discreet old grape, sometimes called “blanc vrai” in the Aube." },
    seo: {
      title: { fr: "Pinot blanc ou « blanc vrai » : un cépage rare de l'Aube", en: "Pinot blanc or “blanc vrai”: a rare grape of the Aube" },
      description: {
        fr: "Le pinot blanc, cépage autorisé en Champagne mais rarement planté, appelé « blanc vrai » dans l'Aube et encore cultivé dans la Côte des Bar.",
        en: "Pinot blanc, a grape permitted in Champagne but rarely planted, known as “blanc vrai” in the Aube and still grown by a few winemakers in the Côte des Bar.",
      },
    },
    terroirs: ["cote-des-bar", "villenauxe"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation", en: "Its place in the appellation" },
        paragraphes: [
          {
            fr: "Le pinot blanc fait partie des cépages principaux du cahier des charges de l'appellation Champagne. Avec les autres cépages rares, il n'occupe qu'une toute petite place dans le vignoble ; les chiffres publiés divergent trop pour être cités.",
            en: "Pinot blanc is one of the main grapes listed in the Champagne appellation rules. Together with the other rare grapes, it takes up only a tiny share of the vineyard; published figures differ too much to be quoted.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "La [Côte des Bar](/la-cote-des-bar) garde l'essentiel des cépages rares de la Champagne. Certains domaines, comme à Polisy, cultivent le pinot blanc aux côtés des grands cépages. On en trouve aussi chez quelques vignerons de [Villenauxe-la-Grande](/villenauxe-la-grande).",
            en: "The [Côte des Bar](/la-cote-des-bar) holds most of Champagne's rare grapes. Some estates, for example in Polisy, grow pinot blanc alongside the major grapes. A few winemakers in [Villenauxe-la-Grande](/villenauxe-la-grande) grow it too.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Un peu d'histoire", en: "A little history" },
        paragraphes: [
          {
            fr: "Comme les autres cépages anciens, il a été délaissé au profit des trois grands cépages. Des vignerons de la Côte des Bar, notamment à Buxeuil et à Urville, ont contribué à préserver ces variétés.",
            en: "Like the other old grapes, it was abandoned in favour of the three major varieties. Côte des Bar winemakers, notably in Buxeuil and Urville, helped preserve these varieties.",
          },
        ],
      },
    ],
  },

  "pinot-gris": {
    cle: "pinot-gris",
    statut: "principal",
    groupe: "rares",
    couleur: { fr: "Raisin gris", en: "Grey grape" },
    motCle: "pinot gris champagne",
    aussiAppele: { fr: "« Fromenteau » en Champagne", en: "“Fromenteau” in Champagne" },
    resume: {
      fr: "Connu en Champagne sous un nom ancien, le fromenteau. Un cépage rare, remis à l'honneur dans la Côte des Bar.",
      en: "Known in Champagne by an old name, fromenteau. A rare grape, revived in the Côte des Bar.",
    },
    accroche: { fr: "En Champagne, le pinot gris porte un nom ancien : le fromenteau.", en: "In Champagne, pinot gris goes by an old name: fromenteau." },
    seo: {
      title: { fr: "Pinot gris ou fromenteau : un cépage rare du champagne", en: "Pinot gris or fromenteau: a rare grape of Champagne" },
      description: {
        fr: "Le pinot gris, appelé fromenteau en Champagne : un cépage rare de l'appellation, son histoire et sa place, replanté par des vignerons de la Côte des Bar.",
        en: "Pinot gris, known as fromenteau in Champagne: a rare grape of the appellation, its history and its place today, replanted by Côte des Bar winemakers.",
      },
    },
    terroirs: ["cote-des-bar"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation", en: "Its place in the appellation" },
        paragraphes: [
          {
            fr: "Le pinot gris fait partie des cépages principaux du cahier des charges de l'appellation Champagne. C'est l'un des cépages rares : il n'occupe qu'une toute petite place dans le vignoble.",
            en: "Pinot gris is one of the main grapes listed in the Champagne appellation rules. It is one of the rare grapes, with only a tiny share of the vineyard.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "Dans la [Côte des Bar](/la-cote-des-bar), des vignerons, notamment à Urville, l'ont replanté et en tirent des cuvées confidentielles.",
            en: "In the [Côte des Bar](/la-cote-des-bar), winemakers, notably in Urville, have replanted it and make small-production cuvées from it.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Un nom champenois", en: "A Champagne name" },
        paragraphes: [
          {
            fr: "Dans la région, on le connaît sous un nom plus ancien : le fromenteau. Comme l'arbane ou le petit meslier, il a failli disparaître du vignoble.",
            en: "In the region, it is known by an older name: fromenteau. Like arbane or petit meslier, it nearly disappeared from the vineyard.",
          },
        ],
      },
    ],
  },

  arbane: {
    cle: "arbane",
    statut: "principal",
    groupe: "rares",
    couleur: blanc,
    motCle: "arbane champagne",
    resume: {
      fr: "Le plus rare des cépages champenois. Difficile à cultiver, sensible au gel, il survit surtout dans l'Aube.",
      en: "The rarest Champagne grape. Hard to grow and frost-sensitive, it survives mostly in the Aube.",
    },
    accroche: { fr: "Difficile, sensible au gel, presque disparu : l'arbane doit sa survie à quelques vignerons de l'Aube.", en: "Difficult, frost-sensitive, almost gone: arbane owes its survival to a few Aube winemakers." },
    seo: {
      title: { fr: "Arbane : le plus rare des cépages du champagne, dans l'Aube", en: "Arbane: the rarest champagne grape, found in the Aube" },
      description: {
        fr: "L'arbane, cépage blanc autorisé en Champagne, difficile à cultiver et sensible au gel, dont les dernières vignes se trouvent surtout dans l'Aube.",
        en: "Arbane, a white grape permitted in Champagne, hard to grow and sensitive to frost, whose last vines are mostly found in the Aube. Its history and character.",
      },
    },
    terroirs: ["cote-des-bar"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation", en: "Its place in the appellation" },
        paragraphes: [
          {
            fr: "L'arbane fait partie des cépages principaux du cahier des charges de l'appellation Champagne. C'est l'un des plus rares de la région : les surfaces publiées divergent, nous ne les citons pas.",
            en: "Arbane is one of the main grapes listed in the Champagne appellation rules. It is one of the region's rarest; published areas differ, so we do not quote them.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "Ses dernières vignes se trouvent surtout dans l'Aube, à Buxeuil comme autour de Bar-sur-Aube, dans la [Côte des Bar](/la-cote-des-bar).",
            en: "Its last vines are mostly in the Aube, in Buxeuil and around Bar-sur-Aube, in the [Côte des Bar](/la-cote-des-bar).",
          },
        ],
      },
      {
        id: "culture",
        titre: { fr: "À la vigne", en: "In the vineyard" },
        paragraphes: [
          {
            fr: "C'est un cépage difficile à cultiver et sensible au gel. Ces défauts expliquent qu'il ait été délaissé au profit des grands cépages.",
            en: "It is a difficult grape to grow and sensitive to frost. These drawbacks explain why it was abandoned in favour of the major grapes.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Une histoire auboise", en: "An Aube story" },
        paragraphes: [
          {
            fr: "Des vignerons de la Côte des Bar l'ont préservé et l'assemblent parfois avec les autres cépages anciens.",
            en: "Côte des Bar winemakers have preserved it and sometimes blend it with the other old grapes.",
          },
        ],
      },
    ],
  },

  "petit-meslier": {
    cle: "petit-meslier",
    statut: "principal",
    groupe: "rares",
    couleur: blanc,
    motCle: "petit meslier champagne",
    resume: {
      fr: "Né d'un croisement ancien entre gouais et savagnin. Un cépage rare, apprécié pour sa fraîcheur.",
      en: "Born of an old cross between gouais and savagnin. A rare grape, prized for its freshness.",
    },
    accroche: { fr: "Un cépage ancien, apprécié pour sa fraîcheur et ses notes citronnées.", en: "An old grape, prized for its freshness and lemony notes." },
    seo: {
      title: { fr: "Petit meslier : cépage rare du champagne, plein de vivacité", en: "Petit meslier: a rare champagne grape prized for freshness" },
      description: {
        fr: "Le petit meslier, croisement de gouais et de savagnin : un cépage rare du champagne, apprécié pour sa fraîcheur et présent surtout dans l'Aube.",
        en: "Petit meslier, a cross of gouais and savagnin: a rare champagne grape, prized for its freshness and found mostly in the Aube. Its history and character.",
      },
    },
    terroirs: ["cote-des-bar", "villenauxe"],
    sections: [
      {
        id: "part",
        titre: { fr: "Sa place dans l'appellation", en: "Its place in the appellation" },
        paragraphes: [
          {
            fr: "Le petit meslier fait partie des cépages principaux du cahier des charges de l'appellation Champagne. C'est l'un des cépages rares : il n'occupe qu'une toute petite place dans le vignoble.",
            en: "Petit meslier is one of the main grapes listed in the Champagne appellation rules. It is one of the rare grapes, with only a tiny share of the vineyard.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Où il pousse dans l'Aube", en: "Where it grows in the Aube" },
        paragraphes: [
          {
            fr: "On le trouve surtout dans l'Aube, en particulier dans la [Côte des Bar](/la-cote-des-bar), et chez quelques vignerons de [Villenauxe-la-Grande](/villenauxe-la-grande). Hors de l'Aube, il est aussi présent dans la vallée de la Marne.",
            en: "It is found mostly in the Aube, especially in the [Côte des Bar](/la-cote-des-bar), and with a few winemakers in [Villenauxe-la-Grande](/villenauxe-la-grande). Outside the Aube, it also grows in the Marne valley.",
          },
        ],
      },
      {
        id: "apport",
        titre: { fr: "Ce qu'il apporte au champagne", en: "What it brings to champagne" },
        paragraphes: [
          {
            fr: "Les vignerons qui le cultivent l'apprécient pour sa fraîcheur et ses notes citronnées.",
            en: "The winemakers who grow it value it for its freshness and lemony notes.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Une origine ancienne", en: "An old origin" },
        paragraphes: [
          {
            fr: "Le petit meslier est issu d'un croisement entre deux très vieux cépages, le gouais et le savagnin.",
            en: "Petit meslier comes from a cross between two very old grapes, gouais and savagnin.",
          },
        ],
      },
    ],
  },

  "chardonnay-rose": {
    cle: "chardonnay-rose",
    statut: "principal",
    groupe: "nouveaux",
    couleur: { fr: "Raisin rose", en: "Pink grape" },
    motCle: "chardonnay rose champagne",
    resume: {
      fr: "Mutation naturelle du chardonnay, à la peau rosée. Inscrit parmi les cépages du champagne en 2025.",
      en: "A natural mutation of chardonnay with pinkish skin. Added to the champagne grapes in 2025.",
    },
    accroche: { fr: "Un cépage oublié qui retrouve sa place dans l'appellation.", en: "A forgotten grape that regains its place in the appellation." },
    seo: {
      title: { fr: "Chardonnay rose : le cépage entré dans l'AOC en 2025", en: "Chardonnay rose: the grape added to the AOC in 2025" },
      description: {
        fr: "Le chardonnay rose, mutation naturelle du chardonnay, inscrit au cahier des charges de l'appellation Champagne par un arrêté du 31 juillet 2025.",
        en: "Chardonnay rose, a natural mutation of chardonnay with pinkish skin, added to the rules of the Champagne appellation by an order of 31 July 2025.",
      },
    },
    terroirs: [],
    sections: [
      {
        id: "part",
        titre: { fr: "Un cépage à part entière ?", en: "A grape in its own right?" },
        paragraphes: [
          {
            fr: "Oui, au sens de l'appellation : le cahier des charges le cite à part, parmi les cépages principaux, sous le nom « chardonnay rose ». Botaniquement, c'est une mutation naturelle du chardonnay : ses baies ont la peau rosée.",
            en: "Yes, as far as the appellation is concerned: the rules list it separately among the main grapes, as “chardonnay rose”. Botanically, it is a natural mutation of chardonnay: its berries have pinkish skin.",
          },
        ],
      },
      {
        id: "aube",
        titre: { fr: "Et dans l'Aube ?", en: "And in the Aube?" },
        paragraphes: [
          {
            fr: "Aucune source ne mentionne pour l'instant de vignes plantées dans l'Aube. Nous suivrons avec curiosité les premiers vignerons aubois qui le planteront.",
            en: "No source mentions any vines planted in the Aube yet. We will follow with curiosity the first Aube winemakers to plant it.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "Un peu d'histoire", en: "A little history" },
        paragraphes: [
          {
            fr: "Il était déjà connu en Champagne et en Bourgogne au début du XXe siècle. Un arrêté du 31 juillet 2025 l'a ajouté au cahier des charges de l'appellation Champagne.",
            en: "It was already known in Champagne and Burgundy in the early 20th century. An order of 31 July 2025 added it to the Champagne appellation rules.",
          },
        ],
      },
    ],
  },

  voltis: {
    cle: "voltis",
    statut: "vifa",
    groupe: "nouveaux",
    couleur: blanc,
    motCle: "voltis champagne",
    resume: {
      fr: "Variété résistante au mildiou et à l'oïdium, autorisée à petite dose pour s'adapter au climat de demain.",
      en: "A variety resistant to downy and powdery mildew, allowed in small amounts to adapt to tomorrow's climate.",
    },
    accroche: { fr: "Ni cépage principal ni cépage ancien : une variété nouvelle, autorisée à l'essai et en petite quantité.", en: "Neither a main grape nor an old one: a new variety, allowed on trial and in small amounts." },
    seo: {
      title: { fr: "Voltis : la variété résistante du champagne", en: "Voltis: champagne's disease-resistant variety" },
      description: {
        fr: "Le voltis, variété blanche résistante au mildiou et à l'oïdium, autorisée en Champagne comme « variété d'intérêt à fin d'adaptation » : règles et limites.",
        en: "Voltis, a white variety resistant to downy and powdery mildew, allowed in Champagne as a “variety of interest for adaptation”: rules and limits.",
      },
    },
    terroirs: [],
    sections: [
      {
        id: "part",
        titre: { fr: "Une place à part dans l'appellation", en: "A special place in the appellation" },
        paragraphes: [
          {
            fr: "Le cahier des charges ne le range pas parmi les cépages principaux : c'est une « variété d'intérêt à fin d'adaptation ». Elle ne peut pas dépasser 5 % de l'encépagement d'une exploitation ni 10 % de l'assemblage, et ne s'utilise jamais seule.",
            en: "The appellation rules do not list it among the main grapes: it is a “variety of interest for adaptation”. It may not exceed 5% of a farm's plantings or 10% of the blend, and is never used on its own.",
          },
          {
            fr: "Pour la planter, le vigneron signe une convention avec l'INAO et l'organisme de défense et de gestion de l'appellation.",
            en: "To plant it, the winemaker signs an agreement with INAO and the appellation's management body.",
          },
        ],
      },
      {
        id: "culture",
        titre: { fr: "À la vigne", en: "In the vineyard" },
        paragraphes: [
          {
            fr: "Le voltis est une variété résistante au mildiou et à l'oïdium, deux maladies majeures de la vigne. Il permet de réduire les traitements.",
            en: "Voltis is a variety resistant to downy and powdery mildew, two major vine diseases. It helps reduce spraying.",
          },
        ],
      },
      {
        id: "histoire",
        titre: { fr: "D'où vient-il ?", en: "Where does it come from?" },
        paragraphes: [
          {
            fr: "C'est une variété récente, obtenue par l'INRAE. Les vignerons de l'Aube qui l'auront planté nous diront comment il se comporte dans leurs vignes.",
            en: "It is a recent variety, bred by INRAE. The Aube winemakers who plant it will tell us how it behaves in their vineyards.",
          },
        ],
      },
    ],
  },
};

/**
 * Cépages masqués pour l'instant (page « en brouillon ») : ni sur la page générale, ni dans les pastilles,
 * ni dans le plan du site ; leur adresse renvoie une page introuvable. Retirer « voltis » d'ici pour le ressortir.
 */
export const CEPAGES_MASQUES: CepageKey[] = ["voltis"];

/** Ordre d'affichage sur la page générale (sans les cépages masqués). */
export const ORDRE_CEPAGES: CepageKey[] = (
  ["pinot-noir", "chardonnay", "meunier", "pinot-blanc", "pinot-gris", "arbane", "petit-meslier", "chardonnay-rose", "voltis"] as CepageKey[]
).filter((c) => !CEPAGES_MASQUES.includes(c));
