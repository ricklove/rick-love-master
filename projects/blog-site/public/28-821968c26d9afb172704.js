(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[28],{dnRP:function(t,e,n){"use strict";n.r(e),n.d(e,"EducationalGame_StarBlastSideways_Spanish",(function(){return v}));var a=n("ERkP"),o=n.n(a),r=n("DTYs"),s=n("yyXn"),i=n("aLR2"),l=n("pzhj"),c=n("9u8u"),u=n("t8gp"),d=n("a1TR"),h=n.n(d),m=(n("3yYM"),n("Ab9Y")),p=n("hsFx");function y(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return T(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return T(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0;return function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=t[Symbol.iterator]()).next.bind(n)}function T(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}var b=function(t){var e=t.speechService;return function(t){var e,n,a=t.subject,o=t.maxAnswers,r=void 0===o?4:o,s=t.onQuestion,i=t.onQuestionReverse,l={isReversed:!1,iSection:null,iNext:null,completedSectionKeys:[]},c=function(t,e){return e?"Reversed - "+t:t};return{load:(n=Object(m.a)(h.a.mark((function t(e){var n;return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.load();case 2:(n=t.sent)&&(l=n);case 4:case"end":return t.stop()}}),t)}))),function(t){return n.apply(this,arguments)}),save:(e=Object(m.a)(h.a.mark((function t(e){return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.save(l);case 2:case"end":return t.stop()}}),t)}))),function(t){return e.apply(this,arguments)}),getSections:function(){return[].concat(Object(u.a)(a.sections.map((function(t){return{key:c(t.name,!1),name:c(t.name,!1),isComplete:l.completedSectionKeys.includes(c(t.name,!1))}}))),Object(u.a)(a.sections.map((function(t){return{key:c(t.name,!0),name:c(t.name,!0),isComplete:l.completedSectionKeys.includes(c(t.name,!0))}}))))},gotoSection:function(t){var e=t.key,n=e.startsWith("Reversed - "),o=n?e.substr("Reversed - ".length):e;l.iSection=a.sections.findIndex((function(t){return t.name===o})),l.iNext=0,l.isReversed=n},getNextProblem:function(){var t,e,n;null==l.iSection&&(l.iSection=0,l.iNext=null),(null!==(t=l.iNext)&&void 0!==t?t:0)>=(null!==(e=null===(n=a.sections[l.iSection])||void 0===n?void 0:n.entries.length)&&void 0!==e?e:0)&&(l.iSection++,l.iNext=null),l.iSection>=a.sections.length&&(l.iSection=0,l.iNext=null,l.isReversed=!l.isReversed),null==l.iNext&&(l.iNext=0);var o=a.sections[l.iSection],d=o.entries[l.iNext];if(!d)return{done:!0,key:"done"};var h=l.isReversed?{question:d.response,anwer:d.prompt}:{question:d.prompt,anwer:d.response},m=r-1,y=Object(p.a)(Object(p.f)(o.entries.slice(Math.max(0,l.iNext-10),l.iNext+10).map((function(t){return l.isReversed?t.prompt:t.response})).filter((function(t){return t!==h.anwer})))).slice(0,m),T=Object(p.f)([].concat(Object(u.a)(y.map((function(t){return{value:""+t,isCorrect:!1}}))),[{value:""+h.anwer,isCorrect:!0}])).map((function(t){return Object.assign({},t,{key:t.value})})),b=l.iNext===o.entries.length-1,f=b&&l.iSection===a.sections.length-1;return l.iNext++,{key:""+h.question,question:h.question,onQuestion:l.isReversed?function(){return null==i?void 0:i(h.question)}:function(){return null==s?void 0:s(h.question)},answers:T,sectionKey:c(o.name,l.isReversed),isLastOfSection:b,isLastOfSubject:f}},recordAnswer:function(t,e){e.isCorrect&&t.isLastOfSection&&l.completedSectionKeys.push(t.sectionKey)}}}({subject:function(t,e){var n=t.split("\n").map((function(t){return t.trim()})).filter((function(t){return t})),a=[];a.push({name:"[Start]",entries:[]});for(var o,r=a[0],s=y(n);!(o=s()).done;){var i=o.value.split("\t");1===i.length&&(a.push({name:i[0].trim(),entries:[]}),r=a[a.length-1]),i.length>=2&&r.entries.push({prompt:i[0].trim(),response:i[1].trim()})}return a.forEach((function(t){t.entries=Object(p.b)(t.entries,(function(t){return t.prompt}))})),{subjectName:e,sections:a.filter((function(t){return t.entries.length>0}))}}(f,"Spanish"),onQuestion:function(t){e.speak(t,"es")},onQuestionReverse:function(t){e.speak(t,"en")}})},f="\n \t\n¿Cómo se llama usted?\tWhat's your name?\t\n¿Cómo se llama su padre?\tWhat's your father's name?\t\n¿Cómo se llama su madre?\tWhat's your mother's name?\t\n¿Cómo se llama su amigo(a)?\tWhat's your friend's name?\t\nMucho gusto.\tIt's a pleasure.\t\nMe llamo...\tMy name is...\t\nSe llama...\tHis/Her name is...\t\nEl gusto es mío.\tThe pleasure is mine.\t\nAdiós.\tGoodbye.\t\nHasta mañana.\tUntil tomorrow.\t\nHasta luego.\tUntil then.\t\nHasta la vista.\tUntil we see (again).\t\nCon permiso.\tExcuse me. (Said on leaving a group)\t\n\t\nGreetings\t\nBuenos días, Señor...\tGood morning, Mr...\t\nBuenas tardes, Señora...\tGood afternoon, Mrs...\t\nBuenas noches, Señorita...\tGood evening, Ms...\t\n¡Hola!\tHi!\t\n¡Oye!\tHey!\t\n¿Cómo está usted?\tHow are you?\t\n¿Cómo está su padre?\tHow is your father?\t\n¿Cómo está su madre?\tHow is your mother?\t\n¿Cómo está su familia?\tHow is your family?\t\n¿Qué hay de nuevo?\tWhat's new?\t\nMuy bien.\tVery fine/good.\t\nAsí-así.\tSo-so\t\nMal.\tIll.\t\nMejor.\tBetter.\t\nNada de particular.\tNothing much.\t\n\t\nQuestions and Answers\t\n¿Cómo se dice...?\tHow do you say...?\t\n¿Cómo se pronuncia...?\tHow do you pronounce...?\t\n¿Cómo se escribe...?\tHow do you write...?\t\n¿Cómo se traduce...?\tHow do you translate...?\t\n¿Qué significa?\tWhat does it mean...?\t\n(Yo) no sé.\tI don't know.\t\n(Yo) no comprendo.\tI don't understand.\t\n(Yo) no puedo.\tI can't.\t\n(Yo) no recuerdo.\tI don't remember.\t\nSe me olvidó.\tI forgot.\t\n\t\nFavors and Courtesies\t\n¿Cómo?\tWhat?\t\n¡Un momento!\tWait a moment!\t\n¡Más despacio!\tSlower!\t\n¡Repita!\tAgain!\t\nPor favor.\tPlease.\t\nGracias.\tThank you.\t\nDe nada.\tYour welcome.\t\nDispense usted.\tExcuse me. (To get someone's attention)\t\nPerdón. Lo siento.\tExcuse me. I'm sorry.\t\nSí/No.\tYes/No.\t\nEstá bien.\tAll right.\t\nNo importa.\tNevermind.\t\nQuizá.\tPerhaps.\t\nDepende.\tIt depends.\t\n\t\nDays of the week\t\nLunes\tMonday\t\nMartes\tTuesday\t\nMiécoles\tWednesday\t\nJueves\tThursday\t\nViernes\tFriday\t\nSábado\tSaturday\t\nDomingo\tSunday\t\n¿Qué día es?\tWhat day is it?\t\nHoy es...\tToday is...\t\nMañana será...\tTomorrow will be...\t\nAyer fue...\tYesterday was...\t\n\t\nNumbers\t\nCero\tZero\t\nUno\tOne\t\nDos\tTwo\t\nTres\tThree\t\nCuatro\tFour\t\nCinco\tFive\t\nSeis\tSix\t\nSiete\tSeven\t\nOcho\tEight\t\nNueve\tNine\t\nDiez\tTen\t\nOnce\tEleven\t\nDoce\tTwelve\t\nTrece\tThirteen\t\nCatorce\tFourteen\t\nQuince\tFifteen\t\nDieciséis\tSixteen\t\nDiecisiete\tSeventeen\t\nDieciocho\tEighteen\t\nDiecinueve\tNineteen\t\nVeinte\tTwenty\t\nVeintiuno\tTwenty one\t\nVeintidós\tTwenty two\t\nVeintitrés\tTwenty three\t\nVeinticuatro\tTwenty four\t\nVeinticinco\tTwenty five\t\nVeintiséis\tTwenty six\t\nVeintisiete\tTwenty seven\t\nVeintiocho\tTwenty eight\t\nVeintinueve\tTwenty nine\t\nTreinta\tThirty\t\nCuarenta\tForty\t\nCincuenta\tFifty\t\nSesenta\tSixty\t\nSetenta\tSeventy\t\nOchenta\tEighty\t\nNoventa\tNinety\t\nCien\tOne hundred\t\n\t\nPeople\t\nEl muchacho\tThe boy\t\nLa muchacha\tThe girl\t\nEl alumno\tThe student (boy)\t\nLa alumna\tThe student (girl)\t\nEl compañero (de clase)\tThe classmate (boy)\t\nLa compañera (de clase)\tThe classmate (girl)\t\nEl profesor\tThe teacher (male)\t\nLa profesora\tThe teacher (female)\t\nEl director\tThe principal \t\nLa secretaria\tThe secretary \t\n\t\nThings\t\nEl libro\tThe book\t\nLa Biblia\tThe Bible\t\nEl diccionario\tThe dictionary\t\nLa enciclopedia\tThe encyclopidia\t\nEl periódico\tThe newspaper\t\nLa revista\tThe magazine\t\nEl Cuademo\tThe note book\t\nLa tarea\tThe assignment\t\nEl disco\tThe record\t\nLa cinta\tThe tape\t\nEl bolígrafo\tThe ballpoint\t\nLa pluma\tThe pen\t\nEl lápiz\tThe pencil\t\nLa tiza\tThe chalk\t\nEl borrador\tThe chalk eraser\t\nLa goma\tThe rubber eraser\t\nEl papel\tThe paper\t\nLa tinta\tThe ink\t\nEl dibujo\tThe drawing\t\nLa palabra\tThe word\t\n\t\nRequests\t\n(Yo) necesito...\tI need...\t\n(Yo) tengo...\tI have...\t\n(Yo) quiero...\tI want...\t\nPásame...\tPass me...\t\nAqui esta...\tHere is...\t\n\t\nPlaces\t\nen\tIn, at\t\nen, sobre\ton\t\ncon\tWith\t\na\tTo\t\nde\tFrom\t\nel baño\tThe bathroom\t\nla biblioteca\tthe library\t\nla oficina\tthe office\t\nel gimnasio\tthe gym\t\nla cafetería\tthe cafeteria\t\nla sala de clase\tThe classroom\t\nel laboratorio\tThe laboratory\t\nel auditorio\tthe auditorium\t\nel ropero\tthe locker\t\nel campo atlético\tthe athletic field\t\n\t\nIn the classroom\t\nla puerta\tDoor\t\nla ventana\tWindow\t\nla pared\tWall\t\nla pizarra\tChalkboard\t\nel suelo\tFloor\t\nel rincón\tCorner\t\nla mesa\tTable\t\nla silla\tChair\t\nel pupitre\tDesk\t\nel cesto\tWastebasket\t\nel reloj\tClock\t\nla luz \tLight\t\n\t\nTimes and Classes\t\nA las nueve\tAt 9:00\t\nA las diez\tAt 10:00\t\nA las once\tAt 11:00\t\nA las dos\tAt 12:00\t\nLenguas (extranjeras)\t(Foreign) languages\t\nEspañol\tSpanish\t\nFrancés\tFrench\t\nAlemán\tGerman\t\nItaliano\tItalian\t\nArte\tArt\t\nCoro\tChoir\t\nDrama\tDrama\t\nMecanografía\tTyping\t\nEducación física\tPhysical education\t\n\t\nCourses\t\nBiblia\tBible\t\nInglés\tEnglish\t\nHistoria\tHistory\t\nInstrucción cívica\tCivics\t\nCiencia\tScience\t\nBiología \tBiology\t\nQuímica\tChemistry\t\nFísica\tPhysics\t\nMatemáticas\tMathematics\t\nÁlgebra\tAlgebra\t\nGeometría\tGeometry\t\nCálculo\tCalculus\t\n\t\nWeather\t\n¿Qué tiempo hace?\tWhat's the weather like?\t\nHace buen (mal) tiempo\tIt's good (bad) weather\t\nHace (mucho) frio\tIt's (very) cold\t\nHace fresco\tIt's cool\t\nHace (mucho) calor\tIt's (very) warm\t\nHace (mucho) viento\tIt's (very) windy\t\nLas estaciones\tThe seasons\t\nInvierno\tWinter\t\nPrimavera\tSpring\t\nVerano\tSummer\t\nOtoño\tFall\t\n\t\nThe months\t\n¿Cuál es la fecha?\tWhat's the date?\t\nEnero\tJanuary\t\nFebrero\tFebruary\t\nMarzo\tMarch\t\nAbril\tApril\t\nMayo\tMay\t\nJunio\tJune\t\nJulio\tJuly\t\nAgosto\tAugust\t\nSeptiembre\tSeptember\t\nOctubre\tOctober\t\nNoviembre\tNovember\t\nDiciembre\tDecember\t\n\t\nActions\t\n¿Qué pasa?\tWhat's happening?\t\nNecesito...\tI need...\t\nTengo que...\tI have to...\t\nPrefiero...\tI prefer...\t\nPuedo...\tI am able (can)...\t\nPresentar\tTo present\t\nPreparar\tTo prepare\t\nPracticar\tTo practice\t\nPronunciar\tTo pronounce\t\nRecitar\tTo recite\t\n\t\nActivities\t\nEstudiar\tTo study\t\nCopiar\tTo copy\t\nImitar\tTo imitate\t\nEnseñar\tTo teach\t\nRepasar\tTo review\t\nUsar\tTo use\t\nMirar\tTo look at\t\nEscuchar\tTo listen to\t\nHablar\tTo talk\t\nPreguntar\tTo ask\t\nContestar\tTo answer\t\nExplicar\tTo explain\t\n\t\nWhen?', 'Where?', 'How?', and 'Why?' words\t\nahora\tNow\t\npronto\tSoon\t\nmàs tarde\tLater on\t\npor la mañana\tIn the morning\t\npor la tarde\tIn the afternoon\t\npor la noche\tIn the evening\t\naquí\there\t\nallí, ahí\tthere\t\nmàs allà\tfarther away\t\nen casa\tAt home\t\nen la escuela\tAt school\t\nen la iglesia\tAt church\t\nbien\tWell\t\ncon cuidado\tCarefully\t\nclaramente\tClearly\t\njuntos\tTogether\t\nen voz alta\tAloud\t\nmal\tPoorly\t\nràpidamente\tRapidly\t\ncorrectamente\tCorrectly\t\nsolo\tAlone\t\nen voz baja\tSoftly\t\nes bueno\tIt's good\t\nes malo\tIt's bad\t\nes fàcil\tIt's easy\t\nes difícil\tIt's hard\t\nes importante\tIt's important\t\nes interesante\tIt's interesting\t\nes necesario\tIt's necessary\t\nes divertido\tIt's fun\t\nes ùtil\tIt's helpful\t\nes ridículo\tIt's ridiculous\t\n\t\nClothes (Men's)\t\nUsted Necesita\tYou need\t\nUsted Tiene\tYou have\t\nUsted Quiere\tYou want\t\nUsted Prefiere\tYou prefer\t\nUsted Lleva\tYou wear\t\nEl sombrero\tThe hat\t\nLa camisa\tThe shirt\t\nLa corbata\tThe tie\t\nLos pantalones\tThe pants\t\nEl cinturón\tThe belt\t\nLos zapatos\tThe shoes\t\nLos calcetines\tThe socks\t\nEl suéter\tThe sweater\t\nLa chaqueta\tThe jacket\t\nLa cartera\tThe wallet\t\n\t\nClothes (women's)\t\nla bufanda\tThe scarf\t\nla blusa\tThe blouse\t\nla falda\tThe skirt\t\nel vestido\tThe dress\t\nel abrigo\tThe coat\t\nlas sandalias\tThe sandals\t\nlas botas\tThe boots\t\nel impermeable\tThe raincoat\t\nel paraguas\tThe umbrella\t\nla bolsa\tThe purse\t\n\t\nThe type and style\t\nalgo\tsomething\t\nnada\tnothing\t\nmas\tmore\t\nmenos\tless\t\ntan\tas\t\nnuevo(a)\tnew\t\nviejo(a)\told\t\ncaro(a)\texpensive\t\nbarato(a)\tinexpensive\t\nbonito(a)\tpretty\t\nfeo(a)\tegly\t\nde moda\tstylish\t\npasado(a) de moda\told-fashioned\t\ncasual, informal\tcasual\t\nelegante\tdressy\t\n\t\nThe color\t\nclaro(a)\tlight\t\nabscuro(a)\tdark\t\nblanco(a)\twhite\t\nnegro(a)\tblack\t\nrojo(a)\tred\t\nrosa\tpink\t\nanaranjado(a)\torange\t\namarillo\tyellow\t\ncafé\tbrown\t\nverde\tgreen\t\nazul\tblue\t\ngris\tgray\t\n\t\nShopping\t\nUsted necesita\tYou need\t\nUsted tiene\tYou have\t\nUsted quiere\tYou want\t\nUsted prefiere\tYou prefer\t\nUsted puede\tYou are able\t\nbuscar\tTo look for\t\nesperar\tTo lwait for\t\ntomar\tTo take\t\nenseñar\tTo show\t\ncomprar\tTo buy\t\nmandar\tTo send\t\nllevar\tTo take along, wear\t\ndejar\tTo leave behind\t\nguardar\tTo keep\t\ncambriar\tTo (ex)change\t\n\t\nQuality and Size\t\n(¿Qué tal?) ¿Le gusta?\t(How) Do you like it?\t\n(¿Qué tal?) ¿Le queda?\t(How) does it fit you?\t\n¿Qué talla es?\tWhat size is it? (Clothes)\t\n¿Qué número son?\tWhat size are they? (shoes)\t\n¿Qué marca es?\tWhat brand is it?\t\n¿De Qué material (tela) es?\tWhat material is it?\t\n¡Me gusta (mucho)!\tI like it (a lot)!\t\n¡me queda (bien)!\tIt fits me (well)!\t\n¡Me queda grande!\tIt's too big!\t\n¡Me queda pequeño!\tIt's too small!\t\n¡Me queda largo(a)!\tIt's too long!\t\n¡Me queda corto(a)!\tIt's too short!\t\n\t\nWhich one(s)?\t\nEl primero (La primera)\tThe first one\t\nEl segundo (La segunda)\tThe second one\t\nEl tercero (la tercera)\tThe third one\t\nEl proximo (La proxima)\tThe next one\t\nEl último (La última)\tThe last one\t\nEl único (La única)\tThe only one\t\nEl/la mejor \tThe best one\t\nEl/la peor\tThe worst one\t\nEl mismo (la misma)\tThe same one\t\nEl otro (La otra)\tThe other one\t\nLos/las dos\tBoth\t\nNinguno\tNeither\t\n\t\nQuantity and Measurement\t\n¿Cuántos? / ¿Cuantas?\tHow many?\t\nTodos/todas\tAll\t\nmuchos/muchas\tMany\t\nalgunos/algunas\tSome\t\npocos/pocas\tFew\t\nninguno/ninguna\tNone\t\n¿Cuánto? / ¿Cuánta?\tHow much?\t\ncasi (una yarda)\tAlmost (a yard)\t\nsòlo (una yarda)\tOnly (a yard)\t\nmás de (una yarda)\tMore than (a yard)\t\nmenos de (una yarda)\tLess than (a yard)\t\nmás o menos (una yarda)\tAbout/roughly (a yard)\t\n\t\nPrice: How much is it?\t\nDiez\tTen\t\nVeinte\tTwenty\t\nTreinta\tThirty\t\nCuarenta\tForty\t\nCincuenta\tFifty\t\nSesenta\tSixty\t\nSetenta\tSeventy\t\nOchenta\tEighty\t\nNoventa\tNinety\t\nCiento\tOne hundered\t\n\t\n-er Verbs\t\nUsted va a..\tYou are going.\t\nusted debe..\tYou are supposed...\t\nusted sabe..\tYou know how...\t\nLe gusta...\tYou like...\t\nse le olvidó...\tYou forgot.\t\ncomprender (comprendo)\tTo understand\t\naprender (aprendo)\tTo learn\t\ncomer (como)\tTo eat\t\nbeber (bebo)\tTo drink\t\nvender (vendo)\tTo sell\t\nescoger (escojo)\tTo choose\t\nver (veo)\tTo see\t\ncreer (creo)\tTo believe\t\nleer (leo)\tTo read\t\nresponder (respondo)\tTo respond\t\n\t\nHow often/long?\t\nsiempre\tAlways\t\nmuchas veces\tOften\t\na veces\tSometimes\t\nrara vez\tRarely\t\nnunca\tNever\t\ntoda la mañana\tAll morning\t\ntoda la tarde\tAll afternoon\t\ntodo el día\tAll day\t\ntoda la noche\tAll night\t\ntodo el tiempo\tAll the time\t\n\t\n-ir Verbs\t\nescribir (escribo)\tTo write\t\nvivir (vivo)\tTo live\t\nabrir (abro)\tTo open\t\ndecidir (decido)\tTo decide\t\npermitir (permito )\tTo permit\t\nrecibir (recibo)\tTo receive\t\nasistir (asisto)\tTo attend\t\ncubrir (cubro)\tTo cover\t\ndescubrir (descubro)\tTo discover\t\nprohibir (prohíbo)\tTo prohibit\t\n\t\nWhen?\t\nmuy temprano por la mañana\tEarly in the morning)\t\ntemprano\tEarly (ahead of time)\t\na tiempo\tOn time\t\ntarde\tLate (behind time)\t\nmuy tarde por la noche\tLate (at night)\t\nantes de la escuela)\tBefore (school)\t\nal principio de la escuela)\tAt the beginning of (school)\t\ndurante (la escuela)\tDuring (school)\t\nal fin de (la escuela)\tAt the end of (school)\t\ndespués de la escuela)\tAfter (school)\t\n\t\nFamily\t\nLa familia\tThe Family\t\nel padre\tFather\t\nla madre\tMother\t\nel hermano\tBrother\t\nla hermana\tSister\t\nel abuelo\tGrandfather\t\nla abuela\tGrandmother\t\nel tío\tUncle\t\nla tía\tAunt\t\nel primo\tCousin (boy)\t\nla prima\tCousin (girl)\t\nel hombre\tMan\t\nla mujer\tWoman\t\nel esposo\tHusband\t\nla esposa\tWife\t\nel hijo\tSon\t\nla hija\tDaughter\t\nlos hijos\tChildren (by relation)\t\nlos niños\tChildren (by age)\t\nlos padres\tParents\t\nlos parientes\tReletives\t\n\t\nPersonal Characteristics\t\nalguien\tSomebody\t\nnadie\tNobody\t\nmuy, bastante\tQuite\t\nalgo\tSomewhat\t\npoco, no muy\tNot very\t\njóven\tYoung\t\nViejo (a)\tOld\t\nrico (a)\tRich\t\npobre\tPoor\t\nfuerte\tStrong\t\ndébil\tWeak\t\nsimpático (a)\tNice\t\nantipático (a)\tMean\t\ndiligente\tDiligent\t\nperezoso (a)\tLazy\t\n\t\nPhysical appearance\t\nalto (a)\tTall\t\nmediano (a)\tMédium height\t\nbajo (a)\tShort\t\ngordo (a)\tFat\t\nDelgado (a)\tSlender\t\nflaco (a)\tSkinny\t\nrubio (a)\tBlond\t\ncastaño (a)\tBrown-haired\t\nMoreno (a)\tDark-haired\t\nde ojos azules\tBlue-eyed\t\nde ojos verdes\tGreen-eyed\t\nde ojos cafés\tBrown-eyed\t\nguapo\tHandsome\t\nhermosa\tBeautiful\t\nmás o menos (regular)\tAverage (so-so)\t\n\t\nThe Family: Personal History\t\n¿Cuál es su apellido?\tWhat's your last name?\t\nMi apellido es..\tMy last name is...\t\n¿Cuál es su dirección?\tWhat's your address?\t\nMi dirección es...\tMy address is...\t\n¿Cuál es su número de teléfono?\tWhat's your telephone number?\t\nMi número de teléfono es...\tMy telephone number is...\t\n¿De dónde es usted?\tWhere are you from?\t\nSoy de...\tI'm from...\t\n¿Cuántos años tiene usted?\tHow old are you?\t\nYo tengo... años\tI am.. years old\t\n\t\nThe Family: What's happening? (Z verbs)\t\nnacer (nazco)\tTo be born\t\ncrecer (crezco)\tTo grow\t\nconocer (conozco)\tTo know (be acquainted with)\t\nreconocer (reconozco)\tTo recognize\t\nobedecer (obedezco)\tTo obey\t\ndesobedecer (desobedezco)\tTo disobey\t\nofrecer (ofrezco)\tTo offer\t\nmerecer (merezco)\tTo merit (deserve)\t\naparecer (aparezco)\tTo appear (show up)\t\ndesaparecer (desaparezco)\tTo disappear\t\n\t\nChapter 18\t\nla cama\tThe bed\t\nla cobija\tThe blanket\t\nla cómoda (el tocador)\tThe dresser\t\nel cajón\tThe drawer\t\nel armario\tThe closet\t\nel lavamanos\tThe washstand (sink)\t\nel espejo\tThe mirror\t\nel baño\tThe bathtub\t\nla ducha\tThe shower\t\nel excusado\tThe toilet\t\nel refrigerador\tThe refrigerator\t\nla estufa\tThe stove\t\nel horno\tThe oven\t\nel fregadero\tThe sink\t\nla alacena\tThe cupboard\t\nla hierba\tThe grass\t\nel césped (el pasto)\tThe lawn\t\nlas flores\tThe flowers\t\nlos arbustos\tThe bushes\t\nlos árboles\tThe trees\t\n\t\nChapter 19\t\nel sofa\tThe sofa\t\nel sillón\tThe armchair\t\nla mesita para café\tThe coffee table\t\nel estante\tThe bookshelf\t\nla lámpara\tThe lamp\t\nel televisor\tThe television set\t\nel radio\tThe radio\t\nel tocadiscos\tThe record player\t\nel piano\tThe piano\t\nel teléfono\tThe telephone\t\nla alfombra\tThe rug\t\nlas cortinas\tThe curtains\t\nel cuadro\tThe picture\t\nel florero\tThe vase\t\nel calentador\tThe heater\t\nen, dentro de\tInside\t\nfuera de\tOutside\t\ncerca de\tNear\t\nlejos de\tFar from\t\ndelante de\tIn front of\t\ndetrás de\tIn back of\t\nencima de, sobre\tOn top of\t\ndebajo de, bajo\tUnderneath\t\nal lado de\tOn the side of\t\nentre\tBetween\t\n\t\nIrregular Verbs\t\nEstar (estoy)\tto be (temporary, location)\t\nSer (soy) \tto be (permanant, trait)\t\nDar (doy)\tto give\t\nIr (voy)\tto go\t\nVer (veo)\tto see\t\nSaber (sé)\tto know\t\n\t\n",g=n("DZ/V"),v=function(t){var e=Object(a.useRef)(Object(i.a)()),n=Object(a.useState)("web"!==r.c.OS),u=n[0],d=n[1];if(!u){return o.a.createElement(r.h,null,o.a.createElement(g.a,{languange:"en",speechService:e.current}),o.a.createElement(g.a,{languange:"es",speechService:e.current}),o.a.createElement("div",{onClick:function(){return e.current.speak("Start"),void d(!0)}},o.a.createElement(r.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},o.a.createElement(r.e,{style:{fontSize:36}},"Start"))))}return o.a.createElement(l.EducationalGame_StarBlastSideways,{problemService:Object(s.a)(Object(c.a)(b({speechService:e.current}),{}),"ProblemsSpanish")})}}}]);
//# sourceMappingURL=28-821968c26d9afb172704.js.map