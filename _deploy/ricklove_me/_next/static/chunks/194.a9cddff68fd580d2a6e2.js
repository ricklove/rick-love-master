"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[194],{7194:function(t,e,n){n.r(e),n.d(e,{EducationalGame_StarBlastSideways_Spanish:function(){return m}});var a=n(1738),o=n(6135),r=n(5950);const s=({speechService:t})=>(({subject:t,maxAnswers:e=4,onQuestion:n,onQuestionReverse:a})=>{let o={isReversed:!1,iSection:null,iNext:null,completedSectionKeys:[]};const s="Reversed - ",l=(t,e)=>e?`Reversed - ${t}`:t;return{load:async t=>{const e=await t.load();e&&(o=e)},save:async t=>{await t.save(o)},getSections:()=>[...t.sections.map((t=>({key:l(t.name,!1),name:l(t.name,!1),isComplete:o.completedSectionKeys.includes(l(t.name,!1))}))),...t.sections.map((t=>({key:l(t.name,!0),name:l(t.name,!0),isComplete:o.completedSectionKeys.includes(l(t.name,!0))})))],gotoSection:({key:e})=>{const n=e.startsWith(s),a=n?e.substr(s.length):e;o.iSection=t.sections.findIndex((t=>t.name===a)),o.iNext=0,o.isReversed=n},getNextProblem:()=>{var s,i,c;null==o.iSection&&(o.iSection=0,o.iNext=null),(null!==(s=o.iNext)&&void 0!==s?s:0)>=(null!==(c=null===(i=t.sections[o.iSection])||void 0===i?void 0:i.entries.length)&&void 0!==c?c:0)&&(o.iSection++,o.iNext=null),o.iSection>=t.sections.length&&(o.iSection=0,o.iNext=null,o.isReversed=!o.isReversed),null==o.iNext&&(o.iNext=0);const d=t.sections[o.iSection],u=d.entries[o.iNext];if(!u)return{done:!0,key:"done"};const h=o.isReversed?{question:u.response,anwer:u.prompt}:{question:u.prompt,anwer:u.response},m=e-1,p=(0,r.EB)((0,r.TV)(d.entries.slice(Math.max(0,o.iNext-10),o.iNext+10).map((t=>o.isReversed?t.prompt:t.response)).filter((t=>t!==h.anwer)))).slice(0,m),T=(0,r.TV)([...p.map((t=>({value:`${t}`,isCorrect:!1}))),{value:`${h.anwer}`,isCorrect:!0}]).map((t=>Object.assign(Object.assign({},t),{key:t.value}))),g=o.iNext===d.entries.length-1,y=g&&o.iSection===t.sections.length-1;return o.iNext++,{key:`${h.question}`,question:h.question,onQuestion:o.isReversed?()=>null===a||void 0===a?void 0:a(h.question):()=>null===n||void 0===n?void 0:n(h.question),answers:T,sectionKey:l(d.name,o.isReversed),isLastOfSection:g,isLastOfSubject:y}},recordAnswer:(t,e)=>{e.isCorrect&&t.isLastOfSection&&o.completedSectionKeys.push(t.sectionKey)}}})({subject:((t,e)=>{const n=t.split("\n").map((t=>t.trim())).filter((t=>t)),a=[];a.push({name:"[Start]",entries:[]});let o=a[0];for(const r of n){const t=r.split("\t");1===t.length&&(a.push({name:t[0].trim(),entries:[]}),o=a[a.length-1]),t.length>=2&&o.entries.push({prompt:t[0].trim(),response:t[1].trim()})}return a.forEach((t=>{t.entries=(0,r.Xq)(t.entries,(t=>t.prompt))})),{subjectName:e,sections:a.filter((t=>t.entries.length>0))}})(l,"Spanish"),onQuestion:e=>{t.speak(e,"es")},onQuestionReverse:e=>{t.speak(e,"en")}}),l="\n \t\n\xbfC\xf3mo se llama usted?\tWhat's your name?\t\n\xbfC\xf3mo se llama su padre?\tWhat's your father's name?\t\n\xbfC\xf3mo se llama su madre?\tWhat's your mother's name?\t\n\xbfC\xf3mo se llama su amigo(a)?\tWhat's your friend's name?\t\nMucho gusto.\tIt's a pleasure.\t\nMe llamo...\tMy name is...\t\nSe llama...\tHis/Her name is...\t\nEl gusto es m\xedo.\tThe pleasure is mine.\t\nAdi\xf3s.\tGoodbye.\t\nHasta ma\xf1ana.\tUntil tomorrow.\t\nHasta luego.\tUntil then.\t\nHasta la vista.\tUntil we see (again).\t\nCon permiso.\tExcuse me. (Said on leaving a group)\t\n\t\nGreetings\t\nBuenos d\xedas, Se\xf1or...\tGood morning, Mr...\t\nBuenas tardes, Se\xf1ora...\tGood afternoon, Mrs...\t\nBuenas noches, Se\xf1orita...\tGood evening, Ms...\t\n\xa1Hola!\tHi!\t\n\xa1Oye!\tHey!\t\n\xbfC\xf3mo est\xe1 usted?\tHow are you?\t\n\xbfC\xf3mo est\xe1 su padre?\tHow is your father?\t\n\xbfC\xf3mo est\xe1 su madre?\tHow is your mother?\t\n\xbfC\xf3mo est\xe1 su familia?\tHow is your family?\t\n\xbfQu\xe9 hay de nuevo?\tWhat's new?\t\nMuy bien.\tVery fine/good.\t\nAs\xed-as\xed.\tSo-so\t\nMal.\tIll.\t\nMejor.\tBetter.\t\nNada de particular.\tNothing much.\t\n\t\nQuestions and Answers\t\n\xbfC\xf3mo se dice...?\tHow do you say...?\t\n\xbfC\xf3mo se pronuncia...?\tHow do you pronounce...?\t\n\xbfC\xf3mo se escribe...?\tHow do you write...?\t\n\xbfC\xf3mo se traduce...?\tHow do you translate...?\t\n\xbfQu\xe9 significa?\tWhat does it mean...?\t\n(Yo) no s\xe9.\tI don't know.\t\n(Yo) no comprendo.\tI don't understand.\t\n(Yo) no puedo.\tI can't.\t\n(Yo) no recuerdo.\tI don't remember.\t\nSe me olvid\xf3.\tI forgot.\t\n\t\nFavors and Courtesies\t\n\xbfC\xf3mo?\tWhat?\t\n\xa1Un momento!\tWait a moment!\t\n\xa1M\xe1s despacio!\tSlower!\t\n\xa1Repita!\tAgain!\t\nPor favor.\tPlease.\t\nGracias.\tThank you.\t\nDe nada.\tYour welcome.\t\nDispense usted.\tExcuse me. (To get someone's attention)\t\nPerd\xf3n. Lo siento.\tExcuse me. I'm sorry.\t\nS\xed/No.\tYes/No.\t\nEst\xe1 bien.\tAll right.\t\nNo importa.\tNevermind.\t\nQuiz\xe1.\tPerhaps.\t\nDepende.\tIt depends.\t\n\t\nDays of the week\t\nLunes\tMonday\t\nMartes\tTuesday\t\nMi\xe9coles\tWednesday\t\nJueves\tThursday\t\nViernes\tFriday\t\nS\xe1bado\tSaturday\t\nDomingo\tSunday\t\n\xbfQu\xe9 d\xeda es?\tWhat day is it?\t\nHoy es...\tToday is...\t\nMa\xf1ana ser\xe1...\tTomorrow will be...\t\nAyer fue...\tYesterday was...\t\n\t\nNumbers\t\nCero\tZero\t\nUno\tOne\t\nDos\tTwo\t\nTres\tThree\t\nCuatro\tFour\t\nCinco\tFive\t\nSeis\tSix\t\nSiete\tSeven\t\nOcho\tEight\t\nNueve\tNine\t\nDiez\tTen\t\nOnce\tEleven\t\nDoce\tTwelve\t\nTrece\tThirteen\t\nCatorce\tFourteen\t\nQuince\tFifteen\t\nDiecis\xe9is\tSixteen\t\nDiecisiete\tSeventeen\t\nDieciocho\tEighteen\t\nDiecinueve\tNineteen\t\nVeinte\tTwenty\t\nVeintiuno\tTwenty one\t\nVeintid\xf3s\tTwenty two\t\nVeintitr\xe9s\tTwenty three\t\nVeinticuatro\tTwenty four\t\nVeinticinco\tTwenty five\t\nVeintis\xe9is\tTwenty six\t\nVeintisiete\tTwenty seven\t\nVeintiocho\tTwenty eight\t\nVeintinueve\tTwenty nine\t\nTreinta\tThirty\t\nCuarenta\tForty\t\nCincuenta\tFifty\t\nSesenta\tSixty\t\nSetenta\tSeventy\t\nOchenta\tEighty\t\nNoventa\tNinety\t\nCien\tOne hundred\t\n\t\nPeople\t\nEl muchacho\tThe boy\t\nLa muchacha\tThe girl\t\nEl alumno\tThe student (boy)\t\nLa alumna\tThe student (girl)\t\nEl compa\xf1ero (de clase)\tThe classmate (boy)\t\nLa compa\xf1era (de clase)\tThe classmate (girl)\t\nEl profesor\tThe teacher (male)\t\nLa profesora\tThe teacher (female)\t\nEl director\tThe principal \t\nLa secretaria\tThe secretary \t\n\t\nThings\t\nEl libro\tThe book\t\nLa Biblia\tThe Bible\t\nEl diccionario\tThe dictionary\t\nLa enciclopedia\tThe encyclopidia\t\nEl peri\xf3dico\tThe newspaper\t\nLa revista\tThe magazine\t\nEl Cuademo\tThe note book\t\nLa tarea\tThe assignment\t\nEl disco\tThe record\t\nLa cinta\tThe tape\t\nEl bol\xedgrafo\tThe ballpoint\t\nLa pluma\tThe pen\t\nEl l\xe1piz\tThe pencil\t\nLa tiza\tThe chalk\t\nEl borrador\tThe chalk eraser\t\nLa goma\tThe rubber eraser\t\nEl papel\tThe paper\t\nLa tinta\tThe ink\t\nEl dibujo\tThe drawing\t\nLa palabra\tThe word\t\n\t\nRequests\t\n(Yo) necesito...\tI need...\t\n(Yo) tengo...\tI have...\t\n(Yo) quiero...\tI want...\t\nP\xe1same...\tPass me...\t\nAqui esta...\tHere is...\t\n\t\nPlaces\t\nen\tIn, at\t\nen, sobre\ton\t\ncon\tWith\t\na\tTo\t\nde\tFrom\t\nel ba\xf1o\tThe bathroom\t\nla biblioteca\tthe library\t\nla oficina\tthe office\t\nel gimnasio\tthe gym\t\nla cafeter\xeda\tthe cafeteria\t\nla sala de clase\tThe classroom\t\nel laboratorio\tThe laboratory\t\nel auditorio\tthe auditorium\t\nel ropero\tthe locker\t\nel campo atl\xe9tico\tthe athletic field\t\n\t\nIn the classroom\t\nla puerta\tDoor\t\nla ventana\tWindow\t\nla pared\tWall\t\nla pizarra\tChalkboard\t\nel suelo\tFloor\t\nel rinc\xf3n\tCorner\t\nla mesa\tTable\t\nla silla\tChair\t\nel pupitre\tDesk\t\nel cesto\tWastebasket\t\nel reloj\tClock\t\nla luz \tLight\t\n\t\nTimes and Classes\t\nA las nueve\tAt 9:00\t\nA las diez\tAt 10:00\t\nA las once\tAt 11:00\t\nA las dos\tAt 12:00\t\nLenguas (extranjeras)\t(Foreign) languages\t\nEspa\xf1ol\tSpanish\t\nFranc\xe9s\tFrench\t\nAlem\xe1n\tGerman\t\nItaliano\tItalian\t\nArte\tArt\t\nCoro\tChoir\t\nDrama\tDrama\t\nMecanograf\xeda\tTyping\t\nEducaci\xf3n f\xedsica\tPhysical education\t\n\t\nCourses\t\nBiblia\tBible\t\nIngl\xe9s\tEnglish\t\nHistoria\tHistory\t\nInstrucci\xf3n c\xedvica\tCivics\t\nCiencia\tScience\t\nBiolog\xeda \tBiology\t\nQu\xedmica\tChemistry\t\nF\xedsica\tPhysics\t\nMatem\xe1ticas\tMathematics\t\n\xc1lgebra\tAlgebra\t\nGeometr\xeda\tGeometry\t\nC\xe1lculo\tCalculus\t\n\t\nWeather\t\n\xbfQu\xe9 tiempo hace?\tWhat's the weather like?\t\nHace buen (mal) tiempo\tIt's good (bad) weather\t\nHace (mucho) frio\tIt's (very) cold\t\nHace fresco\tIt's cool\t\nHace (mucho) calor\tIt's (very) warm\t\nHace (mucho) viento\tIt's (very) windy\t\nLas estaciones\tThe seasons\t\nInvierno\tWinter\t\nPrimavera\tSpring\t\nVerano\tSummer\t\nOto\xf1o\tFall\t\n\t\nThe months\t\n\xbfCu\xe1l es la fecha?\tWhat's the date?\t\nEnero\tJanuary\t\nFebrero\tFebruary\t\nMarzo\tMarch\t\nAbril\tApril\t\nMayo\tMay\t\nJunio\tJune\t\nJulio\tJuly\t\nAgosto\tAugust\t\nSeptiembre\tSeptember\t\nOctubre\tOctober\t\nNoviembre\tNovember\t\nDiciembre\tDecember\t\n\t\nActions\t\n\xbfQu\xe9 pasa?\tWhat's happening?\t\nNecesito...\tI need...\t\nTengo que...\tI have to...\t\nPrefiero...\tI prefer...\t\nPuedo...\tI am able (can)...\t\nPresentar\tTo present\t\nPreparar\tTo prepare\t\nPracticar\tTo practice\t\nPronunciar\tTo pronounce\t\nRecitar\tTo recite\t\n\t\nActivities\t\nEstudiar\tTo study\t\nCopiar\tTo copy\t\nImitar\tTo imitate\t\nEnse\xf1ar\tTo teach\t\nRepasar\tTo review\t\nUsar\tTo use\t\nMirar\tTo look at\t\nEscuchar\tTo listen to\t\nHablar\tTo talk\t\nPreguntar\tTo ask\t\nContestar\tTo answer\t\nExplicar\tTo explain\t\n\t\nWhen?', 'Where?', 'How?', and 'Why?' words\t\nahora\tNow\t\npronto\tSoon\t\nm\xe0s tarde\tLater on\t\npor la ma\xf1ana\tIn the morning\t\npor la tarde\tIn the afternoon\t\npor la noche\tIn the evening\t\naqu\xed\there\t\nall\xed, ah\xed\tthere\t\nm\xe0s all\xe0\tfarther away\t\nen casa\tAt home\t\nen la escuela\tAt school\t\nen la iglesia\tAt church\t\nbien\tWell\t\ncon cuidado\tCarefully\t\nclaramente\tClearly\t\njuntos\tTogether\t\nen voz alta\tAloud\t\nmal\tPoorly\t\nr\xe0pidamente\tRapidly\t\ncorrectamente\tCorrectly\t\nsolo\tAlone\t\nen voz baja\tSoftly\t\nes bueno\tIt's good\t\nes malo\tIt's bad\t\nes f\xe0cil\tIt's easy\t\nes dif\xedcil\tIt's hard\t\nes importante\tIt's important\t\nes interesante\tIt's interesting\t\nes necesario\tIt's necessary\t\nes divertido\tIt's fun\t\nes \xf9til\tIt's helpful\t\nes rid\xedculo\tIt's ridiculous\t\n\t\nClothes (Men's)\t\nUsted Necesita\tYou need\t\nUsted Tiene\tYou have\t\nUsted Quiere\tYou want\t\nUsted Prefiere\tYou prefer\t\nUsted Lleva\tYou wear\t\nEl sombrero\tThe hat\t\nLa camisa\tThe shirt\t\nLa corbata\tThe tie\t\nLos pantalones\tThe pants\t\nEl cintur\xf3n\tThe belt\t\nLos zapatos\tThe shoes\t\nLos calcetines\tThe socks\t\nEl su\xe9ter\tThe sweater\t\nLa chaqueta\tThe jacket\t\nLa cartera\tThe wallet\t\n\t\nClothes (women's)\t\nla bufanda\tThe scarf\t\nla blusa\tThe blouse\t\nla falda\tThe skirt\t\nel vestido\tThe dress\t\nel abrigo\tThe coat\t\nlas sandalias\tThe sandals\t\nlas botas\tThe boots\t\nel impermeable\tThe raincoat\t\nel paraguas\tThe umbrella\t\nla bolsa\tThe purse\t\n\t\nThe type and style\t\nalgo\tsomething\t\nnada\tnothing\t\nmas\tmore\t\nmenos\tless\t\ntan\tas\t\nnuevo(a)\tnew\t\nviejo(a)\told\t\ncaro(a)\texpensive\t\nbarato(a)\tinexpensive\t\nbonito(a)\tpretty\t\nfeo(a)\tegly\t\nde moda\tstylish\t\npasado(a) de moda\told-fashioned\t\ncasual, informal\tcasual\t\nelegante\tdressy\t\n\t\nThe color\t\nclaro(a)\tlight\t\nabscuro(a)\tdark\t\nblanco(a)\twhite\t\nnegro(a)\tblack\t\nrojo(a)\tred\t\nrosa\tpink\t\nanaranjado(a)\torange\t\namarillo\tyellow\t\ncaf\xe9\tbrown\t\nverde\tgreen\t\nazul\tblue\t\ngris\tgray\t\n\t\nShopping\t\nUsted necesita\tYou need\t\nUsted tiene\tYou have\t\nUsted quiere\tYou want\t\nUsted prefiere\tYou prefer\t\nUsted puede\tYou are able\t\nbuscar\tTo look for\t\nesperar\tTo lwait for\t\ntomar\tTo take\t\nense\xf1ar\tTo show\t\ncomprar\tTo buy\t\nmandar\tTo send\t\nllevar\tTo take along, wear\t\ndejar\tTo leave behind\t\nguardar\tTo keep\t\ncambriar\tTo (ex)change\t\n\t\nQuality and Size\t\n(\xbfQu\xe9 tal?) \xbfLe gusta?\t(How) Do you like it?\t\n(\xbfQu\xe9 tal?) \xbfLe queda?\t(How) does it fit you?\t\n\xbfQu\xe9 talla es?\tWhat size is it? (Clothes)\t\n\xbfQu\xe9 n\xfamero son?\tWhat size are they? (shoes)\t\n\xbfQu\xe9 marca es?\tWhat brand is it?\t\n\xbfDe Qu\xe9 material (tela) es?\tWhat material is it?\t\n\xa1Me gusta (mucho)!\tI like it (a lot)!\t\n\xa1me queda (bien)!\tIt fits me (well)!\t\n\xa1Me queda grande!\tIt's too big!\t\n\xa1Me queda peque\xf1o!\tIt's too small!\t\n\xa1Me queda largo(a)!\tIt's too long!\t\n\xa1Me queda corto(a)!\tIt's too short!\t\n\t\nWhich one(s)?\t\nEl primero (La primera)\tThe first one\t\nEl segundo (La segunda)\tThe second one\t\nEl tercero (la tercera)\tThe third one\t\nEl proximo (La proxima)\tThe next one\t\nEl \xfaltimo (La \xfaltima)\tThe last one\t\nEl \xfanico (La \xfanica)\tThe only one\t\nEl/la mejor \tThe best one\t\nEl/la peor\tThe worst one\t\nEl mismo (la misma)\tThe same one\t\nEl otro (La otra)\tThe other one\t\nLos/las dos\tBoth\t\nNinguno\tNeither\t\n\t\nQuantity and Measurement\t\n\xbfCu\xe1ntos? / \xbfCuantas?\tHow many?\t\nTodos/todas\tAll\t\nmuchos/muchas\tMany\t\nalgunos/algunas\tSome\t\npocos/pocas\tFew\t\nninguno/ninguna\tNone\t\n\xbfCu\xe1nto? / \xbfCu\xe1nta?\tHow much?\t\ncasi (una yarda)\tAlmost (a yard)\t\ns\xf2lo (una yarda)\tOnly (a yard)\t\nm\xe1s de (una yarda)\tMore than (a yard)\t\nmenos de (una yarda)\tLess than (a yard)\t\nm\xe1s o menos (una yarda)\tAbout/roughly (a yard)\t\n\t\nPrice: How much is it?\t\nDiez\tTen\t\nVeinte\tTwenty\t\nTreinta\tThirty\t\nCuarenta\tForty\t\nCincuenta\tFifty\t\nSesenta\tSixty\t\nSetenta\tSeventy\t\nOchenta\tEighty\t\nNoventa\tNinety\t\nCiento\tOne hundered\t\n\t\n-er Verbs\t\nUsted va a..\tYou are going.\t\nusted debe..\tYou are supposed...\t\nusted sabe..\tYou know how...\t\nLe gusta...\tYou like...\t\nse le olvid\xf3...\tYou forgot.\t\ncomprender (comprendo)\tTo understand\t\naprender (aprendo)\tTo learn\t\ncomer (como)\tTo eat\t\nbeber (bebo)\tTo drink\t\nvender (vendo)\tTo sell\t\nescoger (escojo)\tTo choose\t\nver (veo)\tTo see\t\ncreer (creo)\tTo believe\t\nleer (leo)\tTo read\t\nresponder (respondo)\tTo respond\t\n\t\nHow often/long?\t\nsiempre\tAlways\t\nmuchas veces\tOften\t\na veces\tSometimes\t\nrara vez\tRarely\t\nnunca\tNever\t\ntoda la ma\xf1ana\tAll morning\t\ntoda la tarde\tAll afternoon\t\ntodo el d\xeda\tAll day\t\ntoda la noche\tAll night\t\ntodo el tiempo\tAll the time\t\n\t\n-ir Verbs\t\nescribir (escribo)\tTo write\t\nvivir (vivo)\tTo live\t\nabrir (abro)\tTo open\t\ndecidir (decido)\tTo decide\t\npermitir (permito )\tTo permit\t\nrecibir (recibo)\tTo receive\t\nasistir (asisto)\tTo attend\t\ncubrir (cubro)\tTo cover\t\ndescubrir (descubro)\tTo discover\t\nprohibir (proh\xedbo)\tTo prohibit\t\n\t\nWhen?\t\nmuy temprano por la ma\xf1ana\tEarly in the morning)\t\ntemprano\tEarly (ahead of time)\t\na tiempo\tOn time\t\ntarde\tLate (behind time)\t\nmuy tarde por la noche\tLate (at night)\t\nantes de la escuela)\tBefore (school)\t\nal principio de la escuela)\tAt the beginning of (school)\t\ndurante (la escuela)\tDuring (school)\t\nal fin de (la escuela)\tAt the end of (school)\t\ndespu\xe9s de la escuela)\tAfter (school)\t\n\t\nFamily\t\nLa familia\tThe Family\t\nel padre\tFather\t\nla madre\tMother\t\nel hermano\tBrother\t\nla hermana\tSister\t\nel abuelo\tGrandfather\t\nla abuela\tGrandmother\t\nel t\xedo\tUncle\t\nla t\xeda\tAunt\t\nel primo\tCousin (boy)\t\nla prima\tCousin (girl)\t\nel hombre\tMan\t\nla mujer\tWoman\t\nel esposo\tHusband\t\nla esposa\tWife\t\nel hijo\tSon\t\nla hija\tDaughter\t\nlos hijos\tChildren (by relation)\t\nlos ni\xf1os\tChildren (by age)\t\nlos padres\tParents\t\nlos parientes\tReletives\t\n\t\nPersonal Characteristics\t\nalguien\tSomebody\t\nnadie\tNobody\t\nmuy, bastante\tQuite\t\nalgo\tSomewhat\t\npoco, no muy\tNot very\t\nj\xf3ven\tYoung\t\nViejo (a)\tOld\t\nrico (a)\tRich\t\npobre\tPoor\t\nfuerte\tStrong\t\nd\xe9bil\tWeak\t\nsimp\xe1tico (a)\tNice\t\nantip\xe1tico (a)\tMean\t\ndiligente\tDiligent\t\nperezoso (a)\tLazy\t\n\t\nPhysical appearance\t\nalto (a)\tTall\t\nmediano (a)\tM\xe9dium height\t\nbajo (a)\tShort\t\ngordo (a)\tFat\t\nDelgado (a)\tSlender\t\nflaco (a)\tSkinny\t\nrubio (a)\tBlond\t\ncasta\xf1o (a)\tBrown-haired\t\nMoreno (a)\tDark-haired\t\nde ojos azules\tBlue-eyed\t\nde ojos verdes\tGreen-eyed\t\nde ojos caf\xe9s\tBrown-eyed\t\nguapo\tHandsome\t\nhermosa\tBeautiful\t\nm\xe1s o menos (regular)\tAverage (so-so)\t\n\t\nThe Family: Personal History\t\n\xbfCu\xe1l es su apellido?\tWhat's your last name?\t\nMi apellido es..\tMy last name is...\t\n\xbfCu\xe1l es su direcci\xf3n?\tWhat's your address?\t\nMi direcci\xf3n es...\tMy address is...\t\n\xbfCu\xe1l es su n\xfamero de tel\xe9fono?\tWhat's your telephone number?\t\nMi n\xfamero de tel\xe9fono es...\tMy telephone number is...\t\n\xbfDe d\xf3nde es usted?\tWhere are you from?\t\nSoy de...\tI'm from...\t\n\xbfCu\xe1ntos a\xf1os tiene usted?\tHow old are you?\t\nYo tengo... a\xf1os\tI am.. years old\t\n\t\nThe Family: What's happening? (Z verbs)\t\nnacer (nazco)\tTo be born\t\ncrecer (crezco)\tTo grow\t\nconocer (conozco)\tTo know (be acquainted with)\t\nreconocer (reconozco)\tTo recognize\t\nobedecer (obedezco)\tTo obey\t\ndesobedecer (desobedezco)\tTo disobey\t\nofrecer (ofrezco)\tTo offer\t\nmerecer (merezco)\tTo merit (deserve)\t\naparecer (aparezco)\tTo appear (show up)\t\ndesaparecer (desaparezco)\tTo disappear\t\n\t\nChapter 18\t\nla cama\tThe bed\t\nla cobija\tThe blanket\t\nla c\xf3moda (el tocador)\tThe dresser\t\nel caj\xf3n\tThe drawer\t\nel armario\tThe closet\t\nel lavamanos\tThe washstand (sink)\t\nel espejo\tThe mirror\t\nel ba\xf1o\tThe bathtub\t\nla ducha\tThe shower\t\nel excusado\tThe toilet\t\nel refrigerador\tThe refrigerator\t\nla estufa\tThe stove\t\nel horno\tThe oven\t\nel fregadero\tThe sink\t\nla alacena\tThe cupboard\t\nla hierba\tThe grass\t\nel c\xe9sped (el pasto)\tThe lawn\t\nlas flores\tThe flowers\t\nlos arbustos\tThe bushes\t\nlos \xe1rboles\tThe trees\t\n\t\nChapter 19\t\nel sofa\tThe sofa\t\nel sill\xf3n\tThe armchair\t\nla mesita para caf\xe9\tThe coffee table\t\nel estante\tThe bookshelf\t\nla l\xe1mpara\tThe lamp\t\nel televisor\tThe television set\t\nel radio\tThe radio\t\nel tocadiscos\tThe record player\t\nel piano\tThe piano\t\nel tel\xe9fono\tThe telephone\t\nla alfombra\tThe rug\t\nlas cortinas\tThe curtains\t\nel cuadro\tThe picture\t\nel florero\tThe vase\t\nel calentador\tThe heater\t\nen, dentro de\tInside\t\nfuera de\tOutside\t\ncerca de\tNear\t\nlejos de\tFar from\t\ndelante de\tIn front of\t\ndetr\xe1s de\tIn back of\t\nencima de, sobre\tOn top of\t\ndebajo de, bajo\tUnderneath\t\nal lado de\tOn the side of\t\nentre\tBetween\t\n\t\nIrregular Verbs\t\nEstar (estoy)\tto be (temporary, location)\t\nSer (soy) \tto be (permanant, trait)\t\nDar (doy)\tto give\t\nIr (voy)\tto go\t\nVer (veo)\tto see\t\nSaber (s\xe9)\tto know\t\n\n\n\nVerbs\t\nEstar (estoy)\tto be (temporary, location)\nSer (soy) \tto be (permanant, trait)\nDar (doy)\tto give\nIr (voy)\tto go\nVer (veo)\tto see\nSaber (s\xe9)\tto know\n\t\nChapter 20\t\nLOS PASATIEMPOS\tPASTIMES\ndescansar (Descanso) en el sofa \tTo rest on the sofa \nleer (leo) las noticias\tTo read the news\ntener (tengo) visitas\tTo have company\ndar (doy) una fiesta\t To give a party\njugar (juego) una partida\tTo play a game\nmirar (miro) la television\tTo watch television\nescuchar (escucho) la radio\tTo listen to the radio \n hablar (hablo) por tel\xe9fono\tTo talk on the phone\ntocar (toco) un disco \tTo play a record\ntocar (toco) un instrumento\tTo play an instrument\nEL TIEMPO\tTIME\nPASADO\tPAST\nayer por la ma\xf1ana\tYesterday morning\nayer por la tarde\tYesterday afternoon\nanoche\tLast night\nPRESENTE\tPRESENT\nesta ma\xf1ana\tThis morning\nesta tarde\tThis afternoon\nesta noche\tTonight\nFUTURO\tFUTURE\nma\xf1ana por la ma\xf1ana\tTomorrow morning\nma\xf1ana por la tarde\tTomorrow afternoon\nma\xf1ana por la noche\tTomorrow night\n\t\nChapter 21\t\nLOS QUEHACERES DOMESTICOS\tHOUSEWORK\nTardo en..\tdelay in.\nComienzo a..\tI begin to...\ncontinuo a...\tI continue to...\nCeso de... (dejo de..)\tI cease from...\nAcabo de...\tI just (did)...\ntrabajar (trabajo) en el jard\xedn\tWork (in the yard)\ncortar (corto) el c\xe9sped (el pasto)\tCut (the grass)\ncultivar (cultivo) la tierra\tCultivate (the ground)\nplantar (planto) las flores\tPlant (the flowers)\nregar (riego) el c\xe9sped (el pasto)\tWater (the lawn)\nayudar (ayudo) en la cocina\tTo help (in the kitchen)\ncocinar (cocino)\tTo cook (the meal)\nponer (pongo) la mesa\tTo set (the table)\nlevantar (levanto) la mesa\tTo clear (the table)\nlavar (lavo) los platos\tTo wash (the dishes)\nsecar (seco) los platos\tTo dry (the dishes)\nlimpiar (limpio) el ba\xf1o\tTo clean (the bathroom)\nhacer (hago) las camas\tTo make( the beds)\nabrir (abro) el agua\tTo turn on (the water)\ncerrar (cierro) el agua\tTo turn off (the water)\nprender (prendo) la luz, la radio\tTo turn on (the light, radio)\napagar (apago) la luz, la radio\tTo turn off (the light, radio)\n\t\nChapter 22\t\nLA CASA: LAS CARACTERISTICAS\tTHE HOUSE: CHARACTERISTICS\nmoderno (a)\tModern\nantiguo (a)\tOld-fashioned\nordinario (a) (sencillo (a))\tPlain (of simple design)\nelegante, (lujoso (a))\tElegant (fancy)\nc\xf3modo (a)\tComfortable\ninc\xf3modo (a)\tUncomfortable\nblando (a)\tSoft\nduro (a)\tHard\nancho (a)\tWide\nestrecho (a)\tNarrow\nRedondo (a)\tRound\ncuadrado (a)\tSquare\nLA CASA: LAS CONDICIONES\tTHE HOUSE: CONDITIONS\nabierto (a)\tOpen\ncerrado (av\tClosed\ncubierto (o)\tCovered\ndescubierto (a)\tUncovered\nlleno (a)\tFull\nvac\xedo (a)\tEmpty\nlimpio (a)\tClean\nsucio (a)\tDirty\nroto (a)\tBroken (torn)\nen buenas condiciones\tIn good condition\n\t\nChapter 23\t\nLA COMIDA: LA VAJILLA\tTHE MEAL: TABLE SERVICE\nel vaso\tGlass\nla taza\tCup\nel plato\tPlate\nel plato hondo\tBowl\nla jarra\tPitcher\nla botella\tBottle\nel cuchillo\tKnife\nel tenedor\tFork\nla cuchara\tSpoon\nla servilleta\tNapkin\nla sal\tSalt\nla pimiento\tPepper\nLA COMIDA: LAS BEBIDAS\tTHE MEAL: BEVERAGES\nel agua\tWater\nla leche\tMilk\nel caf\xe9\tCoffee\nel te\tTea\nel chocolate instant\xe1neo\tCocoa\nel jugo de naranja\tOrange juice\nla limonada\tLemonade\nla sidra\tCider\nel ponche\tPunch (fruit)\nel refresco\tSoft drink\n\t\nChapter 24\t\nLA CARNE\tMEAT\nla carne de res\tBeef\nel Puerco\tPork\nel pollo\tChicken\nel pescado\tFish\nel cordero\tLamb\nLOS VEGETALES\tVEGETABLES\nlas papas\tPotato\nel arroz\tRice\nel ma\xedz (el elote)\tCorn\nlos frijoles\tBeans\nlas calabazas\tSquash\nlos ch\xedcharos\tPeas\nlas zanahorias\tCarrots\nlos ejotes\tGreen beans\nlas cebollas\tOnions\nel apio\tCelery\nLA FRUTA\tFRUIT\nla manzana\tApple\nla naranja\tOrange\nel pl\xe1tano\tBanana\nla pera\tPear\nel Durazno\tPeach\nel lim\xf3n\tLemon\nCONDIMENTOS\tCONDIMENTS\nla salsa de tomate\tCatsup\nla salsa picante\tHot sauce\nla mostaza\tMustard\nla mayonesa\tMayonnaise\nel az\xfacar\tSugar\nla harina\tFlour\n\t\nChapter 25\t\nEL DESAYUNO\tBREAKFAST\nel tocino\tBacon\nlos huevos\tEggs\nel pan tostado\tToast\nla mantequilla\tButter\nla mermelada\tJam\nEL ALMUERZO\tLUNCH\nel sandwich\tSandwich\nel queso\tCheese\nlas carnes fr\xedas\tCold cuts\nla lechuga\tLettuce\nlos tomates\tTomatoes\nLA CENA\tDINNER\nel pan\tBread\nlas galletas saladas\tCrackers\nla sopa\tSoup\nla ensalada\tSalad\nla salsa para ensalada\tSalad dressing\nEL POSTRE\tDESSERT\nel pastel\tCake\nel pastel (la t\xe1rta)\tPie\nel helado\tIce cream\nlas galletas dulces\tCookies\nlos dulces\tCandy\n\t\nChapter 26\t\nESTA (DEMASIADO)\tIT'S TOO....\ncaliente\tHot (temperature)\nfr\xedo\tCold\npicante\tHot (spicy)\nno picante\tMild\nsalado (a)\tSalty\nsin sal\tSaltless\ndulce\tSweet\namargo (a)\tBitter\nsabroso (a), delicioso (a)\tDelicious\nsin sabor\tTasteless\n\t\nPrepositions before Infinitives\t\nantes de\tbefore\ndespu\xe9s de\tafter\nen vez de\tinstead of\nhasta\tuntil\npara\tfor, in order to\nsin\twithout\nal\ton, upon\n\t\nVamos a Restaurante\t\nEl plato\tplate\nEl tenedor\tfork\nEl vaso\tglass\nLa cuchara\tspoon\nEl cuchillo\tknife\nLa servilleta\tnapkin\nEl mesero\twaitress\nLa cuenta\tthe bill\nPor favor\tplease\nGracias\tthank you\n\t\nChapter 27\t\nLA CREACION: EL UNIVERSO\tCREATION: THE UNIVERSE\nla tierra (planeta)\tThe earth\nel sol\tThe sun\nlas estrellas\tThe stars\nla luna\tThe moon \nel cielo\tThe sky\nel aire\tThe air\nlas nubes\tThe clouds\nla luz del sol\tThe sunlight\nla sombra\tThe shade (shadow)\nla obscuridad\tThe darkness\nEL MUNDO\tTHE WORLD\nla tierra (terreno)\tLand\nla roca\tRock\nla tierra\tDirt\nla arena\tSand\nel polvo\tDust\nla niebla\tMist (fog)\nla lluvia\tRain\nla nieve\tSnow\nel hielo\tIce\nel fuego\tFire\nLOS ANIMALES\tTHE ANIMALS\nel gato\tCat\nel perro\tDog\nel p\xe1jaro\tBird\nel pez\tFish\nel caballo\tHorse\nla vaca\tCow\nel Puerco (el cerdo)\tPig\n\t\nChapter 28\t\nEl hombre: la cabeza\tMan: The Head\nEl pelo\tHair\nLa cara\tFace\nLos ojos\tEyes\nLas orejas\tEars\nLa nariz\tNose\nLa boca\tMouth\nLos labios\tLips\nLa lengua\tTongue\nLos dientes\tTeeth\nLa barba\tChin\nEl hombre: El cuerpo\tMan: The Body\nla piel\tSkin\nel cuello\tNeck\nlos hombros\tShoulders\nla espalda\tBack\nel pecho\tChest\nel est\xf3mago\tStomach\nlos brazos\tArms\nlas manos\tHands\nlos dedos\tFingers\nlas piernas\tLegs\nlos pies\tFeet\nlos dedos del pie\tToes\n\n";var i=n(3782),c=n(4535),d=n(2109),u=n(2968),h=n(3884);const m=t=>{const e=(0,a.useRef)((0,u.a)()),[n,r]=(0,a.useState)("web"!==o.t4.OS);if(!n){const t=()=>{e.current.speak("Start"),r(!0)};return a.createElement(o.G7,null,a.createElement(h.A,{languange:"en",speechService:e.current}),a.createElement(h.A,{languange:"es",speechService:e.current}),a.createElement("div",{onClick:()=>t()},a.createElement(o.G7,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},a.createElement(o.xv,{style:{fontSize:36}},"Start"))))}return a.createElement(d.EducationalGame_StarBlastSideways,{problemService:(0,i.b)((0,c.i)(s({speechService:e.current}),{}),"ProblemsSpanish")})}},2968:function(t,e,n){n.d(e,{a:function(){return o}});var a=n(6135);const o=()=>{if("web"!==a.t4.OS)return{speak:()=>{},getVoicesForLanguange:()=>[],setVoiceForLanguange:()=>{}};const t=window.speechSynthesis,e={};return{speak:(n,a)=>{var o;const r=null!==(o=e[null!==a&&void 0!==a?a:"en"])&&void 0!==o?o:null;try{const e=new SpeechSynthesisUtterance(n);e.voice=r,t.speak(e)}catch(s){}},getVoicesForLanguange:n=>{const a=t.getVoices();console.log("voices",{voices:a});return a.filter((t=>t.lang.startsWith(n))).map((t=>({voice:t,isSelected:e[n]===t})))},setVoiceForLanguange:(t,n)=>{e[t]=n}}}},3884:function(t,e,n){n.d(e,{A:function(){return r}});var a=n(1738),o=n(6135);const r=({languange:t,speechService:e})=>{const[n,r]=(0,a.useState)(!0),[s,l]=(0,a.useState)(0),i=()=>{r(!0),setTimeout((()=>{r(!1)}),1e3)};(0,a.useEffect)((()=>{i()}),[]);return a.createElement(o.G7,null,a.createElement(o.Au,{onPress:i},a.createElement(o.xv,{style:{fontSize:24}},`Voice for ${t}`)),n&&a.createElement(o.P2,{size:"small",color:"red"}),!n&&a.createElement(a.Fragment,null,e.getVoicesForLanguange(t).map((n=>a.createElement(o.Au,{key:n.voice.name,onPress:()=>{var a;a=n.voice,e.setVoiceForLanguange(t,a),l((t=>t+1)),e.speak(a.name,t)}},a.createElement(o.G7,null,a.createElement(o.xv,{style:{margin:4,fontSize:14,whiteSpace:"normal"}},`${n.isSelected?"\u2705":"\ud83d\udd32"} ${n.voice.lang} - ${n.voice.name} - ${n.voice.localService?"local":"web"}`)))))))}}}]);