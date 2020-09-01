import { createDefinitionProblemService, parseDefinitionDocument } from './definition-problem-service';

export const createSpanishProblemService = () => {
    const def = parseDefinitionDocument(document);
    return createDefinitionProblemService({ definitions: def });
};

const document = `
 	
¿Cómo se llama usted?	What's your name?	
¿Cómo se llama su padre?	What's your father's name?	
¿Cómo se llama su madre?	What's your mother's name?	
¿Cómo se llama su amigo(a)?	What's your friend's name?	
Mucho gusto.	It's a pleasure.	
Me llamo...	My name is...	
Se llama...	His/Her name is...	
El gusto es mío.	The pleasure is mine.	
Adiós.	Goodbye.	
Hasta mañana.	Until tomorrow.	
Hasta luego.	Until then.	
Hasta la vista.	Until we see (again).	
Con permiso.	Excuse me. (Said on leaving a group)	
	
Greetings	
Buenos días, Señor...	Good morning, Mr...	
Buenas tardes, Señora...	Good afternoon, Mrs...	
Buenas noches, Señorita...	Good evening, Ms...	
¡Hola!	Hi!	
¡Oye!	Hey!	
¿Cómo está usted?	How are you?	
¿Cómo está su padre?	How is your father?	
¿Cómo está su madre?	How is your mother?	
¿Cómo está su familia?	How is your family?	
¿Qué hay de nuevo?	What's new?	
Muy bien.	Very fine/good.	
Así-así.	So-so	
Mal.	Ill.	
Mejor.	Better.	
Nada de particular.	Nothing much.	
	
Questions and Answers	
¿Cómo se dice...?	How do you say...?	
¿Cómo se pronuncia...?	How do you pronounce...?	
¿Cómo se escribe...?	How do you write...?	
¿Cómo se traduce...?	How do you translate...?	
¿Qué significa?	What does it mean...?	
(Yo) no sé.	I don't know.	
(Yo) no comprendo.	I don't understand.	
(Yo) no puedo.	I can't.	
(Yo) no recuerdo.	I don't remember.	
Se me olvidó.	I forgot.	
	
Favors and Courtesies	
¿Cómo?	What?	
¡Un momento!	Wait a moment!	
¡Más despacio!	Slower!	
¡Repita!	Again!	
Por favor.	Please.	
Gracias.	Thank you.	
De nada.	Your welcome.	
Dispense usted.	Excuse me. (To get someone's attention)	
Perdón. Lo siento.	Excuse me. I'm sorry.	
Sí/No.	Yes/No.	
Está bien.	All right.	
No importa.	Nevermind.	
Quizá.	Perhaps.	
Depende.	It depends.	
	
Days of the week	
Lunes	Monday	
Martes	Tuesday	
Miécoles	Wednesday	
Jueves	Thursday	
Viernes	Friday	
Sábado	Saturday	
Domingo	Sunday	
¿Qué día es?	What day is it?	
Hoy es...	Today is...	
Mañana será...	Tomorrow will be...	
Ayer fue...	Yesterday was...	
	
Numbers	
Cero	Zero	
Uno	One	
Dos	Two	
Tres	Three	
Cuatro	Four	
Cinco	Five	
Seis	Six	
Siete	Seven	
Ocho	Eight	
Nueve	Nine	
Diez	Ten	
Once	Eleven	
Doce	Twelve	
Trece	Thirteen	
Catorce	Fourteen	
Quince	Fifteen	
Dieciséis	Sixteen	
Diecisiete	Seventeen	
Dieciocho	Eighteen	
Diecinueve	Nineteen	
Veinte	Twenty	
Veintiuno	Twenty one	
Veintidós	Twenty two	
Veintitrés	Twenty three	
Veinticuatro	Twenty four	
Veinticinco	Twenty five	
Veintiséis	Twenty six	
Veintisiete	Twenty seven	
Veintiocho	Twenty eight	
Veintinueve	Twenty nine	
Treinta	Thirty	
Cuarenta	Forty	
Cincuenta	Fifty	
Sesenta	Sixty	
Setenta	Seventy	
Ochenta	Eighty	
Noventa	Ninety	
Cien	One hundred	
	
People	
El muchacho	The boy	
La muchacha	The girl	
El alumno	The student (boy)	
La alumna	The student (girl)	
El compañero (de clase)	The classmate (boy)	
La compañera (de clase)	The classmate (girl)	
El profesor	The teacher (male)	
La profesora	The teacher (female)	
El director	The principal 	
La secretaria	The secretary 	
	
Things	
El libro	The book	
La Biblia	The Bible	
El diccionario	The dictionary	
La enciclopedia	The encyclopidia	
El periódico	The newspaper	
La revista	The magazine	
El Cuademo	The note book	
La tarea	The assignment	
El disco	The record	
La cinta	The tape	
El bolígrafo	The ballpoint	
La pluma	The pen	
El lápiz	The pencil	
La tiza	The chalk	
El borrador	The chalk eraser	
La goma	The rubber eraser	
El papel	The paper	
La tinta	The ink	
El dibujo	The drawing	
La palabra	The word	
	
Requests	
(Yo) necesito...	I need...	
(Yo) tengo...	I have...	
(Yo) quiero...	I want...	
Pásame...	Pass me...	
Aqui esta...	Here is...	
	
Places	
en	In, at	
en, sobre	on	
con	With	
a	To	
de	From	
el baño	The bathroom	
la biblioteca	the library	
la oficina	the office	
el gimnasio	the gym	
la cafetería	the cafeteria	
la sala de clase	The classroom	
el laboratorio	The laboratory	
el auditorio	the auditorium	
el ropero	the locker	
el campo atlético	the athletic field	
	
In the classroom	
la puerta	Door	
la ventana	Window	
la pared	Wall	
la pizarra	Chalkboard	
el suelo	Floor	
el rincón	Corner	
la mesa	Table	
la silla	Chair	
el pupitre	Desk	
el cesto	Wastebasket	
el reloj	Clock	
la luz 	Light	
	
Times and Classes	
A las nueve	At 9:00	
A las diez	At 10:00	
A las once	At 11:00	
A las dos	At 12:00	
Lenguas (extranjeras)	(Foreign) languages	
Español	Spanish	
Francés	French	
Alemán	German	
Italiano	Italian	
Arte	Art	
Coro	Choir	
Drama	Drama	
Mecanografía	Typing	
Educación física	Physical education	
	
Courses	
Biblia	Bible	
Inglés	English	
Historia	History	
Instrucción cívica	Civics	
Ciencia	Science	
Biología 	Biology	
Química	Chemistry	
Física	Physics	
Matemáticas	Mathematics	
Álgebra	Algebra	
Geometría	Geometry	
Cálculo	Calculus	
	
Weather	
¿Qué tiempo hace?	What's the weather like?	
Hace buen (mal) tiempo	It's good (bad) weather	
Hace (mucho) frio	It's (very) cold	
Hace fresco	It's cool	
Hace (mucho) calor	It's (very) warm	
Hace (mucho) viento	It's (very) windy	
Las estaciones	The seasons	
Invierno	Winter	
Primavera	Spring	
Verano	Summer	
Otoño	Fall	
	
The months	
¿Cuál es la fecha?	What's the date?	
Enero	January	
Febrero	February	
Marzo	March	
Abril	April	
Mayo	May	
Junio	June	
Julio	July	
Agosto	August	
Septiembre	September	
Octubre	October	
Noviembre	November	
Diciembre	December	
	
Actions	
¿Qué pasa?	What's happening?	
Necesito...	I need...	
Tengo que...	I want...	
Prefiero...	I prefer...	
Puedo...	I am able (can)...	
Presentar	To present	
Preparar	To prepare	
Practicar	To practice	
Pronunciar	To pronounce	
Recitar	To recite	
	
Activities	
Estudiar	To study	
Copiar	To copy	
Imitar	To imitate	
Enseñar	To teach	
Repasar	To review	
Usar	To use	
Mirar	To look at	
Escuchar	To listen to	
Hablar	To talk	
Preguntar	To ask	
Contestar	To answer	
Explicar	To explain	
	
When?', 'Where?', 'How?', and 'Why?' words	
ahora	Now	
pronto	Soon	
màs tarde	Later on	
por la mañana	In the morning	
por la tarde	In the afternoon	
por la noche	In the evening	
aquí	here	
allí, ahí	there	
màs allà	farther away	
en casa	At home	
en la escuela	At school	
en la iglesia	At church	
bien	Well	
con cuidado	Carefully	
claramente	Clearly	
juntos	Together	
en voz alta	Aloud	
mal	Poorly	
ràpidamente	Rapidly	
correctamente	Correctly	
solo	Alone	
en voz baja	Softly	
es bueno	It's good	
es malo	It's bad	
es fàcil	It's easy	
es difícil	It's hard	
es importante	It's important	
es interesante	It's interesting	
es necesario	It's necessary	
es divertido	It's fun	
es ùtil	It's helpful	
es ridículo	It's ridiculous	
	
Clothes (Men's)	
Usted Necesita	You need	
Usted Tiene	You have	
Usted Quiere	You want	
Usted Prefiere	You prefer	
Usted Lleva	You wear	
El sombrero	The hat	
The camisa	The shirt	
La corbata	The tie	
Los pantalones	The pants	
El cinturón	The belt	
Los zapatos	The shoes	
Los calcetines	The socks	
El suéter	The sweater	
La chaqueta	The jacket	
La cartera	The wallet	
	
Clothes (women's)	
la bufanda	The scarf	
la blusa	The blouse	
la falda	The skirt	
el vestido	The dress	
el abrigo	The coat	
las sandalias	The sandals	
las botas	The boots	
el impermeable	The raincoat	
el paraguas	The umbrella	
la bolsa	The purse	
	
The type and style	
algo	something	
nada	nothing	
mas	more	
menos	less	
tan	as	
nuevo(a)	new	
viejo(a)	old	
caro(a)	expensive	
barato(a)	inexpensive	
bonito(a)	pretty	
feo(a)	egly	
de moda	stylish	
pasado(a) de moda	old-fashioned	
casual, informal	casual	
elegante	dressy	
	
The color	
claro(a)	light	
abscuro(a)	dark	
blanco(a)	white	
negro(a)	black	
rojo(a)	red	
rosa	pink	
anaranjado(a)	orange	
amarillo	yellow	
café	brown	
verde	green	
azul	blue	
gris	gray	
	
Shopping	
Usted necesita	You need	
Usted tiene	You have	
Usted quiere	You want	
Usted prefiere	You prefer	
Usted puede	You are able	
buscar	To look for	
esperar	To lwait for	
tomar	To take	
enseñar	To show	
comprar	To buy	
mandar	To send	
llevar	To take along, wear	
dejar	To leave behind	
guardar	To keep	
cambriar	To (ex)change	
	
Quality and Size	
(¿Qué tal?) ¿Le gusta?	(How) Do you like it?	
(¿Qué tal?) ¿Le queda?	(How) does it fit you?	
¿Qué talla es?	What size is it? (Clothes)	
¿Qué número son?	What size are they? (shoes)	
¿Qué marca es?	What brand is it?	
¿De Qué material (tela) es?	What material is it?	
¡Me gusta (mucho)!	I like it (a lot)!	
¡me queda (bien)!	It fits me (well)!	
¡Me queda grande!	It's too big!	
¡Me queda pequeño!	It's too small!	
¡Me queda largo(a)!	It's too long!	
¡Me queda corto(a)!	It's too short!	
	
Which one(s)?	
El primero (La primera)	The first one	
El segundo (La segunda)	The second one	
El tercero (la tercera)	The third one	
El proximo (La proxima)	The next one	
El último (La última)	The last one	
El único (La única)	The only one	
El/la mejor 	The best one	
El/la peor	The worst one	
El mismo (la misma)	The same one	
El otro (La otra)	The other one	
Los/las dos	Both	
Ninguno	Neither	
	
Quantity and Measurement	
¿Cuántos? / ¿Cuantas?	How many?	
Todos/todas	All	
muchos/muchas	Many	
algunos/algunas	Some	
pocos/pocas	Few	
ninguno/ninguna	None	
¿Cuánto? / ¿Cuánta?	How much?	
casi (una yarda)	Almost (a yard)	
sòlo (una yarda)	Only (a yard)	
más de (una yarda)	More than (a yard)	
menos de (una yarda)	Less than (a yard)	
más o menos (una yarda)	About/roughly (a yard)	
	
Price: How much is it?	
Diez	Ten	
Veinte	Twenty	
Treinta	Thirty	
Cuarenta	Forty	
Cincuenta	Fifty	
Sesenta	Sixty	
Setenta	Seventy	
Ochenta	Eighty	
Noventa	Ninety	
Ciento	One hundered	
	
-er Verbs	
Usted va a..	You are going.	
usted debe..	You are supposed...	
usted sabe..	You know how...	
Le gusta...	You like...	
se le olvidó...	You forgot.	
comprender (comprendo)	To understand	
aprender (aprendo)	To learn	
comer (como)	To eat	
beber (bebo)	To drink	
vender (vendo)	To sell	
escoger (escojo)	To choose	
ver (veo)	To see	
creer (creo)	To believe	
leer (leo)	To read	
responder (respondo)	To respond	
	
How often/long?	
siempre	Always	
muchas veces	Often	
a veces	Sometimes	
rara vez	Rarely	
nunca	Never	
toda la mañana	All morning	
toda la tarde	All afternoon	
todo el día	All day	
toda la noche	All night	
todo el tiempo	All the time	
	
-ir Verbs	
escribir (escribo)	To write	
vivir (vivo)	To live	
abrir (abro)	To open	
decidir (decido)	To decide	
permitir (permito )	To permit	
recibir (recibo)	To receive	
asistir (asisto)	To attend	
cubrir (cubro)	To cover	
descubrir (descubro)	To discover	
prohibir (prohíbo)	To prohibit	
	
When?	
muy temprano por la mañana	Early in the morning)	
temprano	Early (ahead of time)	
a tiempo	On time	
tarde	Late (behind time)	
muy tarde por la noche	Late (at night)	
antes de la escuela)	Before (school)	
al principio de la escuela)	At the beginning of (school)	
durante (la escuela)	During (school)	
al fin de (la escuela)	At the end of (school)	
después de la escuela)	After (school)	
	
Family	
La familia	The Family	
el padre	Father	
la madre	Mother	
el hermano	Brother	
la hermana	Sister	
el abuelo	Grandfather	
la abuela	Grandmother	
el tío	Uncle	
la tía	Aunt	
el primo	Cousin (boy)	
la prima	Cousin (girl)	
el hombre	Man	
la mujer	Woman	
el esposo	Husband	
la esposa	Wife	
el hijo	Son	
la hija	Daughter	
los hijos	Children (by relation)	
los niños	Children (by age)	
los padres	Parents	
los parientes	Reletives	
	
Personal Characteristics	
alguien	Somebody	
nadie	Nobody	
muy, bastante	Quite	
algo	Somewhat	
poco, no muy	Not very	
jóven	Young	
Viejo (a)	Old	
rico (a)	Rich	
pobre	Poor	
fuerte	Strong	
débil	Weak	
simpático (a)	Nice	
antipático (a)	Mean	
diligente	Diligent	
perezoso (a)	Lazy	
	
Physical appearance	
alto (a)	Tall	
mediano (a)	Médium height	
bajo (a)	Short	
gordo (a)	Fat	
Delgado (a)	Slender	
flaco (a)	Skinny	
rubio (a)	Blond	
castaño (a)	Brown-haired	
Moreno (a)	Dark-haired	
de ojos azules	Blue-eyed	
de ojos verdes	Green-eyed	
de ojos cafés	Brown-eyed	
guapo	Handsome	
hermosa	Beautiful	
más o menos (regular)	Average (so-so)	
	
The Family: Personal History	
¿Cuál es su apellido?	What's your last name?	
Mi apellido es..	My last name is...	
¿Cuál es su dirección?	What's your address?	
Mi dirección es...	My address is...	
¿Cuál es su número de teléfono?	What's your telephone number?	
Mi número de teléfono es...	My telephone number is...	
¿De dónde es usted?	Where are you from?	
Soy de...	I'm from...	
¿Cuántos años tiene usted?	How old are you?	
Yo tengo... años	I am.. years old	
	
The Family: What's happening? (Z verbs)	
nacer (nazco)	To be born	
crecer (crezco)	To grow	
conocer (conozco)	To know (be acquainted with)	
reconocer (reconozco)	To recognize	
obedecer (obedezco)	To obey	
desobedecer (desobedezco)	To disobey	
ofrecer (ofrezco)	To offer	
merecer (merezco)	To merit (deserve)	
aparecer (aparezco)	To appear (show up)	
desaparecer (desaparezco)	To disappear	
	
Chapter 18	
la cama	The bed	
la cobija	The blanket	
la cómoda (el tocador)	The dresser	
el cajón	The drawer	
el armario	The closet	
el lavamanos	The washstand (sink)	
el espejo	The mirror	
el baño	The bathtub	
la ducha	The shower	
el excusado	The toilet	
el refrigerador	The refrigerator	
la estufa	The stove	
el horno	The oven	
el fregadero	The sink	
la alacena	The cupboard	
la hierba	The grass	
el césped (el pasto)	The lawn	
las flores	The flowers	
los arbustos	The bushes	
los árboles	The trees	
	
Chapter 19	
el sofa	The sofa	
el sillón	The armchair	
la mesita para café	The coffee table	
el estante	The bookshelf	
la lámpara	The lamp	
el televisor	The television set	
el radio	The radio	
el tocadiscos	The record player	
el piano	The piano	
el teléfono	The telephone	
la alfombra	The rug	
las cortinas	The curtains	
el cuadro	The picture	
el florero	The vase	
el calentador	The heater	
en, dentro de	Inside	
fuera de	Outside	
cerca de	Near	
lejos de	Far from	
delante de	In front of	
detrás de	In back of	
encima de, sobre	On top of	
debajo de, bajo	Underneath	
al lado de	On the side of	
entre	Between	
	
Irregular Verbs	
Estar (estoy)	to be (temporary, location)	
Ser (soy) 	to be (permanant, trait)	
Dar (doy)	to give	
Ir (voy)	to go	
Ver (veo)	to see	
Saber (sé)	to know	
	
`;
