
export const getSpellingEntries = (): { word: string, mispellings: string[], wordGroup: { words: string[] } }[] => {

    const wordGroups = getWordGroups();

    const doc = spellingDoc;
    const lines = doc.split(`\n`).map(x => x.trim()).filter(x => x);
    const problems = lines.map(line => {
        const parts = line.split(`=`);
        const word = parts[0].trim();
        const mispellings = parts[1].split(` `).map(x => x.trim()).filter(x => x);

        const wordGroup = wordGroups.find(x => x.words.some(w => w === word)) ?? { words: [] };
        return { word, mispellings, wordGroup };
    });
    return problems;
};

const getWordGroups = (): { words: string[] }[] => {
    const doc = wordGroupsDoc;
    const lines = doc.split(`\n`).map(x => x.trim()).filter(x => x);
    const wordGroups = lines.map(line => {
        const words = line.split(` `).map(x => x.trim()).filter(x => x);
        return { words };
    });
    return wordGroups;
};

const spellingDoc = `
an = un aan aen ain aon aun ean een ein 
ban = ben ba bon baan baen bain baon baun bein 
and = und ond aand aend aind aond aund eand eend 
band = bund baand baend baind baond baund beand beend beind 
end = ond endd eend ennd und aand aend aind 
bend = bbend bendd beend bennd bund baand baend baind baond 
den = de dden deen denn dan daan daen dain 
men = mon meen mmen menn nmen mpen maan maen 
pump = pum pummp ppump pumpp puump punmp prump pamp 
bump = bbump bummp bumpp buump bunmp brump bamp 
dump = dum ddump dummp dumpp duump dunmp drump demp 
lump = llump lum lummp lumpp luump lunmp lrump 
test = ttest testt tost teest tesst tect tesct 
best = bestt bost bbest beest besst bect besct bext 
rest = rrest restt rost reest resst rect resct 
pest = pestt peest ppest pesst pect pesct pext pezt 
rap = rrap rup rop raap raep raip raop raup reep 
trap = trrap ttrap trep trup trop traap traep traip 
tramp = trramp ttramp tremp trimp traamp traemp traimp traomp 
rat = rrat ratt ret rit raat raet rait raot 
rib = rrib ribb riib reib wrib rinb rab reb 
rid = rrid ridd riid reid wrid rud raad raed raod 
rim = rrim riim rimm reim wrim rinm rimp rom 
drip = drrip ddrip driip dripp dreip dwrip drinp drap drep 
dust = dustt ddust dusst duust dusct drust duzt dast 
rust = rrust rustt ust russt ruust ruct rusct 
trust = trrust ttrust trustt tust trusst truust truct 
must = mustt mmust musst muust muct musct nmust mpust 
gag = geg gug gog gaag gaeg gaig gaog gaug 
bag = baag baeg baig baog baug beag beeg beig beog beug 
brag = brrag breg brug brog braag braeg braig braog 
nag = nig nug nog naag naeg naig naog naug 
did = ddid didd diid deid dind ded dod daad daed 
dim = ddim diim dimm deim dinm dimp dem dom 
dip = ddip diip dipp deip dinp dap dep dop 
din = di ddin diin dinn dein dan daan daen 
rub = rrub ub rubb ruub wrub rab runb 
shrub = shrrub shub shrubb shhrub sshrub shruub chrub schrub 
brush = brrush bbrush brushh brussh bruush bruch brusch bwrush 
rush = rrush ush rushh russh ruush ruch rusch wrush 
dot = dott ddot doot doet det dont dout duot dat 
rot = rrot rott roet wrot ret ront ruot 
trot = trrot ttrot trott troot troet twrot tret 
pot = pott poot ppot pont puot paat paet pait paot 
bet = bett bbet baat baet baot baut beit beot beut 
met = mett mmet nmet mpet mit ment mut maat 
pet = pett peet ppet paat paet pait paot paut 
net = nett neet nnet nat nent naat naet nait 
tent = ttent tentt tont tet teent tennt tnt tant 
bent = bentt bont bbent beent bennt bant bint 
rent = rrent rentt ront ret reent rennt wrent rint 
sent = sentt sont seent sennt ssent zent sant sint 
tint = ttint tintt tiint tinnt teint tnt tant 
mint = mintt mit miint mmint minnt meint nmint mpint 
lint = llint lintt liint linnt leint lant 
hint = hintt hhint hiint hinnt heint hant hent 
it = itt iit eit et ot ut aat aet 
bit = bitt bbit biit beit bint baat baet baot baut 
fit = fitt ffit fiit feit veit fint fet fot 
hit = hitt hhit hiit heit het haat haet hait 
vast = vastt vist vust vost vaast vaest vaist vaost 
mast = mastt mest maast maest maist maost maust meast meest 
past = pastt pist pust paast paest paist paost paust 
fast = fastt fust fost faast faest faist faost faust feest 
clad = slad sslad sclad cllad cled clid clud 
clam = sslam sclam cllam clem clim clum clom 
clap = sslap sclap cllap clep clup claap claep claip 
clamp = slamp sslamp sclamp cllamp clemp climp claamp claemp 
lap = llap lep lup laap laep laip laop laup 
flap = fllap flep flup flaap flaep flaip flaop flaup 
lamp = llamp lemp lomp laamp laemp laimp laomp laump leamp 
plan = pllan plen plin plun pla plon plaan 
dug = ddug dugg duug dudg daag daeg daig daog daug deag 
drug = drrug ddrug drugg druug dwrug drudg drung dreg 
rug = rrug ug rugg ruug wrug rudg rog raag 
mug = mugg mmug muug nmug mpug mrug mudg mig mog maag 
belt = bellt beltt bbelt beelt blet balt bilt benlt 
felt = fellt feltt folt feelt ffelt flet veelt falt 
melt = mellt meltt meelt mmelt mlet nmelt mpelt menlt 
pelt = pellt peltt polt peelt ppelt plet palt pilt 
inch = insh inssh insch ich incch inchh iinch innch einch 
chin = sshin schin cchin chhin chiin chinn chein chan chen 
finch = finsh finssh finsch fich fincch ffinch finchh fiinch finnch feinch 
pinch = pinsh pinssh pinsch pich pincch pinchh piinch pinnch ppinch peinch 
bound = buond boud bbound boundd bounnd boound bouund boeund borund boand 
round = ruond rond rround roud roundd rounnd roound rouund roeund 
pound = puond poud poundd pounnd poound ppound pouund poeund porund poand 
mound = muond mond moud moundd mmound mounnd moound mouund moeund nmound 
crab = srab ssrab scrab crrab creb crub crob craab 
cram = sram ssram crram crem crim crum crom 
cramp = sramp ssramp scramp crramp cremp crump cromp craamp 
scrap = ssrap sssrap sscrap scrrap screp scrup scrop scraap 
bunch = bunsh bunssh bunsch buch bbunch buncch bunchh bunnch buunch banch 
munch = munsh munssh munsch muncch munchh mmunch munnch muunch nmunch mpunch 
lunch = lunsh lunssh lunsch llunch luch luncch lunchh lunnch luunch 
punch = punsh punssh punsch puch puncch punchh punnch ppunch puunch prunch 
lot = llot lott loet lont luot lut laat laet 
blot = bllot blott bblot bloot bloet blet blont blout 
clot = sslot sclot cllot clott cclot cloot cloet clet 
plot = pllot plott ploot pplot ploet plet plont plout 
lag = llag lig laag laeg laig laog laug leag leeg 
flag = fllag fleg flig flug flaag flaeg flaig 
glad = gllad gled glid glud glod glaad glaed 
gland = glland glend glind glund glond glaand glaend 
stab = sttab steb stib stob staab staeb staib staob 
stand = sttand stend stind stund stad stond staand 
stamp = sttamp stam stemp stimp staamp staemp staimp staomp 
last = llast lastt laast laest laist laost laust leest leist leost 
cap = ssap scap cep cip caap caep caip caop 
camp = samp ssamp cemp cimp cump caamp caemp 
can = san ssan cen cin cun caan caen 
cat = ssat catt cet caat caet cait caot caut ceat 
sped = spod spedd spped ssped cped scped zped spad spid 
spend = spond spendd speend spennd sppend sspend cpend scpend zpend 
spent = spentt spont spet speent spennt sppent sspent cpent 
pets = petts peets ppets petss petc petsc petz pents 
van = ven vin vun va von vaan vaen 
ran = rran ren rin ra ron raan raen raon 
man = mon maan maen maon maun meen mein meon meun mian 
pan = pon paan paen paon paun pean pein peun pian pien 
led = eld lled lod ledd leed lud laad laed 
bled = beld blled blod bbled bledd blad blid 
fled = feld flled flod fledd fleed ffled veled flad flid 
sled = seld slled slod sledd sleed ssled cled scled 
trump = trrump ttrump trum tump trummp trumpp truump twrump 
plump = pllump plummp pplump plumpp pluump plunmp plrump plamp 
hump = hhump hummp humpp huump hunmp hrump hamp 
stump = sttump stum stummp stumpp sstump stuump ctump sctump 
in = iin ein un aan aen ain aon aun ean een 
fin = fi ffin fiin finn fein fon faan faen faon 
pin = piin pinn ppin pein pon paan paen paon paun 
tin = ttin tiin tinn tein taan taen tain taon 
rig = rrig rigg riig reig wrig ridg rog raag raeg 
grin = grrin gri ggrin griin grinn grein gwrin dgrin 
grit = grrit gritt ggrit griit greit gwrit dgrit grint 
trim = trrim ttrim triim trimm treim twrim trinm trimp 
drift = drrift driftt ddrift drifft driift dreift dwrift drivet 
gift = giftt gifft ggift giift geift givet dgift ginft gaft 
lift = llift liftt lifft liift leift livet linft laft 
thrift = thrrift tthrift thriftt thrifft thhrift thriift threift 
nip = niip nnip nipp neip ninp nep nop nup naap 
lip = llip liip lipp leip linp lep lup laap 
tip = ttip tiip tipp teip tinp tep tup taap 
trip = trrip ttrip triip tripp treip twrip trinp trep 
mount = muont mont mountt mout mmount mounnt moount mouunt moeunt 
count = cuont sount ssount scount countt cout ccount counnt coount 
county = cuonty conty sounty ssounty scounty countty couty ccounty counnty coounty 
bounty = buonty bonty bountty bouty bbounty bounnty boounty bouunty bountyy 
rob = rrob robb roob roeb wrob reb ronb roub ruob 
throb = thrrob tthrob throbb thhrob throob throeb thwrob threb 
rod = rrod rodd roed wrod rond roud ruod rud raad 
drop = drrop ddrop dropp droep dwrop drep dronp droup druop 
get = gett geet gget dget gat gaat gaet gaot 
let = elt llet lett leet lut laat laet lait 
fret = frret frett frot freet ffret fwret veret frit 
set = seet sset cet scet zet sut saat saet sait 
vest = vestt fst vost veest vesst vvest vect vesct 
nest = nestt nost neest nnest nesst nect nesct nezt 
test = ttest testt tost teest tesst tect tesct 
best = bestt bost bbest beest besst bect besct bext 
bun = bbun bunn buun brun ben bon baan baen bain 
fun = fu ffun funn fuun frun veun fon faan faen 
fund = fud fundd ffund funnd fuund frund veund fand 
gun = gu ggun gunn guun grun dgun gan gon 
gust = gustt ggust gusst guust guct gusct grust dgust 
thrust = thrrust tthrust thrustt thust thhrust thrusst thruust 
rust = rrust rustt ust russt ruust ruct rusct 
trust = trrust ttrust trustt tust trusst truust truct 
not = nott nnot noot noet nont nout nuot nat naat 
got = gott ggot goot goet dgot gont guot gat gaat 
hot = hott hhot hoet het hont hout huot haat 
shot = shott shhot sshot shoet chot schot zhot shet 
land = lland lind lund lond laand laend laind laond 
plant = pllant plantt plent plint plunt plont plaant 
plan = pllan plen plin plun pla plon plaan 
gland = glland glend glind glund glond glaand glaend 
map = mep mip mup maap maep maip maop 
nap = nep nup nop naap naep naip naop naup 
tap = ttap tep tup taap taep taip taop taup 
rap = rrap rup rop raap raep raip raop raup reep 
found = fuond foud foundd ffound founnd foound fouund foeund forund veound 
hound = huond hond houd houndd hhound hounnd hoound houund hoeund horund 
sound = suond sond soud soundd sounnd soound ssound souund soeund cound 
ground = gruond grond grround groud groundd gground grounnd groound grouund 
ten = tten te tenn taan taen tain taon taun 
tenth = ttenth tentth tonth teth teenth tenthh tennth tnth 
tent = ttent tentt tont tet teent tennt tnt tant 
blast = bllast blastt blest blist blust blost blaast 
last = llast lastt laast laest laist laost laust leest leist leost 
mast = mastt mest maast maest maist maost maust meast meest 
past = pastt pist pust paast paest paist paost paust 
tan = ttan taan taen tain taon taun tean tein teon teun 
fan = fon faan faen faon fean feen fein feon feun fian 
brand = brrand brend brind brund brond braand braend 
an = un aan aen ain aon aun ean een ein 
plum = pllum plumm pplum pluum plunm plrum plam 
lump = llump lum lummp lumpp luump lunmp lrump 
plump = pllump plummp pplump plumpp pluump plunmp plrump plamp 
ring = rring ringg riing rinng reing rindg reng 
bring = brring bbring bringg briing brinng breing bwring brindg 
spring = sprring springg spriing sprinng sppring sspring spreing cpring 
string = strring sttring strig stringg striing strinng sstring streing 
wit = witt wiit wwit weit wint wat wut waat 
twig = ttwig twigg twiig twwig tweig twidg twing twag tweg 
twist = ttwist twistt twiist twisst twwist tweist twict 
swift = swiftt swifft swiift sswift swwift sweift cwift scwift 
send = sond sed sendd seend sennd ssend cend scend zend 
blend = belnd bllend bblend blendd bleend blennd blund blaand 
end = ond endd eend ennd und aand aend aind 
bend = bbend bendd beend bennd bund baand baend baind baond 
east = ast eastt eest eist eust oast eost 
beast = beastt beest beist beust beost beaast beaest 
feast = feastt feest feist feust foast feost feaast 
least = elast lleast leastt leest leist leust loast leost 
print = prrint printt prit priint prinnt pprint preint pwrint 
tint = ttint tintt tiint tinnt teint tnt tant 
mint = mintt mit miint mmint minnt meint nmint mpint 
lint = llint lintt liint linnt leint lant 
dandy = dendy dindy dundy dady dondy daandy daendy 
handy = hendy hindy hundy hady hondy haandy haendy 
hunch = hunsh hunssh hunsch huch huncch hhunch hunchh hunnch huunch hrunch 
bunch = bunsh bunssh bunsch buch bbunch buncch bunchh bunnch buunch banch 
munch = munsh munssh munsch muncch munchh mmunch munnch muunch nmunch mpunch 
lunch = lunsh lunssh lunsch llunch luch luncch lunchh lunnch luunch 
eat = eatt eet eit eut eot eaat eaet 
beat = beatt beit beut beot beaat beaet beait beaot 
treat = trat trreat ttreat treatt treet treit treut troat 
meat = meatt meit meut meot meaat meaet meait meaot 
stint = sttint stintt stit stiint stinnt sstint steint ctint 
midst = midstt middst miidst mmidst midsst meidst midct midsct 
strip = strrip sttrip striip stripp sstrip streip ctrip 
list = llist listt liist lisst leist lict lisct 
each = ach eash eassh easch eech eich euch oach 
reach = rach reash reassh reasch rreach reech reich reuch 
peach = pach peash peassh peasch peech peich peuch peoch 
preach = prach preash preassh preasch prreach preech preich preuch proach 
bang = beng bing baang baeng baing baong baung beang 
rang = rrang reng rong raang raeng raing raong raung reang 
fang = feng fing fung fong faang faeng faing 
hang = heng hong haang haeng haing haong haung heang heeng 
dream = drream dreem dreim dreum droam dreom dreaam 
cream = sream ssream crream creem creim creum croam creom 
scream = ssream sssream sscream scrream screem screim screum scroam 
stream = stram strream sttream streem streim streum stroam streom 
pop = ppop popp poep ponp poup puop paap paep paip paop 
mop = mmop moop mopp moep nmop mpop mep monp moup muop 
hop = hhop hopp hoep honp houp huop hup haap haep haip 
chop = sshop schop cchop chhop choop chopp choep chep chonp choup 
big = bbig bigg biig beig bidg bing baag baeg baig baog 
dig = ddig digg diig deig didg daag daeg daig daog daug 
fig = ffig figg fiig feig veig fidg fing feg faag 
pig = pigg piig ppig peig pidg pag pog paag paeg 
sad = sed sid sud saad saed saod saud 
sap = sep saap saep saip saop saup seap seip seop 
sand = sind sund sond saand saend saind saond saund 
sat = satt sut saat saet sait saot saut seet seit 
wed = wod wedd wwed wid wud waad waed waid 
wet = wett weet wwet wat wut waat waet waot 
went = wentt weent wennt wwent wint wunt waant 
west = westt wost wesst wwest wect wesct wext wezt 
had = hed hud haad haed haid haod haud heid 
hand = hend hund hond haand haend haind haond haund 
ham = hom haam haem haim haom haum heam heem heim heom 
hag = heg hig haag haeg haig haog haug heag 
ranch = ransh ranssh ransch rranch rench rinch runch rach 
branch = bransh branssh bransch brranch brench brinch brach bronch 
blanch = blansh blanssh blansch bllanch blinch blunch blach blonch 
lid = llid lidd liid leid lind lod lud laad laed 
limp = llimp lim liimp limmp limpp leimp linmp 
blimp = bllimp blim bblimp bliimp blimmp blimpp bleimp blinmp 
lip = llip liip lipp leip linp lep lup laap 
run = rrun un ru runn ruun wrun ren 
drum = drrum dum ddrum drumm druum dwrum drunm drump 
rut = rrut rutt ut ruut wrut ret rit 
thrush = thrrush tthrush thush thhrush thrushh thrussh thruush thruch 
bed = bbed bedd beed baad baed baid baod beid beod 
red = rred redd wred rud raad raed raod raud reid 
fed = fod fedd ffed veed fid fud faad faed 
led = eld lled lod ledd leed lud laad laed 
romp = rromp rom rommp roomp rompp roemp wromp ronmp 
frog = frrog ffrog frogg froog froeg fwrog verog frodg freg 
frond = frrond frod frondd ffrond fronnd froond froend fwrond verond 
rod = rrod rodd roed wrod rond roud ruod rud raad 
clan = slan sslan sclan cllan clen clin clun cla 
clasp = slasp sslasp sclasp cllasp clesp clisp clusp closp 
clap = sslap sclap cllap clep clup claap claep claip 
clad = slad sslad sclad cllad cled clid clud 
bean = bein beun boan bea beon beaan beaen beain 
dean = dan deen dein deun doan dea deon 
mean = meen mein meun mea meon meaan meaen 
cot = ssot scot cott ccot coet cet cout cuot 
spot = spott spoot sppot sspot spoet cpot scpot zpot 
slot = sllot slott sloot sslot sloet sclot zlot 
lot = llot lott loet lont luot lut laat laet 
pug = pugg ppug puug prug pudg pag pung pog paag 
tug = ttug tugg tuug tudg tung teg tig taag taeg 
shrug = shrrug shug shrugg shhrug sshrug shruug chrug schrug 
rug = rrug ug rugg ruug wrug rudg rog raag 
old = olld oldd oold oeld eld onld ould uold ald 
mold = molld moldd mmold moold moeld nmold mpold monld mould 
sold = solld soldd soold ssold soeld zold seld sonld 
gold = golld goldd ggold goold goeld dgold gonld gould guold 
rain = rrain riin rai roin raain raein raiin raoin rauin 
brain = brrain brein briin brai broin braain braein braiin 
grain = grrain grein griin gruin grai graain graein 
train = trrain ttrain trein triin truin trai troin 
sit = sitt siit ssit seit scit sint sut saat 
its = itts iits itss eits itc itsc itz ints 
spit = spitt spiit sppit sspit speit cpit scpit zpit 
gush = ggush gushh gussh guush guch gusch grush dgush guzh 
blush = bllush bblush blushh blussh bluush bluch blusch blrush 
plush = pllush plushh pplush plussh pluush pluch plusch plrush 
flush = fllush fflush flushh flussh fluush fluch flusch flrush 
hum = hhum humm huum hunm hrum hom haam haem haim 
hut = hutt hhut huut hrut het haat haet hait haot 
hug = hugg hhug huug hrug hudg heg hig haag haeg haig 
hush = hhush hushh hussh huush huch husch hrush huzh hunsh 
saint = saintt seint siint suint sait soint saaint 
stain = sttain stiin stuin stai stoin staain staein staiin 
strain = strrain sttrain strein striin struin strai stroin 
at = att et ut ot aat aet ait aot 
pat = patt paat paet pait paot paut peet peit peot peut 
rat = rrat ratt ret rit raat raet rait raot 
tub = ttub tubb tuub trub tunb teb tib tob taab 
stunt = sttunt stuntt stut stunnt sstunt stuunt ctunt 
study = sttudy studdy sstudy stuudy studyy ctudy sctudy strudy 
tug = ttug tugg tuug tudg tung teg tig taag taeg 
bolt = bollt boltt bbolt boolt boelt bonlt boult buolt 
molt = mollt moltt mmolt moolt moelt nmolt mpolt monlt 
hold = holld holdd hhold hoold hoeld honld hould huold hald 
old = olld oldd oold oeld eld onld ould uold ald 
ever = everr efr evor eever eveer evver evar evewr 
never = neverr nefr nover nevor neever neveer nnever nevver nevar 
sever = severr sefr sover sevor seever seveer ssever sevver sevar 
every = everry efry overy evory eevery eveery evvery everyy evary 
oil = oill oiil ooil oeil eil oinl onil ouil 
boil = boill bboil boiil booil boeil beil boinl bonil 
foil = foill ffoil foiil fooil foeil veoil feil foinl 
broil = brroil broill bbroil broiil brooil broeil bwroil 
tactic = tastic tactis tasstic tactiss tasctic tactisc ttactic tacttic tectic tictic 
antic = antiss antisc anttic entic intic untic atic ontic 
frantic = frantis frantiss frantisc frrantic franttic frentic frintic fruntic fratic 
tactics = tastics tactiss tasstics tactisss tasctics tactiscs ttactics tacttics tectics tictics 
aunt = auntt eunt iunt uunt aut ount aaunt 
taunt = ttaunt tauntt teunt tiunt tuunt tount taaunt 
haunt = hauntt heunt hiunt huunt haut hount haaunt 
flaunt = fllaunt flauntt fleunt fliunt fluunt flaut flount 
heat = heatt heet heit heut hoat heot heaat 
cheat = sheat ssheat scheat cheatt cheet cheit cheut choat 
pleat = pelat plleat pleatt pleet pleit pleut ploat pleot 
eat = eatt eet eit eut eot eaat eaet 
brandy = brrandy brendy brindy brundy brady brondy braandy 
sandy = sendy sindy sundy sady sondy saandy saendy 
dandy = dendy dindy dundy dady dondy daandy daendy 
pod = podd pood ppod poed ped poud puod pid paad 
pond = pondd ponnd poond ppond poend puond pand pind pund 
pop = ppop popp poep ponp poup puop paap paep paip paop 
river = rriver riverr rifr rivor riveer riiver rivver reiver 
liver = liverr lliver lifr livor liveer liiver livver leiver 
silver = silverr sillver silfr silvor silveer siilver ssilver silvver 
shiver = shiverr shifr shivor shiveer shhiver shiiver sshiver shivver sheiver 
flinch = flinsh flinssh flinsch fllinch flich flincch fflinch flinchh fliinch 
inch = insh inssh insch ich incch inchh iinch innch einch 
finch = finsh finssh finsch fich fincch ffinch finchh fiinch finnch feinch 
thin = tthin thi thhin thiin thinn thein thon thun 
in = iin ein un aan aen ain aon aun ean een 
din = di ddin diin dinn dein dan daan daen 
fin = fi ffin fiin finn fein fon faan faen faon 
or = orr oor oer owr onr uor ar ir 
for = forr ffor foor foer fowr veor fonr fuor faar 
form = forrm fform formm foorm foerm fowrm fornm formp veorm 
forth = forrth fortth fforth forthh foorth foerth fowrth veorth 
bud = bbud budd buud brud bund baad baed baid baod beed 
but = bbut buut brut baat baet baot baut beit beot beut 
bun = bbun bunn buun brun ben bon baan baen bain 
bump = bbump bummp bumpp buump bunmp brump bamp 
born = borrn bborn bornn boorn boern bowrn bern bonrn bourn 
thorn = thorrn tthorn thhorn thornn thoorn thoern thowrn thern 
corn = sorn ssorn corrn ccorn cornn coorn coern cowrn cern 
north = norrth nortth northh nnorth noorth noerth nowrth nerth 
out = uot ot outt oout ouut oeut orut eut onut 
pout = puot poutt poout ppout pouut poeut porut poat peut 
shout = shuot shoutt shhout shoout sshout shouut shoeut chout 
flout = fluot flot fllout floutt fflout floout flouut floeut 
with = witth withh wiith wwith weith winth wath weth 
width = widtth widdth widthh wiidth wwidth weidth windth wadth wedth 
wind = wid windd wiind winnd wwind weind wond wund waand 
windy = widy winddy wiindy winndy wwindy windyy weindy wandy wendy 
sister = sisterr sistter sistor sisteer siister ssister sisster seister 
master = masterr mastter mester mastor moster maaster maester maister maoster 
blister = blisterr bllister blistter blistor bblister blisteer bliister blisster 
bolster = bolsterr bollster bolstter bolstor bbolster bolsteer boolster bolsster 
intent = inttent intentt intont intet itent inteent iintent inntent intennt 
intend = inttend intond inted itend intendd inteend iintend inntend intennd 
inept = ineptt inopt iept ineept iinept innept ineppt einept inipt 
integrity = integrrity inttegrity integritty intogrity itegrity inteegrity integgrity iintegrity integriity inntegrity 
tamper = tamperr ttamper timper tumper tampor tomper taamper taemper 
hamper = hamperr hamer hemper himper humper hampor homper 
perhaps = perrhaps perheps perhips perhups porhaps perhops perhaaps 
persist = perrsist persistt porsist peersist persiist ppersist perssist persisst 
broth = brroth brotth bbroth brothh brooth broeth bwroth breth 
froth = frroth frotth ffroth frothh frooth froeth fwroth veroth 
throng = thrrong tthrong throg throngg thhrong thronng throong throeng 
prong = prrong prog prongg pronng proong pprong proeng pwrong prondg 
sing = sig singg siing sinng ssing seing cing scing sindg 
sling = slling slig slingg sliing slinng ssling sleing scling 
wing = wingg wiing winng wwing weing windg wang weng 
swing = swingg swiing swinng sswing swwing sweing cwing scwing swindg 
fort = forrt fortt ffort foort foert fowrt veort fert 
forty = forrty fortty fforty foorty fortyy foerty fowrty veorty 
short = shorrt shortt shhort shoort sshort shoert chort 
under = underr undor uder undder undeer unnder uunder undar 
thunder = thunderr tthunder thundor thuder thundder thundeer thhunder thunnder 
blunder = blunderr bllunder blundor bluder bblunder blundder blundeer blunnder 
nod = nodd nnod nood noed ned nond noud nuod nad 
god = godd ggod goed dgod ged gond goud guod gid 
sod = sodd sood ssod soed scod zod sed sond soud 
cod = ssod scod ccod codd cood ced cond coud cuod 
toil = toill ttoil toiil tooil toeil teil toinl 
soil = soill soiil sooil ssoil soeil scoil zoil 
spoil = spoill spoiil spooil sppoil sspoil spoeil cpoil 
coil = ssoil scoil coill ccoil coiil cooil coeil ceil 
lost = llost lostt loost losst loest loct losct 
frost = frrost frostt ffrost froost frosst froest froct 
frosty = frrosty frostty ffrosty froosty frossty frostyy froesty frocty 
grab = grrab greb grib grob graab graeb graib graob 
grand = grrand grend grund grond graand graend graind graond 
graft = grraft graftt greft grift gruft groft graaft 
hid = hidd hhid hiid heid hed hud haad haed haid 
him = hhim hiim himm heim hinm himp hom haam haem 
hilt = hillt hiltt hhilt hiilt heilt hinlt helt 
hit = hitt hhit hiit heit het haat haet hait 
slab = sllab sleb slib slub slaab slaeb slaib 
slam = sllam slem slom slaam slaem slaim slaom slaum sleam 
slant = sllant slantt slent slint slunt slont slaant 
top = ttop toop topp toep tep tonp toup tuop 
stop = sttop stopp sstop stoep ctop sctop ztop stonp 
shop = shhop shoop shopp sshop shoep schop zhop shep shonp 
flop = fllop fflop floop flopp floep velop flep flonp floup 
am = im aam aem aom aum eam eem eim eom 
bad = baad baed baid baod beed beid beod beud biad bied 
drab = drrab dreb drib drob draab draeb draib draob 
raft = rraft raftt reft ruft roft raaft raeft raift 
sort = sorrt sortt soort ssort soert cort scort 
sport = sporrt sportt spoort spport ssport spoert cport 
snort = snorrt snortt snnort snoort ssnort snoert cnort 
beam = bam beem beim beum boam beom beaam 
team = tteam teim teum toam teom teaam teaem teaim 
seam = sam seim seum soam seom seaam seaem seaim 
steam = stam stteam steem steim steum stoam steom 
roster = rroster rosterr rostter rostor rosteer rosster roester 
foster = fosterr fostter fostor fosteer ffoster fooster fosster foester 
monster = monsterr monstter monstor moster monsteer mmonster monnster moonster monsster 
bluster = blusterr blluster blustter blustor bbluster blusteer blusster 
cash = ssash scash cesh cish cush caash caesh 
crash = srash ssrash scrash crrash cresh crish crosh craash 
clash = sslash sclash cllash clesh clish clush closh 
horn = horrn hhorn hornn hoorn hoern howrn hern honrn hourn 
corner = sorner ssorner corrner cornerr cornor ccorner corneer cornner coorner 
scorn = ssorn sssorn sscorn scorrn sccorn scornn scoorn scoern 
corn = sorn ssorn corrn ccorn cornn coorn coern cowrn cern 
after = afterr aftter efter ifter ufter aftor ofter 
banter = banterr bantter benter binter bunter bantor bater bonter 
printer = prrinter printerr printter printor priter printeer priinter prinnter pprinter 
vanity = vanitty venity vinity vunity vaity vonity vaanity 
gravity = grravity gravitty grevity grivity gruvity grovity graavity 
beg = bbeg beeg begg bedg beng baag baeg baig baog baug 
peg = pog peeg pegg ppeg pedg pag peng paag 
leg = elg lleg leeg legg ledg lig leng laag 
gasp = gesp gisp gusp gosp gaasp gaesp gaisp 
grasp = grrasp gresp grisp grusp grosp graasp graesp 
spin = spi spiin spinn sppin sspin spein cpin scpin zpin 
spit = spitt spiit sppit sspit speit cpit scpit zpit 
ample = ampel amplle amle emple imple umple amplo omple 
sample = sampel samplle samle semple sumple samplo somple saample 
simple = simpel simplle simle simplo simplee siimple simmple simpple ssimple 
dimple = dimpel dimplle dimle dimplo ddimple dimplee diimple dimmple dimpple 
over = overr ofr ovor oveer oover ovver oever ovar 
clover = slover sslover sclover cloverr cllover clofr clovor cclover cloveer 
adverb = adverrb adfrb edverb idverb udverb advorb odverb 
wound = wuond wond woud woundd wounnd woound wouund wwound woeund worund 
bound = buond boud bbound boundd bounnd boound bouund boeund borund boand 
round = ruond rond rround roud roundd rounnd roound rouund roeund 
pound = puond poud poundd pounnd poound ppound pouund poeund porund poand 
read = rread reid reud reod reaad reaed reaid reaod 
real = ral rreal reall reil reul roal reol reaal 
dream = drream dreem dreim dreum droam dreom dreaam 
reach = rach reash reassh reasch rreach reech reich reuch 
banana = benana banena banane binana banina banani bunana banuna bananu baana 
malady = mallady melady maledy malidy mulady maludy molady 
cavalry = savalry ssavalry scavalry cavalrry cavallry cevalry cavelry civalry cavilry cuvalry 
capital = sapital ssapital scapital capitall capittal cepital capitel cipital capitil cupital 
bramble = brambel brramble bramblle bremble brimble brumble bramblo bromble 
rumble = rumbel rrumble rumblle umble rumblo rumbble rumblee rummble 
crumble = crumbel srumble ssrumble scrumble crrumble crumblle cumble crumblo crumbble ccrumble 
tumble = tumbel tumblle ttumble tumblo tumbble tumblee tummble tuumble 
enter = enterr entter onter entor eter eenter enteer ennter 
ferment = ferrment fermentt forment fermont fermet feerment fermeent fferment fermment fermennt 
tender = tenderr ttender tonder tendor teder tendder teender tendeer tennder 
fender = fenderr fendor feder fendder feender fendeer ffender fennder fendar 
number = numberr numbor numbber numbeer nummber nnumber nuumber numbar 
lumber = lumberr llumber lumbor lumbber lumbeer lummber luumber 
slumber = slumberr sllumber slumbor slumbber slumbeer slummber sslumber sluumber 
limber = limberr llimber limbor limbber limbeer liimber limmber leimber 
fanatic = fanatis fanatiss fanatisc fanattic fenatic fanetic finatic fanitic funatic fanutic 
dramatic = dramatis dramatiss dramatisc drramatic dramattic drematic drametic drimatic dramitic drumatic 
banana = benana banena banane binana banina banani bunana banuna bananu baana 
up = upp uup rup ap unp ep ip aap aep 
pulp = pullp ppulp pulpp puulp prulp palp punlp pelp 
mud = mudd mmud muud nmud mpud mrud mund maad maed maod 
gum = ggum gumm guum gunm gump grum dgum gam 
craft = sraft ssraft scraft crraft craftt creft crift craaft 
crab = srab ssrab scrab crrab creb crub crob craab 
cram = sram ssram crram crem crim crum crom 
cramp = sramp ssramp scramp crramp cremp crump cromp craamp 
vial = viall viel viil viul viaal viael viail 
dial = diall diel diil diul diol diaal diael 
rival = rrival rivall rivel rivil rivul rivol rivaal 
tidal = tidall ttidal tidel tidil tidul tidol tidaal 
hub = hubb hhub huub hrub hab hunb heb hib haab 
hunt = huntt hhunt hunnt huunt hrunt hant hent 
hut = hutt hhut huut hrut het haat haet hait haot 
hum = hhum humm huum hunm hrum hom haam haem haim 
loft = lloft loftt lofft looft loeft lovet lonft louft 
lofty = llofty loftty loffty loofty loftyy loefty lovety lonfty 
teach = tach teash teassh teasch tteach teech teich teuch toach 
bleach = blach belach bleash bleassh bleasch blleach bleech bleich bleuch bloach 
each = ach eash eassh easch eech eich euch oach 
reach = rach reash reassh reasch rreach reech reich reuch 
neat = nat neatt neet neit noat neot neaat neaet 
neatly = natly neatlly neattly neetly neitly neutly noatly neotly 
eat = eatt eet eit eut eot eaat eaet 
beat = beatt beit beut beot beaat beaet beait beaot 
pen = pon pe penn ppen paan paen paon paun 
hen = heen hhen henn han hin hun haan 
then = tthen thon theen thhen thenn thun thaan 
when = whon whe wheen whhen whenn wwhen whan whin 
rail = rrail raill reil riil ruil raail raeil 
trail = trrail traill ttrail treil triil truil troil 
room = rom rroom roomm rooom roeom rooem wroom roonm 
broom = brom brroom bbroom broomm brooom broeom brooem bwroom 
groom = grom grroom ggroom groomm grooom groeom grooem gwroom 
roof = rof rroof rooff rooof roeof rooef wroof roove 
fifth = fiftth ffifth fiffth fifthh fiifth feifth veifth fiveth finfth 
filth = fillth filtth ffilth filthh fiilth feilth veilth finlth 
fin = fi ffin fiin finn fein fon faan faen faon 
fig = ffig figg fiig feig veig fidg fing feg faag 
on = onn oon oen oun uon un aan aen ain 
bond = bbond bondd bonnd boond boend buond bund baand baend 
cob = ssob scob cobb ccob coob coeb ceb conb coub cuob 
plod = pllod plodd plood pplod ploed pled plond ploud pluod 
porch = porsh porssh porsch porrch porcch porchh poorch pporch poerch 
torch = torsh torssh torsch torrch ttorch torcch torchh toorch 
noon = noo nnoon noonn nooon noeon nooen noen nonon 
boon = bon bboon boonn booon boeon booen beon boen bonon 
moon = mon mmoon moonn mooon moeon mooen nmoon mpoon meon 
soon = soo soonn sooon ssoon soeon sooen scoon zoon 
lung = llung lungg lunng luung lrung lundg lang 
flung = fllung flug fflung flungg flunng fluung flrung velung flundg 
clung = sslung sclung cllung clug cclung clungg clunng cluung clrung 
pail = paill peil piil puil poil paail paeil 
nail = naill neil niil nuil noil naail naeil 
flail = fllail flaill fleil fliil fluil floil flaail 
sail = saill seil siil suil saail saeil saiil 
order = orrder orderr ordor ordder ordeer oorder oerder ordar 
border = borrder borderr bordor bborder bordder bordeer boorder boerder 
orderly = orrderly orderrly orderlly ordorly ordderly ordeerly oorderly 
butler = butelr butlerr butller buttler butlor bbutler butleer 
tumbler = tumbelr tumblerr tumbller ttumbler tumblor tumbbler tumbleer tummbler 
cutler = cutelr ssutler scutler cutlerr cutller cuttler cutlor ccutler cutleer 
member = memberr momber membor membber meember membeer mmember memmber membar 
elder = elderr ellder eldor eldder eelder eldeer leder eldar 
temper = temperr ttemper temer tomper tempor teemper tempeer temmper tempper 
clever = celver slever sslever sclever cleverr cllever clefr clevor cclever cleever 
us = uss uus uc usc rus uz uns os aas 
plus = pllus pplus pluss pluus pluc plusc plrus pluz 
sum = summ ssum suum sunm srum zum sam 
sun = su sunn ssun suun cun scun srun zun san 
manila = manilla menila manile minila manili munila manilu maila 
malignant = mallignant malignantt melignant malignent milignant malignint mulignant malignunt malignat 
droop = drroop ddroop drooop droopp droeop drooep dwroop dreop 
troop = trop trroop ttroop trooop troopp troeop trooep 
proof = prroof prooff prooof pproof proeof prooef pwroof proove 
roof = rof rroof rooff rooof roeof rooef wroof roove 
snap = snep snup snop snaap snaep snaip snaop snaup 
span = spen spon spaan spaen spain spaon spaun spean speen 
pants = pantts pents ponts paants paents paonts paunts peants peents 
slip = sllip sliip slipp sslip sleip sclip zlip slinp 
mad = maad maed maod maud meid meod meud miad mied miid 
pad = ped pid paad paed paod paud pead peid 
bad = baad baed baid baod beed beid beod beud biad bied 
slug = sllug slugg sslug sluug clug sclug slrug sludg 
slush = sllush slushh sslush slussh sluush clush sluch 
step = sttep stepp sstep ctep sctep ztep stap stip 
slept = selpt sllept sleptt slopt sleept sleppt sslept clept 
smelt = smellt smeltt smolt smeelt smmelt ssmelt smlet cmelt 
help = hellp holp heelp hhelp helpp hlep halp hilp henlp 
vain = viin vuin vai voin vaain vaein vaiin vaoin 
gain = gein giin guin gai goin gaain gaein 
chain = shain sshain schain chein chiin chuin chai choin 
density = densitty donsity desity ddensity deensity densiity dennsity denssity densityy 
subsidy = subbsidy subsiddy subsiidy ssubsidy subssidy suubsidy subsidyy subseidy cubsidy subcidy 
vanity = vanitty venity vinity vunity vaity vonity vaanity 
gravity = grravity gravitty grevity grivity gruvity grovity graavity 
tag = ttag teg tig taag taeg taig taog taug 
gag = geg gug gog gaag gaeg gaig gaog gaug 
bag = baag baeg baig baog baug beag beeg beig beog beug 
brag = brrag breg brug brog braag braeg braig braog 
oral = orral orall orel oril orul orol oraal 
moral = morral morall moril morul morol moraal morael morail 
finish = fiish ffinish finishh fiinish finiish finnish finissh feinish fineish finich 
diminish = dimiish ddiminish diminishh diiminish dimiinish diminiish dimminish diminnish diminissh deiminish 
former = forrmer formerr formor formeer fformer formmer foormer foermer 
form = forrm fform formm foorm foerm fowrm fornm formp veorm 
for = forr ffor foor foer fowr veor fonr fuor faar 
forth = forrth fortth fforth forthh foorth foerth fowrth veorth 
pacific = pasific pacifis passific pacifiss pascific pacifisc pecific picific pucific 
invalid = invallid invelid invilid invulid ivalid involid invaalid 
whimsical = whimsisal whimsissal whimsiscal whimsicall whimsicel whimsicil whimsicul whimsicol 
facility = fasility fassility fascility facillity facilitty fecility ficility fucility 
oval = ovall ovel ovil ovul ovol ovaal ovael 
vocal = vosal vossal voscal vocall vocel vocil vocul vocol 
local = losal lossal loscal llocal locall locel locil locul 
focal = fosal fossal foscal focall focel focil focul focol 
pool = pooll poool ppool poeol pooel peol poel ponol 
spool = spol spooll spoool sppool sspool spoeol spooel cpool 
tool = tol tooll ttool toool toeol tooel teol 
stool = stol stooll sttool stoool sstool stoeol stooel 
hung = hungg hhung hunng huung hrung hundg heng hong haang 
sung = sug sungg sunng ssung suung cung scung srung sundg 
stung = sttung stug stungg stunng sstung stuung ctung sctung 
lung = llung lungg lunng luung lrung lundg lang 
dash = desh dush daash daesh daish daosh daush deash 
trash = trrash ttrash tresh trish trush trosh traash 
flash = fllash flish flosh flaash flaesh flaish flaosh flaush fleash 
long = llong longg lonng loong loeng londg leng loung 
song = sog songg sonng soong ssong soeng cong scong sondg 
strong = strrong sttrong strog strongg stronng stroong sstrong stroeng 
prong = prrong prog prongg pronng proong pprong proeng pwrong prondg 
deal = dal deall deel deil deul doal deol 
meal = mal meall meel meil meul moal meol 
seal = sal seall seel seil seul soal seol 
real = ral rreal reall reil reul roal reol reaal 
loud = luod lod lloud loudd looud louud loeud lorud leud 
cloud = cluod sloud ssloud scloud clloud ccloud cloudd clooud clouud 
chat = shat sshat schat chatt chet chut chot chaat 
chant = shant sshant schant chantt chent chint chunt chont 
able = abel ablle eble ible uble ablo oble 
table = tabel tablle ttable teble tible tuble tablo toble 
fable = fabel fablle feble fible fuble fablo foble 
gable = gabel gablle geble gible guble gablo goble 
paid = peid piid puid poid paaid paeid paiid 
staid = sttaid steid stiid stuid stoid staaid staeid 
tail = taill ttail teil tiil tuil taail taeil 
snail = snaill sneil sniil snuil snoil snaail snaeil 
club = slub sslub sclub cllub clubb cclub cluub clrub clab 
clump = sslump sclump cllump clum cclump clummp clumpp cluump clunmp 
whip = whhip whiip whipp wwhip wheip whinp whap whep 
dip = ddip diip dipp deip dinp dap dep dop 
nip = niip nnip nipp neip ninp nep nop nup naap 
lip = llip liip lipp leip linp lep lup laap 
moth = motth mothh mmoth mooth moeth nmoth mpoth meth muoth 
cloth = ssloth scloth clloth clotth ccloth clothh clooth cloeth 
broth = brroth brotth bbroth brothh brooth broeth bwroth breth 
froth = frroth frotth ffroth frothh frooth froeth fwroth veroth 
gang = geng ging gung gaang gaeng gaing gaong 
bang = beng bing baang baeng baing baong baung beang 
rang = rrang reng rong raang raeng raing raong raung reang 
fang = feng fing fung fong faang faeng faing 
damp = demp dimp domp daamp daemp daimp daomp daump 
tramp = trramp ttramp tremp trimp traamp traemp traimp traomp 
cast = sast ssast scast castt cest cist cust 
cat = ssat catt cet caat caet cait caot caut ceat 
cap = ssap scap cep cip caap caep caip caop 
camp = samp ssamp cemp cimp cump caamp caemp 
prism = prrism priism prismm pprism prissm preism pricm priscm 
drip = drrip ddrip driip dripp dreip dwrip drinp drap drep 
rid = rrid ridd riid reid wrid rud raad raed raod 
rib = rrib ribb riib reib wrib rinb rab reb 
flat = fllat flatt flet flut flot flaat flaet flait 
flap = fllap flep flup flaap flaep flaip flaop flaup 
dog = ddog dogg doog doeg dodg doug duog daag daeg daig 
fog = ffog fogg foog foeg veog fodg feg fong foug fuog 
cog = sog ssog scog ccog cogg coog coeg codg ceg cong 
log = llog logg loog loeg lodg loug luog lig laag 
ninth = nintth nith ninthh niinth nninth ninnth neinth nanth 
find = fid findd ffind fiind finnd feind veind fand 
blind = bllind blid bblind blindd bliind blinnd bleind blund 
grind = grrind grindd ggrind griind grinnd greind gwrind dgrind 
bloom = blom blloom bbloom bloomm blooom bloeom blooem bloonm 
gloom = glom glloom ggloom gloomm glooom gloeom glooem gloonm 
gloomy = glomy glloomy ggloomy gloommy glooomy gloomyy gloeomy glooemy 
pain = pein piin puin pai poin paain paein 
paint = paintt peint piint puint pait paaint paeint 
painter = painterr paintter peinter piinter puinter paintor paiter 
amber = amberr imber ambor omber aamber aember aimber aomber aumber 
filbert = filberrt fillbert filbertt filbort filbbert filbeert ffilbert fiilbert 
pilfer = pilferr pillfer pilfor pilfeer pilffer piilfer ppilfer peilfer 
tinder = tinderr ttinder tindor tider tindder tindeer tiinder tinnder 
smash = smesh smish smush smosh smaash smaesh smaish 
slash = sllash slesh slish slaash slaesh slaish slaosh slaush 
dash = desh dush daash daesh daish daosh daush deash 
flash = fllash flish flosh flaash flaesh flaish flaosh flaush fleash 
crib = srib ssrib scrib crrib cribb ccrib criib creib cwrib 
script = ssript sssript sscript scrript scriptt sccript scriipt scrippt 
crept = srept ssrept scrept crrept creptt cropt ccrept creept creppt 
crush = srush ssrush scrush crrush cush ccrush crushh crussh cruush 
flog = fllog fflog flogg floog floeg velog flodg fleg flong 
clog = sslog sclog cllog cclog clogg cloog cloeg clodg cleg 
sable = sabel sablle seble sible suble sablo soble 
stable = stabel stablle sttable steble stible stuble stablo stoble 
cable = cabel ssable scable cablle ceble cible cuble cablo 
too = ttoo tooo toeo tooe teo tono toon touo 
tooth = toth ttooth tootth toothh toooth toeoth tooeth 
poor = por poorr pooor ppoor poeor pooer poowr peor 
spoon = spon spoo spoonn spooon sppoon sspoon spoeon spooen cpoon 
later = laterr llater leter luter lator loter laater laeter 
cater = sater ssater scater caterr catter ceter citer cator 
rill = ril rrill rilll riill reill wrill 
drill = dril drrill drilll ddrill driill dreill 
frill = fril frrill frilll ffrill friill freill 
grill = gril grrill grilll ggrill griill greill 
curb = surb ssurb scurb currb curbb ccurb cuurb cuwrb crurb 
curd = surd ssurd scurd currd ccurd curdd cuurd cuwrd crurd 
curl = surl ssurl scurl currl curll ccurl cuurl cuwrl 
curly = ssurly scurly currly curlly ccurly cuurly curlyy cuwrly 
bead = beed beid beud boad beod beaad beaed 
leap = elap lleap leep leip leup loap leop 
gleam = gelam glleam gleem gleim gleum gloam gleom 
wean = wein weun woan wea weon weaan weaen weain 
thimble = thimbel thimblle tthimble thimblo thimbble thimblee thhimble thiimble thimmble 
grumble = grumbel grrumble grumblle gumble grumblo grumbble grumblee ggrumble grummble 
rumble = rumbel rrumble rumblle umble rumblo rumbble rumblee rummble 
bramble = brambel brramble bramblle bremble brimble brumble bramblo bromble 
holy = hholy hooly holyy hoely hely honly houly huoly haly 
hold = holld holdd hhold hoold hoeld honld hould huold hald 
ill = il illl iill eill inll oll 
bill = bil billl bbill biill beill binll 
fill = fil filll ffill fiill feill veill 
hill = hil hilll hhill hiill heill hinll 
bell = bel belll bbell beell blel benll 
tell = telll ttell teell tlel tenll tull 
fell = fel felll feell ffell flel veell 
sell = sel selll soll seell ssell slel 
dull = dul dulll ddull duull drull dall 
mull = mul mulll mmull muull nmull mpull 
gull = gul gulll ggull guull grull dgull 
hull = hul hulll hhull huull hrull hunll 
burn = burrn bburn burnn buurn buwrn brurn bunrn bern birn 
turn = turrn tturn turnn tuurn tuwrn trurn tunrn tirn 
churn = shurn sshurn schurn churrn cchurn chhurn churnn chuurn chuwrn 
spurn = spurrn spurnn sppurn sspurn spuurn cpurn scpurn spuwrn 
paper = paperr peper puper papor poper paaper paeper paiper 
taper = taperr ttaper teper tiper tuper tapor toper 
viper = viperr vipor vipeer viiper vipper vviper veiper vipar 
property = prroperty properrty propertty proporty propeerty prooperty pproperty propperty 
lean = lan llean leen lein leun leon leaan 
glean = glan gelan gllean gleen glein gleun gloan glea 
clean = celan slean sslean sclean cllean cleen clein cleun cloan clea 
mimic = mimis mimiss mimisc mimicc miimic mimiic mmimic mimmic meimic mimeic 
critic = sritic critis ssritic critiss scritic critisc crritic crittic ccritic criticc 
district = distrist distrisst distrisct distrrict disttrict districtt districct ddistrict diistrict distriict 
fabric = fabris fabriss fabrisc fabrric febric fibric fubric fobric 
whorl = whorrl whorll whhorl whoorl wwhorl whoerl whowrl wherl 
glory = glorry gllory gglory gloory gloryy gloery glowry dglory 
gory = gorry ggory goory goryy goery gowry dgory gery gonry 
story = storry sttory stoory sstory storyy stoery ctory 
well = wel welll woll weell wwell wlel 
dwell = dwel dwelll dwoll ddwell dweell dwwell dwlel 
modern = moderrn modorn moddern modeern mmodern modernn moodern moedern modarn 
ponder = ponderr pondor poder pondder pondeer ponnder poonder pponder poender 
thrill = thril thrrill thrilll tthrill thhrill thriill 
rill = ril rrill rilll riill reill wrill 
drill = dril drrill drilll ddrill driill dreill 
frill = fril frrill frilll ffrill friill freill 
maid = meid miid muid moid maaid maeid maiid 
laid = llaid leid liid luid loid laaid laeid 
daily = dailly deily diily duily daaily daeily daiily 
slain = sllain slein sliin sluin slai sloin slaain 
hurl = hurrl hurll hhurl huurl huwrl hrurl harl hunrl 
surly = surrly surlly ssurly suurly surlyy scurly suwrly 
curl = surl ssurl scurl currl curll ccurl cuurl cuwrl 
curly = ssurly scurly currly curlly ccurly cuurly curlyy cuwrly 
clip = sslip sclip cllip cclip cliip clipp cleip clinp clep 
clinch = slinch clinsh sslinch clinssh sclinch clinsch cllinch clich cclinch clincch 
thing = tthing thig thingg thhing thiing thinng theing thindg 
cling = ssling scling clling clig ccling clingg cliing clinng cleing 
ring = rring ringg riing rinng reing rindg reng 
bring = brring bbring bringg briing brinng breing bwring brindg 
western = westerrn westtern wostern westorn weestern westeern westernn wesstern 
minister = ministerr ministter ministor miister ministeer miinister miniister mminister minnister 
sister = sisterr sistter sistor sisteer siister ssister sisster seister 
master = masterr mastter mester mastor moster maaster maester maister maoster 
ministry = ministrry ministtry miistry miinistry miniistry mministry minnistry minisstry 
activity = astivity asstivity asctivity acttivity activitty ectivity ictivity uctivity 
chill = chil sshill schill chilll cchill chhill chiill 
will = wil willl wiill wwill weill winll 
spill = spil spilll spiill sppill sspill speill cpill 
still = stil stilll sttill stiill sstill steill 
bib = bbib bibb biib beib binb bab beb baab 
if = iff iif eif ive af ef uf aaf 
isn't = isn'tt iisn't isnn't issn't eisn't icn't iscn't izn't 
did = ddid didd diid deid dind ded dod daad daed 
abstain = absttain ebstain abstein ibstain abstiin ubstain abstuin abstai 
stain = sttain stiin stuin stai stoin staain staein staiin 
staid = sttaid steid stiid stuid stoid staaid staeid 
church = shurch chursh sshurch churssh schurch chursch churrch cchurch churcch chhurch 
churn = shurn sshurn schurn churrn cchurn chhurn churnn chuurn chuwrn 
cull = cul sull ssull culll ccull cuull 
gully = guly gullly ggully guully gullyy grully 
gull = gul gulll ggull guull grull dgull 
dull = dul dulll ddull duull drull dall 
her = herr hor heer hher har hewr hir 
hither = hitherr hitther hithor hitheer hhither hithher hiither heither 
usher = usherr ushor usheer ushher ussher uusher ushar ucher 
chamber = shamber sshamber schamber chamberr chember chimber chumber chambor 
fantastic = fantastis fantastiss fantastisc fanttastic fantasttic fentastic fantestic fintastic fantistic funtastic 
ecstatic = esstatic ecstatis essstatic ecstatiss escstatic ecstatisc ecsttatic ecstattic ecstetic ecstitic 
shut = shutt shhut sshut shuut chut schut shrut zhut 
but = bbut buut brut baat baet baot baut beit beot beut 
rut = rrut rutt ut ruut wrut ret rit 
see = se soe seo seee ssee cee scee zee 
seed = sed soed seod seedd seeed sseed ceed sceed 
seem = sem soem seom seeem seemm sseem ceem sceem 
seep = sep soep seop seeep seepp sseep ceep sceep 
slid = sllid slidd sliid sslid sleid clid sclid zlid 
slip = sllip sliip slipp sslip sleip sclip zlip slinp 
flour = fluor flor flourr fllour fflour floour flouur floeur 
flout = fluot flot fllout floutt fflout floout flouut floeut 
much = mussh musch mucch muchh mmuch muuch nmuch mpuch mruch mech 
mud = mudd mmud muud nmud mpud mrud mund maad maed maod 
mug = mugg mmug muug nmug mpug mrug mudg mig mog maag 
inspect = inspest inspesst inspesct inspectt inspoct ispect inspecct inspeect iinspect innspect 
inept = ineptt inopt iept ineept iinept innept ineppt einept inipt 
intent = inttent intentt intont intet itent inteent iintent inntent intennt 
intend = inttend intond inted itend intendd inteend iintend inntend intennd 
contact = sontact contast ssontact contasst scontact contasct conttact contactt contect contict 
content = sontent ssontent scontent conttent contentt contont contet cotent ccontent conteent 
contest = sontest ssontest scontest conttest contestt contost cotest ccontest conteest conntest 
temple = tempel templle ttemple temle tomple templo teemple templee temmple 
ample = ampel amplle amle emple imple umple amplo omple 
sample = sampel samplle samle semple sumple samplo somple saample 
simple = simpel simplle simle simplo simplee siimple simmple simpple ssimple 
bull = bul bulll bbull buull brull bunll 
pull = pul pulll ppull puull prull punll 
full = ful fulll ffull fuull frull veull 
fully = fuly fullly ffully fuully fullyy frully 
ate = atte ete ite ute ato ote aate 
date = datte dete dite dute dato daate daete 
rate = rrate ratte rete rute rato raate raete raite 
mate = mato maate maete maite maote maute meate meete meite meote 
nine = nino nie ninee niine nnine ninne neine nina nini ninen 
dine = dino ddine dinee diine dinne deine dina dini dinen 
mine = mino mie minee miine mmine minne meine nmine mpine mina 
fine = fino finee ffine fiine finne feine veine fina fini finen 
soft = softt sofft sooft ssoft soeft coft scoft sovet 
loft = lloft loftt lofft looft loeft lovet lonft louft 
lofty = llofty loftty loffty loofty loftyy loefty lovety lonfty 
scorch = ssorch scorsh sssorch scorssh sscorch scorsch scorrch sccorch scorcch scorchh 
scorn = ssorn sssorn sscorn scorrn sccorn scornn scoorn scoern 
corn = sorn ssorn corrn ccorn cornn coorn coern cowrn cern 
itself = itsellf ittself itsolf itseelf itselff iitself itsself eitself 
its = itts iits itss eits itc itsc itz ints 
arm = erm orm arrm irm urm 
farm = ferm farrm furm faarm faerm fairm faorm 
harm = herm horm harrm hirm hurm 
charm = cherm chorm sharm ssharm scharm charrm chirm churm 
rave = rrave raf reve ruve ravo raave raeve raive 
brave = brrave braf brive bruve brove braave braeve braive 
pave = paf peve pive puve pavo pove paave 
gave = gaf geve guve gavo gove gaave gaeve gaive 
rove = rrove rof rovo rovee roove rovve roeve wrove rova 
drove = drrove drof drovo ddrove drovee droove drovve droeve dwrove 
throve = thrrove tthrove throf throvo throvee thhrove throove throvve 
grove = grrove grof grovo grovee ggrove grovve groeve gwrove dgrove 
five = fif fivo fivee ffive fiive fivve feive veive fiva fivi 
drive = drrive drif drivo ddrive drivee driive drivve dreive dwrive 
thrive = thrrive tthrive thrif thrivo thrivee thhrive thriive thrivve 
live = llive lif livo livee liive livve leive liva livi 
car = cer sar ssar carr caar caer cair caor 
card = cerd sard ssard scard carrd cird caard 
cart = cort sart ssart scart carrt cartt cirt caart 
scar = scer scor ssar sssar sscar scarr scir scur 
taste = ttaste tastte teste tiste tuste tasto toste 
baste = bastte beste biste buste basto boste baaste 
paste = pastte peste puste pasto poste paaste paeste paiste 
haste = hastte heste histe huste hasto hoste haaste 
gate = gatte gete gute gato gote gaate gaete gaite 
late = llate lete lato lote laate laete laite laote laute 
plate = pllate platte plete plite plute plato plote 
hate = hatte hete hite hute hato hote haate 
name = neme nime nume namo nome naame naeme 
tame = ttame teme tume tamo taame taeme taime taome 
fame = feme fime famo fome faame faeme faime faome 
frame = frrame freme frime frume framo frome fraame 
dime = dimo ddime dimee diime dimme deime dinme dimpe dima dimi 
lime = llime limee liime limme leime linme limpe lima limi 
time = ttime timo timee tiime timme teime tinme timpe tima 
prime = prrime primo primee priime primme pprime preime pwrime prinme 
pine = pino pinee piine pinne ppine peine pina pini pinen 
tine = ttine tino tinee tiine tinne teine tina tini tinen 
brine = brrine brino bbrine brinee briine brinne breine bwrine brina 
line = lline linee liine linne leine lina lini 
ride = rride rido ridde ridee riide reide wride rida ridi 
bride = brride brido bbride bridde bridee briide breide bwride brida 
hide = hido hidde hidee hhide hiide heide hida hidi hiden hinde 
side = sido sidde sidee siide sside seide cide scide zide 
made = mede mide mude mado maade maede maide 
fade = fede fide fude fado fode faade faede 
trade = trrade ttrade trede tride trude trado trode 
grade = grrade grede gride grude grado grode graade 
part = parrt partt pirt purt paart paert pairt paort 
chart = chort shart sshart schart charrt chartt chirt churt 
party = perty porty parrty partty pirty purty 
partner = pertner portner parrtner partnerr parttner partener partiner pirtner purtner 
star = ster stor starr sttar stur staar 
start = stert stort starrt sttart startt stirt sturt 
starch = sterch storch starsh starssh starsch starrch sttarch stirch sturch 
tardy = terdy tordy tarrdy ttardy tirdy turdy 
rope = rrope ropo ropee roope roppe roepe wrope ropa ropi 
mope = mopo mopee mmope moope moppe moepe nmope mpope mopa mopi 
hope = hopo hopee hhope hoope hoppe hoepe hopa hopi hepe hopen 
cope = sope ssope copo ccope copee coope coppe coepe copa copi 
bone = bono boe bbone bonee bonne boone boene bona boni bene 
hone = hono honee hhone honne hoone hoene hona honi hene honen 
cone = sone ssone cono coe ccone conee conne coone coene cona 
tone = ttone tono tonee toone toene tona toni tene tonen 
wad = wid wud wod waad waed waid waod waud 
wand = wund wond waand waend waind waond waund weand weend 
want = wantt wint wunt wat waant waent waint waont 
waft = waftt wift wuft woft waaft waeft waift waoft 
deed = ded doed deod ddeed deedd deeed daed deid dened 
feed = foed feod feedd feeed ffeed veeed faed fead fied 
freed = fred frreed froed freod freedd freeed ffreed fwreed 
heed = hed heod heedd heeed hheed haed heid hened heend 
barb = berb borb barrb birb burb 
barber = berber borber barrber barberr birber burber barbor 
barn = bern barrn birn baarn baern baorn baurn 
far = farr faar faer faor faur feer feir feor feur fiar 
weed = woed weod weedd weeed wweed waed wead wied weid 
weep = wep woep weop weeep weepp wweep waep weap wiep 
sweep = swep swoep sweop sweeep sweepp ssweep swweep cweep 
sweet = swet sweett swoet sweot sweeet ssweet swweet cweet 
beet = beett boet beot bbeet beeet baet biet beit 
beetle = betle beetel beetlle beettle boetle beotle beetlo bbeetle beeetle 
meet = meett moet meot meeet mmeet nmeet mpeet maet 
feet = fet feett foet feot feeet ffeet veeet faet 
tree = tre trree ttree troe treo treee twree 
greet = gret grreet greett groet greot greeet ggreet 
green = gren grreen groen greon gree greeen ggreen greenn 
free = fre frree froe freo freee ffree fwree veree 
mire = mirre miro miree miire mmire meire miwre nmire mpire 
fire = firre firo firee ffire fiire feire fiwre veire fira 
wire = wirre wiro wiree wiire wwire weire wiwre wira wiri 
spire = spirre spiro spiree spiire sppire sspire speire cpire 
lame = llame leme lume lamo lome laame laeme laime 
blame = bllame bleme blime blume blamo blome blaame 
flame = fllame fleme flime flamo flome flaame flaeme flaime 
inflame = infllame infleme inflime influme inflamo iflame inflome 
save = saf seve sive suve savo sove saave 
slave = sllave slaf sleve slive sluve slavo slove 
grave = grrave graf greve grive gruve gravo graave 
shave = shaf sheve shive shuve shavo shaave shaeve 
march = merch morch marssh marsch marrch mirch murch 
parch = parsh parssh parsch parrch pirch purch paarch paerch 
larch = lerch lorch larsh larssh larsch larrch llarch lirch 
tape = ttape tepe tipe tupe tapo tope taape 
grape = grrape grepe grupe grapo graape graepe graipe graope 
shape = shepe shipe shupe shapo shope shaape shaepe 
cape = sape ssape scape cepe cipe cupe caape 
peep = poep peop peeep ppeep peepp paep peap piep peip 
deep = dep doep deop ddeep deeep deepp daep deap diep 
sheep = shep shoep sheop sheeep shheep sheepp ssheep scheep 
creep = crep sreep ssreep screep crreep croep creop ccreep creeep 
speed = spoed speod speedd speeed sppeed sspeed cpeed scpeed 
speech = spech speesh speessh speesch spoech speoch speecch speeech speechh 
speedy = spedy spoedy speody speeddy speeedy sppeedy sspeedy speedyy cpeedy 
bleed = beled blleed bloed bleod bbleed bleedd bleeed blaed 
fleet = flet felet flleet fleett floet fleot fleeet ffleet 
sleet = slet selet slleet sleett sloet sleot sleeet ssleet 
sleep = slep selep slleep sloep sleop sleeep sleepp ssleep 
chide = shide sshide schide chido cchide chidde chidee chhide chiide cheide 
wide = wido widde widee wiide wwide weide wida widi winde 
glide = gllide glido glidde glidee gglide gliide gleide dglide glida 
slide = sllide slido slidde slidee sliide sslide sleide clide 
state = sttate statte stete stite stute stato stote 
slate = sllate slatte slete slite slute slato slote 
crate = srate ssrate scrate crrate cratte crete crite crute crato 
chaste = shaste sshaste schaste chastte cheste chiste chuste chasto 
whine = whino whie whinee whhine whiine whinne wwhine wheine whina whini 
shine = shino shie shinee shhine shiine shinne sshine sheine schine 
shrine = shrrine shrino shrie shrinee shhrine shriine shrinne sshrine shreine 
ninety = ninetty ninoty niety nineety niinety nninety ninnety ninetyy neinety 
game = geme gime gume gamo gome gaame gaeme 
shame = sheme shime shume shamo shome shaame shaeme 
came = ssame scame ceme cime cume camo caame 
lard = lerd larrd llard lird lurd laard 
larder = lerder lorder larrder larderr llarder lirder lurder lardor 
hard = hord harrd hird hurd haard haerd haird 
card = cerd sard ssard scard carrd cird caard 
blade = bllade blede blide blude blado blode blaade 
glade = gllade glede glude glado glode glaade glaede glaide 
shade = shede shide shude shado shode shaade shaede 
robe = rrobe robo robbe robee roobe roebe wrobe roba robi 
probe = prrobe probo probbe probee proobe pprobe proebe pwrobe proba 
pipe = pipo pipee piipe ppipe pippe peipe pipa pipi pipen pinpe 
spine = spino spie spinee spiine spinne sppine sspine speine cpine 
spite = spitte spito spitee spiite sppite sspite speite cpite 
tribe = trribe ttribe tribo tribbe tribee triibe treibe twribe 
fee = fe feo feee ffee veee fae fea fei fene 
feel = fel feell foel feol feeel ffeel fele veeel 
feeble = feble feebel feeblle foeble feoble feeblo feebble feeeble feeblee 
feed = foed feod feedd feeed ffeed veeed faed fead fied 
farmer = fermer farrmer farmerr furmer farmor faarmer faermer 
farther = ferther forther farrther fartherr fartther firther farthor 
father = fatherr fatther fether fither futher fathor fother 
pity = pitty piity ppity pityy peity pinty paty pety 
fifty = fiftty ffifty fiffty fiifty fiftyy feifty veifty fivety finfty 
drone = drrone drono droe ddrone dronee dronne droone droene dwrone 
throne = thrrone tthrone throno thronee thhrone thronne throone throene 
dish = ddish dishh diish dissh deish dich disch dizh dinsh 
fish = ffish fishh fiish fissh feish fich fisch veish fizh 
ship = shhip shiip shipp sship sheip schip zhip shinp shap 
shrimp = shrrimp shrim shhrimp shriimp shrimmp shrimpp sshrimp shreimp chrimp 
garb = gerb gorb garrb girb gurb 
marble = marbel merble morble marrble marblle mirble murble marblo 
army = ermy ormy arrmy irmy urmy 
marsh = mersh morsh marrsh mirsh mursh 
three = thre thrree tthree threo threee thhree thwree 
reel = rreel reell roel reol reeel rele wreel 
creed = sreed ssreed crreed croed creod ccreed creedd creeed 
greedy = gredy grreedy groedy greody greeddy greeedy ggreedy greedyy 
gather = gatherr gatther gether gither guther gathor gother 
lather = latherr llather latther lether luther lathor lother laather 
cave = ssave scave caf ceve cive cuve cavo 
crave = srave ssrave scrave crrave craf creve crive cruve cravo 
page = pege pige puge pago poge paage paege 
stage = sttage stege stige stuge stago stoge staage 
range = rrange renge ringe runge rango ronge raange 
strange = strrange sttrange strenge stringe strunge strango strage stronge 
stove = sttove stof stovo stovee stoove sstove stovve stoeve ctove 
rove = rrove rof rovo rovee roove rovve roeve wrove rova 
drove = drrove drof drovo ddrove drovee droove drovve droeve dwrove 
throve = thrrove tthrove throf throvo throvee thhrove throove throvve 
bee = boe beo bbee beee bae bea bie bei bene 
beef = bef boef beof bbeef beeef beeff beeve baef beaf 
beet = beett boet beot bbeet beeet baet biet beit 
swan = swen swin swun swa swon swaan swaen 
swamp = swemp swimp swump swomp swaamp swaemp swaimp 
steep = stteep stoep steop steeep steepp ssteep cteep 
steeple = steple steepel steeplle stteeple stoeple steople steeplo steeeple steeplee 
smart = smert smort smarrt smartt smirt smurt 
artist = ertist ortist arrtist arttist artistt irtist urtist 
pose = poso posee poose ppose poese poce posce poze posa posi 
prose = prrose proso prosee proose pprose prosse proese proce 
nose = noso nosee nnose nosse noese noce nosce noze nosa 
those = tthose thoso thosee thhose thoose thosse thoese thoce 
enlist = enllist enlistt onlist elist eenlist enliist ennlist enlisst 
list = llist listt liist lisst leist lict lisct 
stint = sttint stintt stit stiint stinnt sstint steint ctint 
midst = midstt middst miidst mmidst midsst meidst midct midsct 
divide = divido ddivide dividde dividee diivide diviide divvide deivide diveide divida 
inside = insido iside insidde insidee iinside insiide innside insside einside inseide 
outside = uotside otside outtside outsido outsidde outsidee outsiide ooutside outsside 
abide = ebide ibide ubide abido obide aabide aebide 
seen = soen seon seeen seenn sseen ceen sceen zeen 
see = se soe seo seee ssee cee scee zee 
seed = sed soed seod seedd seeed sseed ceed sceed 
seem = sem soem seom seeem seemm sseem ceem sceem 
twine = ttwine twino twie twinee twiine twinne twwine tweine twina 
swine = swino swie swinee swiine swinne sswine swwine sweine cwine 
nineteen = nineten ninetteen ninoteen ninetoen nineteon ninetee nieteen nineeteen nineteeen 
enable = enabel enablle eneble enible enuble onable enablo eable 
able = abel ablle eble ible uble ablo oble 
table = tabel tablle ttable teble tible tuble tablo toble 
fable = fabel fablle feble fible fuble fablo foble 
again = egain agein igain agiin ugain aguin agai 
against = againstt egainst ageinst igainst agiinst ugainst aguinst agaist 
gain = gein giin guin gai goin gaain gaein 
winter = winterr wintter wintor witer winteer wiinter winnter wwinter 
aftermath = afterrmath afttermath aftermatth eftermath aftermeth iftermath aftermith uftermath aftermuth aftormath 
after = afterr aftter efter ifter ufter aftor ofter 
banter = banterr bantter benter binter bunter bantor bater bonter 
comic = somic comis ssomic comiss scomic comisc ccomic comicc comiic commic 
topic = topis topiss topisc ttopic topicc topiic toopic toppic toepic 
frolic = frolis froliss frolisc frrolic frollic frolicc ffrolic froliic froolic 
logic = logis logiss logisc llogic logicc loggic logiic loogic loegic 
use = uso usee usse uuse uce usce uze usa usi 
used = usod usedd useed ussed uused uced usced rused uzed 
abuse = ebuse ibuse ubuse abuso obuse aabuse aebuse 
amuse = emuse imuse umuse amuso omuse aamuse aemuse 
adage = edage adege idage adige udage aduge adago 
damage = demage damege dimage damige dumage damuge damago 
manage = minage manige munage manuge manago maage monage manoge 
total = totall ttotal tottal totel totil totul totol 
metal = metall mettal metel metil metul motal metol 
mental = mentall menttal mentel mentil mentul montal mentol 
spar = sper spor sparr spir spaar spaer 
snarl = snerl snorl snarrl snarll snirl snurl 
scarf = scerf scorf ssarf sssarf sscarf scarrf scirf 
sharp = sherp shorp sharrp shirp shurp 
barge = berge borge barrge birge burge bargo 
large = lerge lorge larrge llarge lirge lurge 
charge = cherge chorge sharge ssharge scharge charrge chirge churge chargo 
rabid = rrabid ribid rubid robid raabid raebid raibid raobid 
acrid = asrid assrid ascrid acrrid ecrid icrid ucrid ocrid 
distract = distrast distrasst distrasct distrract disttract distractt distrect distruct distroct 
credit = sredit ssredit scredit crredit creditt crodit ccredit creddit creedit crediit 
whenever = wheneverr whenefr whonever whenover whenevor wheever wheenever wheneever wheneveer whhenever 
celery = ceelry selery sselery scelery celerry cellery colery celory ccelery ceelery 
aim = eim iim uim oim aaim aeim aiim 
maim = meim miim muim moim maaim maeim maiim 
poise = poiso poisee poiise pooise ppoise poisse poeise poice 
noise = noiso noisee noiise nnoise nooise noisse noeise noice 
tinge = ttinge tingo tige tingee tingge tiinge tinnge teinge tindge 
fringe = frringe fringo frige fringee ffringe fringge friinge frinnge freinge 
embers = emberrs ombers embors embbers eembers embeers emmbers emberss embars 
member = memberr momber membor membber meember membeer mmember memmber membar 
amber = amberr imber ambor omber aamber aember aimber aomber aumber 
purse = purrse purso pursee ppurse pursse puurse purce pursce 
nurse = nurrse nurso nursee nnurse nursse nuurse nurce nursce 
give = gif givo givee ggive giive givve geive dgive giva givi 
sieve = seive sief siove sievo sieeve sievee siieve ssieve sievve seieve 
invent = inventt infnt invont invet ivent inveent iinvent innvent invennt 
robin = rrobin robi robbin robiin robinn roobin roebin robein wrobin 
in = iin ein un aan aen ain aon aun ean een 
intent = inttent intentt intont intet itent inteent iintent inntent intennt 
trial = trrial triall ttrial triel triil triul triol 
giant = giantt gient giint giunt giat giont giaant 
vial = viall viel viil viul viaal viael viail 
dial = diall diel diil diul diol diaal diael 
such = sush sussh susch succh suchh ssuch suuch cuch scuch 
snug = snugg snnug ssnug snuug cnug scnug snrug snudg znug 
us = uss uus uc usc rus uz uns os aas 
sun = su sunn ssun suun cun scun srun zun san 
emery = emerry omery emory eemery emeery emmery emeryy emary 
every = everry efry overy evory eevery eveery evvery everyy evary 
gender = genderr gonder gendor geder gendder geender gendeer ggender gennder 
tender = tenderr ttender tonder tendor teder tendder teender tendeer tennder 
tinder = tinderr ttinder tindor tider tindder tindeer tiinder tinnder 
under = underr undor uder undder undeer unnder uunder undar 
vase = vese vuse vaso vose vaase vaese vaise vaose 
chase = shase sshase schase chese chise chuse chaso 
harsh = hersh horsh harrsh hirsh hursh 
hard = hord harrd hird hurd haard haerd haird 
apart = apert aport aparrt apartt epart ipart apirt upart apurt 
part = parrt partt pirt purt paart paert pairt paort 
party = perty porty parrty partty pirty purty 
sin = si siin sinn ssin sein cin scin zin 
insert = inserrt insertt insort isert inseert iinsert innsert inssert 
stint = sttint stintt stit stiint stinnt sstint steint ctint 
spin = spi spiin spinn sppin sspin spein cpin scpin zpin 
very = verry vory veery vvery veryy vewry viry venry 
entry = entrry enttry ontry etry eentry enntry entryy entwry 
belfry = belfrry bellfry bolfry bbelfry beelfry belffry belfryy blefry 
pantry = pantrry panttry pentry pintry puntry patry pontry 
vagrant = vagrrant vagrantt vegrant vagrent vigrant vagrint vugrant vagrunt vagrat 
fragrant = frragrant fragrrant fragrantt fregrant fragrent frigrant fragrint frugrant fragrunt fragrat 
flagrant = flagrrant fllagrant flagrantt flegrant flagrent fligrant flagrint flugrant flagrunt flagrat 
danger = dangerr denger dinger dunger dangor dager donger 
manger = mangerr menger minger munger mangor mager maanger 
wager = wagerr weger wiger wuger wagor woger waager 
timid = ttimid timidd tiimid timiid timmid teimid timeid tinmid timpid 
livid = llivid lividd liivid liviid livvid leivid liveid linvid livind 
putrid = putrrid puttrid putridd putriid pputrid puutrid putreid putwrid 
humid = humidd hhumid humiid hummid huumid humeid hunmid humpid hrumid hamid 
aloud = aluod alod alloud eloud iloud uloud oloud 
vital = vitall vittal vitel vitil vitul vitol vitaal 
final = finall finel finil finul fial finol finaal 
spiral = spirral spirall spirel spiril spirul spirol spiraal 
emanate = emanatte emenate emanete eminate emanite emunate emanute omanate emanato emaate 
escapade = essapade esssapade esscapade escepade escapede escipade escapide escupade escapude oscapade 
devastate = devasttate devastatte devestate devastete devistate devastite devustate devastute dovastate devastato 
tiger = tigerr ttiger tigor tigeer tigger tiiger teiger tigar 
spider = spiderr spidor spidder spideer spiider sppider sspider speider spidar 
sober = soberr sobor sobber sobeer soober ssober soeber sobar 
loiter = loiterr lloiter loitter loitor loiteer loiiter looiter 
infant = infantt infent infint infunt infat ifant infont 
distant = disttant distantt distent distint distunt distat distont 
cub = ssub scub cubb ccub cuub crub cunb ceb cib caab 
cut = sut ssut scut cutt ccut cuut crut cet caat 
rife = rrife rifo rifee riffe riife reife wrife rivee rifa 
crime = srime ssrime scrime crrime crimo ccrime crimee criime crimme 
strive = strrive sttrive strif strivo strivee striive sstrive strivve 
private = prrivate privatte privete privite privute privato privote 
deem = dem doem deom ddeem deeem deemm deenm deemp daem 
glee = gle gele gllee gloe gleo gleee gglee dglee 
sheet = shet sheett shoet sheot sheeet shheet ssheet cheet 
needle = nedle needel needlle noedle neodle needlo needdle neeedle needlee 
pickle = pickel piskle pisskle pisckle picklle picklo picckle picklee piickle pickkle 
tickle = tickel tiskle tisskle tisckle ticklle ttickle ticklo ticckle ticklee tiickle 
trickle = trickel triskle trisskle trisckle trrickle tricklle ttrickle tricklo tricckle tricklee 
fickle = fickel fiskle fisskle fisckle ficklle ficklo ficckle ficklee ffickle fiickle 
toast = ttoast toastt toest toist toust toost toaast 
boast = boastt boest boist boust boaast boaest boaist 
roast = rroast roastt roest roist roaast roaest roaist roaost 
coast = soast ssoast scoast coastt coest coist coust coost 
cubic = subic cubis ssubic cubiss scubic cubisc cubbic ccubic cubicc cubiic 
magic = magis magiss magisc megic migic mugic mogic 
plastic = plastis plastiss plastisc pllastic plasttic plestic plistic plustic 
hectic = hestic hectis hesstic hectiss hesctic hectisc hecttic hoctic hecctic hecticc 
right = rright rightt rigght righht riight reight ridght ringht 
bright = brright brightt bbright brigght brighht briight breight bwright 
fright = frright frightt ffright frigght frighht friight fwright veright 
brightly = brrightly brightlly brighttly bbrightly brigghtly brighhtly briightly 
ask = esk isk usk osk aask aesk aisk 
bask = besk bisk bosk baask baesk baisk baosk bausk 
mask = mesk misk mosk maask maesk maisk maosk mausk 
flask = fllask flesk flisk flusk flosk flaask flaesk 
back = bassk basck bick baack baeck baick baock bauck beack 
pack = pask passk pasck paack paeck paick paock pauck peack peeck 
lack = lask lassk lasck llack leck laack laeck laick laock 
black = blask blassk blasck bllack bleck blick bluck 
stone = sttone stono stoe stonee stonne stoone sstone stoene ctone 
tone = ttone tono tonee toone toene tona toni tene tonen 
them = tthem thom theem thhem themm thenm themp tham thim 
then = tthen thon theen thhen thenn thun thaan 
sack = sask sassk sasck seck saack saeck saick saock sauck 
smack = smask smassk smasck smeck smick smuck smaack 
snack = snask snassk snasck sneck snuck snock snaack snaeck 
slack = slask slassk slasck sllack sleck sluck slock slaack 
bark = bork barrk birk burk baark baerk bairk 
dark = derk darrk durk daark daerk dairk daork 
shark = sherk shork sharrk shurk shaark shaerk 
mark = merk mork marrk mirk maark maerk 
pick = pisk pissk pisck picck piick pickk ppick peick pinck paack 
brick = brissk brisck brrick bbrick bricck briick brickk breick bwrick 
trick = trisk trissk trisck trrick ttrick tricck triick trickk 
sick = sisk sissk sisck sicck siick sickk ssick seick cick 
might = mightt migght mighht miight mmight meight nmight mpight midght 
night = nightt nigght nighht niight nnight neight nidght ninght naght 
fight = fightt ffight figght fighht fiight feight veight fidght finght 
light = llight lightt ligght lighht liight leight lidght linght 
duck = dussk dusck ducck dduck duckk duuck druck dack dunck 
truck = trusk trussk trusck trruck ttruck trucck truckk truuck 
luck = lusk lussk lusck lluck lucck luckk luuck lruck lunck 
pluck = plusk plussk plusck plluck plucck pluckk ppluck pluuck plruck 
dock = dosk dossk dosck docck ddock dockk doock doeck donck douck 
rock = rosk rossk rosck rrock rocck rockk roock roeck wrock 
frock = frosk frossk frosck frrock frocck ffrock frockk froock froeck 
lock = losk lossk losck llock locck lockk loock loeck leck 
boat = boatt boet boit boaat boaet boait boaot boaut 
goat = goatt goet goit goot goaat goaet goait goaot 
oats = oatts oets oits oots oaats oaets oaits oaots 
float = flloat floatt floet floit floot floaat floaet floait 
bake = beke buke bako boke baake baeke baike baoke 
shake = sheke shike shuke shako shoke shaake shaeke 
rake = rrake reke rike ruke rako roke raake 
make = meke muke mako moke maake maeke maike maoke 
deck = dessk desck decck ddeck deeck deckk dack denck daack 
neck = nesk nessk nesck nock necck neeck neckk nneck nack nenck 
speck = spesk spessk spesck spock specck speeck speckk sppeck sspeck cpeck 
speckle = speckel speskle spesskle spesckle specklle spockle specklo specckle speeckle specklee 
bike = biko bbike bikee biike bikke beike bika biki biken binke 
like = llike liko likee liike likke leike lika liki linke 
spike = spiko spikee spiike spikke sppike sspike speike cpike scpike 
strike = strrike sttrike striko strikee striike strikke sstrike streike 
banish = benish binish bunish baish bonish baanish baenish 
vanish = venish vinish vunish vaish vonish vaanish vaenish 
lavish = llavish levish livish luvish lovish laavish laevish 
vote = votte voto votee voote vvote voete vota voti vete 
note = notte noto notee nnote noote noete nota noti nete 
notes = nottes notos notees nnotes nootes notess noetes notec 
rusk = rrusk usk ruskk russk ruusk rusck wrusk 
musk = muskk mmusk mussk muusk musck nmusk mpusk mrusk muzk 
husk = hhusk huskk hussk huusk huck husck hrusk huzk hask 
empty = emptty emty ompty eempty emmpty emppty emptyy enmpty 
testy = ttesty testty tosty teesty tessty testyy tecty 
plenty = pelnty pllenty plentty plonty plety pleenty plennty pplenty 
hurt = hurrt hurtt hhurt huurt huwrt hrurt hunrt hert 
turtle = turtel turrtle turtlle tturtle turttle turtlo turtlee 
purple = purpel purrple purplle purplo purplee ppurple purpple puurple 
spur = spurr sppur sspur spuur cpur scpur spuwr sprur 
park = parrk pirk purk paark paerk pairk paork paurk 
spark = sperk spork sparrk spirk spurk 
spar = sper spor sparr spir spaar spaer 
part = parrt partt pirt purt paart paert pairt paort 
fatal = fatall fattal fatel fital fatil futal fatul 
aloft = alloft aloftt eloft iloft uloft oloft aaloft 
formal = forrmal formall formel formil formul formol formaal 
along = allong elong ilong ulong alog olong aalong 
road = rroad roed roid roud roaad roaed roaid 
roach = roash roassh roasch rroach roech roich rouch rooch 
throat = thrroat tthroat throatt throet throit throut throot 
triple = tripel trriple triplle ttriple triplo triplee triiple tripple 
maple = mapel maplle meple miple muple maplo mople 
staple = stapel staplle sttaple steple stiple stuple staplo stople 
simple = simpel simplle simle simplo simplee siimple simmple simpple ssimple 
choke = shoke sshoke schoke choko cchoke chokee chhoke chokke chooke choeke 
smoke = smoko smokee smokke smmoke smooke ssmoke smoeke cmoke scmoke 
spoke = spoko spokee spokke spooke sppoke sspoke spoeke cpoke scpoke 
stick = stisk stissk stisck sttick sticck stiick stickk sstick steick 
sticky = stisky stissky stiscky stticky sticcky stiicky stickky ssticky stickyy 
tight = ttight tightt tigght tighht tiight teight tidght tinght 
sight = sightt sigght sighht siight ssight seight cight scight 
slight = sllight slightt sligght slighht sliight sslight clight 
plight = pllight plightt pligght plighht pliight pplight pleight plidght 
take = ttake teke tike tuke tako taake taeke 
lake = llake leke luke lako loke laake laeke laike 
flake = fllake fleke flike flako floke flaake flaeke flaike 
wake = weke wike wuke wako waake waeke waike 
block = blosk blossk blosck bllock bblock blocck blockk bloock bloeck 
flock = flosk flossk flosck fllock flocck fflock flockk floock floeck 
stock = stosk stossk stosck sttock stocck stockk stoock sstock stoeck 
shock = shosk shossk shosck shocck shhock shockk shoock sshock shoeck 
afar = afer afor afarr efar ifar afir ufar afur 
alarm = alerm alorm alarrm allarm elarm ilarm alirm ularm alurm 
lark = lerk lork larrk llark lirk laark 
embark = emberk embork embarrk embirk emburk ombark 
task = ttask tesk tisk tosk taask taesk taisk taosk 
desk = dosk ddesk deesk deskk dessk desck dexk dezk dask 
skulk = skullk skkulk skulkk sskulk skuulk ckulk sckulk skrulk 
ask = esk isk usk osk aask aesk aisk 
palm = pallm pelm pilm pulm polm paalm paelm 
calm = salm ssalm scalm callm celm cilm culm colm 
varnish = vernish vornish varrnish virnish vurnish 
tarnish = ternish tornish tarrnish ttarnish tirnish turnish 
stark = sterk starrk sttark stirk sturk staark 
star = ster stor starr sttar stur staar 
start = stert stort starrt sttart startt stirt sturt 
starch = sterch storch starsh starssh starsch starrch sttarch stirch sturch 
epic = epis episs episc opic epicc eepic epiic eppic epeic apic 
metric = metris metriss metrisc metrric mettric motric metricc meetric metriic mmetric 
crack = srack crask ssrack crassk scrack crasck crrack creck cruck 
cracker = sracker crasker ssracker crassker scracker crascker crracker crackerr crecker cricker 
sob = sobb soob ssob soeb scob zob seb sonb soub 
hog = hogg hhog hoog hoeg hodg heg hong houg huog 
ox = oox oxx oex onx oux uox ux aax aex aix 
box = bbox boox boxx boex bex bonx boux buox bax 
a = aa ae ai ao au ee ei eo eu ia 
than = tthan thun tha thon thaan thaen thain thaon thaun 
penalty = penallty penaltty penelty penilty penulty ponalty pealty penolty 
organ = orrgan orgen orgin orgun orga orgon orgaan 
matter = matterr mattter metter mitter mattor motter maatter 
patter = pater patterr pattter petter pitter pattor paatter 
pattern = patern patterrn patttern pettern pittern puttern pattorn 
latter = latterr llatter lattter lutter lattor lotter laatter laetter 
import = imporrt importt imort iimport immport impoort impport impoert 
morning = morrning mornig morningg morniing mmorning mornning morninng moorning moerning 
or = orr oor oer owr onr uor ar ir 
born = borrn bborn bornn boorn boern bowrn bern bonrn bourn 
thick = thisk thissk thisck tthick thicck thhick thiick thickk theick 
slick = slisk slissk slisck sllick slicck sliick slickk sslick sleick 
bicker = bisker bissker biscker bickerr bickor bbicker biccker bickeer biicker bickker 
shrift = shrrift shriftt shrifft shhrift shriift sshrift shreift chrift 
shrimp = shrrimp shrim shhrimp shriimp shrimmp shrimpp sshrimp shreimp chrimp 
slope = sllope slopo slopee sloope sloppe sslope sloepe clope 
rope = rrope ropo ropee roope roppe roepe wrope ropa ropi 
mope = mopo mopee mmope moope moppe moepe nmope mpope mopa mopi 
hope = hopo hopee hhope hoope hoppe hoepe hopa hopi hepe hopen 
canal = sanal ssanal scanal canall cenal canel cinal canil cunal canul 
banana = benana banena banane binana banina banani bunana banuna bananu baana 
go = ggo goe dgo ge gon gou guo ga gi 
so = soo sso soe sco zo se suo sa 
old = olld oldd oold oeld eld onld ould uold ald 
gold = golld goldd ggold goold goeld dgold gonld gould guold 
impeach = impach impeash impeassh impeasch imeach impeech impeich impeuch impoach 
peach = pach peash peassh peasch peech peich peuch peoch 
each = ach eash eassh easch eech eich euch oach 
reach = rach reash reassh reasch rreach reech reich reuch 
divine = divino divie ddivine divinee diivine diviine divinne divvine deivine diveine 
incline = insline inssline inscline inclline inclino icline inclie inccline inclinee iincline 
bench = bensh benssh bensch bonch bech bbench bencch beench benchh bennch 
branch = bransh branssh bransch brranch brench brinch brach bronch 
ranch = ransh ranssh ransch rranch rench rinch runch rach 
blanch = blansh blanssh blansch bllanch blinch blunch blach blonch 
butter = buter butterr buttter buttor bbutter butteer 
mutter = mutterr muttter muttor mutteer mmutter muutter 
putter = puter putterr puttter puttor putteer pputter 
buttery = butery butterry butttery buttory bbuttery butteery 
tatter = tatterr ttatter tattter tetter tutter tattor taatter 
flatter = flater flatterr fllatter flattter fletter flitter flattor 
flattery = flatery flatterry fllattery flatttery flettery flittery flattory 
battery = batery batterry batttery bettery bittery battory bottery 
bitter = bitterr bittter bittor bbitter bitteer biitter 
fritter = friter frritter fritterr frittter frittor fritteer ffritter friitter 
litter = litterr llitter littter littor litteer liitter 
rode = rrode rodo rodde rodee roode roede wrode roda rodi 
node = nodo nodde nodee nnode noode noede noda nodi nede noden 
code = sode ssode scode codo ccode codde codee coode coede codi 
giving = givig ggiving givingg giiving giviing givinng givving geiving giveing dgiving 
misgiving = misgivig misggiving misgivingg miisgiving misgiiving misgiviing mmisgiving misgivinng missgiving misgivving 
livid = llivid lividd liivid liviid livvid leivid liveid linvid livind 
flight = fllight flightt fflight fligght flighht fliight fleight velight 
flighty = fllighty flightty fflighty fligghty flighhty fliighty flightyy fleighty 
mouth = muoth moutth mouthh mmouth moouth mouuth moeuth nmouth mpouth 
south = suoth soth soutth southh soouth ssouth souuth soeuth couth 
better = beter betterr bettter botter bbetter beetter betteer 
letter = leter eltter letterr lletter lettter lotter lettor leetter letteer 
sip = siip sipp ssip seip cip scip sinp sep 
this = tthis thhis thiis thiss theis thic thisc thiz 
sin = si siin sinn ssin sein cin scin zin 
spin = spi spiin spinn sppin sspin spein cpin scpin zpin 
funeral = funerral funerall funerel funeril funerul funoral fueral funerol 
colander = solander ssolander scolander colanderr collander colender colinder colunder colandor colader 
as = os aas aes ais aos aus eas ees eis eos 
has = hus haas haes hais haos haus heas hees heis 
is = iis iss eis ic isc iz os aas aes 
his = hhis hiis heis hic hisc hiz hins hus haas haes 
cane = ssane scane cene cune cano cae caane caene 
crane = srane ssrane scrane crrane crene crine crune crano crae 
plane = pllane plene pline plune plano plae plone 
potter = poter potterr pottter pottor potteer pootter ppotter 
shutter = shuter shutterr shuttter shuttor shutteer shhutter sshutter 
cutter = sutter ssutter scutter cutterr cuttter cuttor ccutter cutteer 
clatter = clater slatter sslatter sclatter clatterr cllatter clattter cletter clitter 
encode = ensode enssode enscode oncode encodo ecode enccode encodde eencode encodee 
code = sode ssode scode codo ccode codde codee coode coede codi 
node = nodo nodde nodee nnode noode noede noda nodi nede noden 
rode = rrode rodo rodde rodee roode roede wrode roda rodi 
booth = bootth bbooth boothh boooth boeoth booeth beoth boeth 
loop = lloop looop loopp loeop looep leop loep lonop 
cool = sool ssool scool cooll ccool coool coeol cooel 
blooming = bloming bllooming bloomig bblooming bloomingg bloomiing bloomming bloominng bloooming 
war = wer wor warr wir wur 
ward = werd warrd wird wurd waard waerd 
warm = werm warrm wirm wurm waarm waerm 
warp = werp worp warrp wirp wurp 
sea = sa sei seu soa seo seaa seae seai 
seam = sam seim seum soam seom seaam seaem seaim 
seal = sal seall seel seil seul soal seol 
distemper = distemperr disttemper distemer distomper distempor ddistemper disteemper distempeer diistemper distemmper 
temper = temperr ttemper temer tomper tempor teemper tempeer temmper tempper 
tamper = tamperr ttamper timper tumper tampor tomper taamper taemper 
hamper = hamperr hamer hemper himper humper hampor homper 
burst = burrst burstt bburst bursst buurst burct bursct 
murder = murrder murderr murdor murdder murdeer mmurder muurder murdar 
turban = turrban tturban turben turbin turbun turba turbon 
furnish = furrnish ffurnish furnishh furniish furnnish furnissh fuurnish furneish furnich 
expert = experrt expertt espert oxpert eexpert expeert exppert exxpert 
desert = deserrt desertt dosert desort ddesert deesert deseert desart 
sting = stting stig stingg stiing stinng ssting steing cting 
string = strring sttring strig stringg striing strinng sstring streing 
toad = ttoad toid toud tood toaad toaed toaid toaod 
coat = soat ssoat scoat coatt coet coit cout 
coach = soach coash ssoach coassh scoach coasch coech coich 
chip = sship schip cchip chhip chiip chipp cheip chinp chep 
chin = sshin schin cchin chhin chiin chinn chein chan chen 
stack = stask stassk stasck sttack steck staack staeck staick staock 
stuck = stusk stussk stusck sttuck stucck stuckk sstuck stuuck ctuck 
acts = asts assts ascts actts ects icts ucts octs 
cat = ssat catt cet caat caet cait caot caut ceat 
cast = sast ssast scast castt cest cist cust 
craft = sraft ssraft scraft crraft craftt creft crift craaft 
raze = rraze rase reze rize ruze razo roze 
gaze = gase geze gize guze gazo goze gaaze 
blaze = bllaze bleze blize bluze blazo bloze blaaze 
craze = sraze ssraze scraze crraze crase creze crize cruze crazo 
gap = gep gip gup gop gaap gaep gaip 
gag = geg gug gog gaag gaeg gaig gaog gaug 
scrape = ssrape sssrape sscrape scrrape screpe scripe scrupe scrapo 
cape = sape ssape scape cepe cipe cupe caape 
tape = ttape tepe tipe tupe tapo tope taape 
grape = grrape grepe grupe grapo graape graepe graipe graope 
all = al alll ull oll aall aell aill aoll 
ball = bal balll baall baell baill baoll baull beall beell 
tall = tal talll ttall tull taall taell taill taoll 
fall = fal falll faall faell faill faoll faull feall feell 
mouse = muose mose mouso mousee mmouse moouse mouuse moeuse mouce mousce 
house = huose houso housee hhouse hoouse housse houuse hoeuse houce 
blouse = bluose blose bllouse blouso bblouse blousee bloouse blousse blouuse 
malt = mallt maltt mult maalt maelt mailt maolt mault mealt 
halt = hallt haltt helt hult holt haalt haelt hailt 
salt = sallt saltt selt sult solt saalt saelt sailt 
warn = wern warrn wirn wurn waarn waern 
warmth = wermth wormth warrmth warmtth wirmth wurmth 
wart = wert warrt wartt wirt wurt waart 
water = waterr watter weter witer wuter wator woter 
bony = bbony boony bonyy boeny beny bouny buony bany biny 
only = onlly oly onnly oonly onlyy oenly enly ounly 
fume = fumo fumee ffume fumme fuume funme fumpe frume veume fuma 
home = homee hhome homme hoome hoeme honme hompe homa homi homen 
same = seme sime sume samo saame saeme saime 
slime = sllime slimo slimee sliime slimme sslime sleime sclime 
tube = ttube tubo tubbe tubee tuube trube tubi tabe tuben 
cube = sube ssube scube cubo cubbe ccube cubee cuube crube cuba 
globe = gllobe globo globbe globee gglobe gloobe gloebe dglobe globa 
robe = rrobe robo robbe robee roobe roebe wrobe roba robi 
ease = ase eese eise euse oase easo eose 
please = plase pelase pllease pleese pleise pleuse ploase pleaso 
perfect = perfest perfesst perfesct perrfect perfectt porfect perfoct perfecct peerfect perfeect 
temper = temperr ttemper temer tomper tempor teemper tempeer temmper tempper 
tamper = tamperr ttamper timper tumper tampor tomper taamper taemper 
expert = experrt expertt espert oxpert eexpert expeert exppert exxpert 
stutter = stuter stutterr sttutter stuttter stuttor stutteer sstutter 
butter = buter butterr buttter buttor bbutter butteer 
mutter = mutterr muttter muttor mutteer mmutter muutter 
putter = puter putterr puttter puttor putteer pputter 
perish = perrish porish peerish perishh periish pperish perissh pereish 
blemish = belmish bllemish blomish bblemish bleemish blemishh blemiish blemmish blemissh 
fool = fooll ffool foool foeol fooel veool feol foel 
foolish = folish foollish ffoolish foolishh fooliish fooolish foolissh foeolish 
safe = sefe sife sufe safo sofe saafe saefe 
safety = safetty sefety sifety sufety safoty sofety saafety 
i = ei aa ae ai ao au ee eo eu 
pint = pintt piint pinnt ppint peint pont paant paent 
ninth = nintth nith ninthh niinth nninth ninnth neinth nanth 
find = fid findd ffind fiind finnd feind veind fand 
bray = brray brey briy bruy broy braay braey 
pray = prray priy pruy proy praay praey praiy praoy 
fray = frray frey friy fruy froy fraay fraey 
gray = grray grey griy gruy groy graay graey 
mass = maass maess maiss maoss mauss meass meess meiss meoss meuss 
brass = brrass bress briss bruss bross braass braess 
grass = gras grrass gress griss gruss graass graess 
glass = glas gllass gless gliss gluss glaass glaess 
swim = swiim swimm sswim swwim sweim cwim scwim swinm swimp 
swift = swiftt swifft swiift sswift swwift sweift cwift scwift 
mess = meess mmess messs mecs mesc mescs messc 
dress = dres drress ddress dreess dresss drecs dresc 
bless = bles belss blless bloss bbless bleess blesss blecs 
impress = impres imprress imress impross impreess iimpress immpress imppress impresss 
tray = trray ttray triy truy traay traey traiy traoy 
stray = strray sttray strey striy struy stroy straay 
spray = sprray sprey spriy spruy sproy spraay spraey 
prayer = prrayer prayerr preyer priyer pruyer prayor proyer 
meek = mek moek meok meeek meekk mmeek nmeek mpeek maek 
seek = sek soek seok seeek seekk sseek ceek sceek 
sleek = slek selek slleek sloek sleok sleeek sleekk ssleek 
cheek = chek sheek ssheek scheek choek cheok ccheek cheeek chheek 
baby = beby biby buby boby baaby baeby baiby 
navy = nevy nivy nuvy novy naavy naevy naivy 
gravy = grravy grevy grivy gruvy grovy graavy graevy 
lady = llady ledy lidy ludy lody laady laedy 
call = sall ssall scall calll cill caall caell caill 
small = smal smalll smill smull smoll smaall smaell 
stall = stal stalll sttall stell stull stoll staall 
wall = wal walll wull woll waall waell waill waoll 
load = lload loed loid lood loaad loaed loaid loaod 
loaf = lloaf loef loif louf loof loaaf loaef 
foal = foall foel foaal foael foail foaol foaul foeal foeel 
soap = soep soip soop soaap soaep soaip soaop soaup 
mild = milld mildd miild mmild meild nmild mpild minld mald 
child = shild sshild schild chilld cchild childd chhild chiild cheild 
our = uor ourr oour ouur oeur ouwr orur eur onur 
sour = suor sor sourr soour ssour souur soeur cour 
flour = fluor flor flourr fllour fflour floour flouur floeur 
invite = invitte invito ivite iinvite inviite innvite invvite einvite inveite 
ignite = ignitte ignito ignitee iggnite iignite igniite ignnite eignite igneite 
wish = wishh wiish wissh wwish weish wich wisch wizh winsh 
wit = witt wiit wwit weit wint wat wut waat 
with = witth withh wiith wwith weith winth wath weth 
width = widtth widdth widthh wiidth wwidth weidth windth wadth wedth 
class = clas slass sslass sclass cllass cless cliss cluss 
classic = clasic slassic classis sslassic classiss sclassic classisc cllassic clessic clissic 
void = voidd voiid vooid vvoid voeid veid voind vonid vouid 
point = pointt poit poiint poinnt pooint ppoint poeint peint 
oil = oill oiil ooil oeil eil oinl onil ouil 
toil = toill ttoil toiil tooil toeil teil toinl 
no = nno noo noe ne nou nuo na ni naa 
both = botth bboth bothh boeth beth bonth bouth buoth 
go = ggo goe dgo ge gon gou guo ga gi 
so = soo sso soe sco zo se suo sa 
stoic = stois stoiss stoisc sttoic stoicc stoiic stooic sstoic stoeic 
rustic = rustis rustiss rustisc rrustic rusttic ustic rusticc rustiic russtic 
sham = shem shum shom shaam shaem shaim shaom shaum 
thrash = thrrash tthrash thrish throsh thraash thraesh thraish thraosh thraush 
dash = desh dush daash daesh daish daosh daush deash 
dish = ddish dishh diish dissh deish dich disch dizh dinsh 
bible = bibel biblle biblo bbible bibble biblee biible beible bibla 
noble = nobel noblle noblo noblee nnoble nooble noeble nobla nobli 
bramble = brambel brramble bramblle bremble brimble brumble bramblo bromble 
rumble = rumbel rrumble rumblle umble rumblo rumbble rumblee rummble 
rank = rrank renk runk rak ronk raank raenk raink 
drank = drrank drenk drak dronk draank draenk draink draonk draunk 
frank = frrank frenk frink frunk frak fronk fraank 
shrank = shrrank shrenk shrak shronk shraank shraenk shraink shraonk shraunk 
entwine = enttwine ontwine entwino etwine entwie eentwine entwinee entwiine enntwine entwinne 
twine = ttwine twino twie twinee twiine twinne twwine tweine twina 
swine = swino swie swinee swiine swinne sswine swwine sweine cwine 
archery = erchery orchery arshery arsshery arschery arrchery archerry irchery urchery 
march = merch morch marssh marsch marrch mirch murch 
parch = parsh parssh parsch parrch pirch purch paarch paerch 
larch = lerch lorch larsh larssh larsch larrch llarch lirch 
envy = onvy evy eenvy ennvy envvy envyy anvy invy 
entry = entrry enttry ontry etry eentry enntry entryy entwry 
plenty = pelnty pllenty plentty plonty plety pleenty plennty pplenty 
afloat = aflloat afloatt efloat afloet ifloat afloit ufloat aflout 
float = flloat floatt floet floit floot floaat floaet floait 
bank = benk bink bak baank baenk baink baonk baunk 
dank = denk dak donk daank daenk daink daonk daunk deank 
hank = henk hink hak haank haenk haink haonk haunk 
tank = ttank tenk tink tunk tak tonk taank 
pink = pik piink pinkk pinnk ppink peink pank penk 
drink = drrink drik ddrink driink drinkk drinnk dreink dwrink 
sink = sik siink sinkk sinnk ssink seink cink scink zink 
blink = bllink blik bblink bliink blinkk blinnk bleink blenk 
day = dey diy duy doy daay daey daiy 
may = mey miy muy moy maay maey maiy 
say = sey siy suy saay saey saiy saoy 
stay = sttay stey stiy stuy stoy staay staey 
text = ttext textt toxt teext texxt taxt tixt tenxt 
next = nextt noxt neext nnext nexxt naxt nixt nenxt 
rich = rish rissh risch rrich ricch richh riich reich wrich 
enrich = enrish enrissh enrisch enrrich onrich erich enricch eenrich enrichh enriich 
moist = moistt moiist mmoist mooist moisst moeist moict 
hoist = hoistt hhoist hoiist hooist hoisst hoeist hoict 
fresh = frresh freesh ffresh freshh fressh frech fresch fwresh 
flesh = felsh fllesh flosh fleesh fflesh fleshh flessh flech 
shelf = shellf sholf sheelf shelff shhelf sshelf shlef chelf 
bait = baitt beit biit buit boit baait baeit 
wait = waitt weit wiit wuit woit waait waeit 
dainty = daintty deinty diinty duinty daity dointy daainty 
entail = entaill enttail enteil entiil entuil ontail etail entoil 
blank = bllank blenk blunk blak blonk blaank blaenk blaink 
flank = fllank flenk flink flonk flaank flaenk flaink flaonk 
crank = srank ssrank scrank crrank crenk crink crunk crak 
rank = rrank renk runk rak ronk raank raenk raink 
drank = drrank drenk drak dronk draank draenk draink draonk draunk 
frank = frrank frenk frink frunk frak fronk fraank 
attendant = atendant atttendant attendantt ettendant attendent ittendant attendint uttendant attendunt 
attempt = atempt atttempt attemptt attemt ettempt ittempt uttempt attompt 
brisk = brrisk bbrisk briisk briskk brissk breisk brisck bwrisk 
skill = skil skilll skiill skkill sskill skeill ckill 
ask = esk isk usk osk aask aesk aisk 
bask = besk bisk bosk baask baesk baisk baosk bausk 
route = ruote rroute routte routo routee rooute rouute roeute 
abate = abatte ebate abete ibate abite ubate abute abato 
dictate = distate disstate disctate dicttate dictatte dictete dictite dictute dictato 
inflate = infllate inflatte inflete inflite influte inflato iflate inflote 
ticket = tisket tissket tiscket tticket tickett tickot ticcket tickeet tiicket tickket 
picket = pisket pissket piscket pickett pickot piccket pickeet piicket pickket ppicket 
packet = pasket passket pascket packett pecket pucket packot paacket 
racket = rasket rassket rascket rracket rackett recket ricket rucket rackot 
santa = santta senta sante sinta santi sunta santu sata 
constant = sonstant ssonstant sconstant consttant constantt constent constint constunt constat costant 
bother = botherr botther bothor bbother botheer bothher boother boether 
voucher = vuocher vocher vousher voussher vouscher voucherr vouchor vouccher voucheer vouchher 
miser = miserr misor miseer miiser mmiser misser meiser misar 
trousers = truosers trosers trrousers trouserrs ttrousers trousors trouseers troousers 
ostrich = ostrish ostrissh ostrisch ostrrich osttrich ostricch ostrichh ostriich oostrich 
frost = frrost frostt ffrost froost frosst froest froct 
frosty = frrosty frostty ffrosty froosty frossty frostyy froesty frocty 
that = tthat thatt thet thit thut thot thaat 
than = tthan thun tha thon thaan thaen thain thaon thaun 
spirit = spirrit spiritt spiirit spiriit sppirit sspirit speirit spireit 
culprit = sulprit ssulprit sculprit culprrit cullprit culpritt cculprit culpriit culpprit 
unit = unitt uit uniit unnit uunit uneit runit anit unint 
profit = prrofit profitt proffit profiit proofit pprofit proefit profeit 
distill = distil distilll disttill ddistill diistill distiill disstill 
still = stil stilll sttill stiill sstill steill 
sultry = sultrry sulltry sulttry ssultry suultry sultryy cultry 
trust = trrust ttrust trustt tust trusst truust truct 
redress = redres rredress redrress rodress redross reddress reedress redreess 
depress = depres deprress dopress depross ddepress deepress depreess deppress depresss 
regress = regres rregress regrress rogress regross reegress regreess reggress 
express = expres exprress espress oxpress expross eexpress expreess exppress expresss 
berate = berrate beratte berete berite berute borate berato berote 
elate = ellate elatte elete elute olate elato elote elaate 
relate = rrelate rellate relatte relete relite relute rolate relato 
estate = esttate estatte estete estite estute ostate estato estote 
rebel = rrebel rebell robel rebol rebbel reebel rebeel reble 
repel = rrepel repell ropel repol reepel repeel reppel reple 
relent = reelnt rrelent rellent relentt rolent relont relet reelent releent 
regret = rregret regrret regrett rogret regrot reegret regreet reggret 
deliver = deliverr delliver delifr doliver delivor ddeliver deeliver deliveer deliiver 
bewilder = bewilderr bewillder bowilder bewildor bbewilder bewildder beewilder bewildeer bewiilder 
delivery = deliverry dellivery delifry dolivery delivory ddelivery deelivery deliveery deliivery 
define = dofine defino defie ddefine deefine definee deffine defiine definne defeine 
refine = rrefine rofine refino refie reefine refinee reffine refiine refinne 
decline = desline dessline descline declline docline declino declie deccline ddecline deecline 
recline = resline ressline rescline rrecline reclline rocline reclino reclie reccline reecline 
detain = dettain detein detiin detuin dotain detai detoin 
retain = rretain rettain retein retiin retuin rotain retai retoin 
detail = detaill dettail deteil detiil detuil dotail detoil 
defend = dofend defond defed ddefend defendd deefend defeend deffend defennd deveend 
defect = defest defesst defesct defectt dofect defoct defecct ddefect deefect defeect 
deflect = defelct deflest deflesst deflesct defllect deflectt doflect defloct deflecct ddeflect 
reflect = refelct reflest reflesst reflesct rreflect refllect reflectt roflect refloct reflecct 
fault = faullt faultt feult fiult fuult foult faault 
faulty = faullty faultty feulty fiulty fuulty foulty faaulty 
default = defaullt defaultt defeult defiult defuult dofault defoult 
elicit = elisit elissit eliscit ellicit elicitt olicit eliccit eelicit eliicit eliciit 
exhibit = exhibitt eshibit oxhibit exhibbit eexhibit exhhibit exhiibit exhibiit exxhibit 
thank = tthank thenk thak thonk thaank thaenk thaink thaonk thaunk 
ankle = ankel anklle enkle inkle unkle anklo akle onkle 
sank = senk sak sonk saank saenk saink saonk saunk seank 
think = tthink thik thhink thiink thinkk thinnk theink thenk 
report = rreport reporrt reportt roport reeport repoort repport 
deport = deporrt deportt doport ddeport deeport depoort depport depoert 
deride = derride doride derido dderide deridde deeride deridee deriide dereide 
beside = boside besido bbeside besidde beeside besidee besiide besside beseide becide 
side = sido sidde sidee siide sside seide cide scide zide 
ride = rride rido ridde ridee riide reide wride rida ridi 
demur = demurr domur ddemur deemur demmur demuur demuwr denmur dempur 
return = rreturn returrn retturn roturn reeturn returnn retuurn 
recur = resur ressur rescur rrecur recurr rocur reccur reecur 
skeptical = skeptisal skeptissal skeptiscal skepticall skepttical skepticel skepticil skepticul skoptical 
disposal = disposall disposel disposil disposul disposol disposaal disposael 
depend = dopend depond deped ddepend dependd deepend depeend depennd deppend dapend 
detest = dettest detestt dotest detost ddetest deetest deteest detesst 
detect = detesst detesct dettect detectt dotect detoct detecct ddetect deetect deteect 
depict = depist depisst depisct depictt dopict depicct ddepict deepict depiict deppict 
remain = rremain remein remiin remuin romain remai remoin 
refrain = rrefrain refrrain refrein refriin refruin rofrain refrai refroin 
prevail = prrevail prevaill preveil previil prevuil provail prevoil 
beset = besett boset bbeset beeset beseet besset becet bescet 
behest = behestt bohest behost bbehest beehest beheest behhest behesst behect 
remark = remerk remork rremark remarrk remirk remurk romark 
market = merket morket marrket markett mirket murket markot 
clock = slock closk sslock clossk sclock closck cllock cclock clocck clockk 
locket = losket lossket loscket llocket lockett lockot loccket lockeet lockket 
lock = losk lossk losck llock locck lockk loock loeck leck 
block = blosk blossk blosck bllock bblock blocck blockk bloock bloeck 
retire = rretire retirre rettire rotire retiro reetire retiire 
expire = expirre espire oxpire expiro eexpire expiree expiire exppire exxpire 
remember = rremember rememberr romember remomber remembor remembber reemember remeember remembeer remmember 
deliver = deliverr delliver delifr doliver delivor ddeliver deeliver deliveer deliiver 
bewilder = bewilderr bewillder bowilder bewildor bbewilder bewildder beewilder bewildeer bewiilder 
delivery = deliverry dellivery delifry dolivery delivory ddelivery deelivery deliveery deliivery 
extract = extrast extrasst extrasct extrract exttract extractt estract extrect extrict extruct 
text = ttext textt toxt teext texxt taxt tixt tenxt 
next = nextt noxt neext nnext nexxt naxt nixt nenxt 
demean = deman demeen demein demeun domean demoan demea demeon 
mean = meen mein meun mea meon meaan meaen 
enigma = enigme enigmi enigmu onigma eigma enigmo enigmaa 
malignant = mallignant malignantt melignant malignent milignant malignint mulignant malignunt malignat 
defame = defeme defime defume dofame defamo defome defaame 
became = besame bessame bescame beceme becime becume bocame becamo 
are = arre ure aro aare aere aire aore aure eare 
carve = cerve corve sarve ssarve scarve carrve carf cirve carvo 
clothe = slothe sslothe sclothe cllothe clotthe clotho cclothe clothee clothhe 
close = slose sslose sclose cllose closo cclose closee cloose closse 
defeat = defat defeatt defeet defeit defeut dofeat defoat defeot 
eat = eatt eet eit eut eot eaat eaet 
beat = beatt beit beut beot beaat beaet beait beaot 
treat = trat trreat ttreat treatt treet treit treut troat 
rascal = rassal rasssal rasscal rrascal rascall rescal rascel riscal rascil ruscal 
radical = radisal radissal radiscal rradical radicall redical radicel ridical radicil rudical 
local = losal lossal loscal llocal locall locel locil locul 
vocal = vosal vossal voscal vocall vocel vocil vocul vocol 
depose = dopose deposo ddepose deepose deposee depoose deppose deposse depoese depoce 
expose = espose oxpose exposo eexpose exposee expoose exppose exposse exxpose expoese 
element = eelment ellement elementt olement eloment elemont elemet eelement eleement elemeent 
enemy = onemy enomy eemy eenemy eneemy enemmy ennemy enemyy enenmy enempy 
remedy = rremedy romedy remody remeddy reemedy remeedy remmedy remedyy wremedy 
benefit = benefitt bonefit benofit beefit bbenefit beenefit beneefit beneffit benefiit bennefit 
defender = defenderr dofender defonder defendor defeder ddefender defendder deefender defeender defendeer 
defend = dofend defond defed ddefend defendd deefend defeend deffend defennd deveend 
ravel = rravel ravell rafl rivel ruvel ravol rovel raavel 
gravel = grravel gravell grafl grevel grivel gruvel gravol 
grovel = grrovel grovell grofl grovol groveel ggrovel groovel grovvel 
shrivel = shrrivel shrivell shrifl shrivol shriveel shhrivel shriivel sshrivel 
tragedy = trragedy ttragedy tregedy trigedy trugedy tragody trogedy 
majesty = majestty mejesty mijesty mujesty majosty mojesty maajesty 
comedy = somedy ssomedy scomedy comody ccomedy comeddy comeedy commedy coomedy comedyy 
deposit = depositt doposit ddeposit deeposit deposiit depoosit depposit depossit depoesit 
bitten = biten bittten bitton bitte bbitten bitteen biitten bittenn 
mitten = miten mittten mitton mitte mitteen miitten mmitten mittenn 
smitten = smiten smittten smitton smitte smitteen smiitten smmitten smittenn ssmitten 
kitten = kiten kittten kitton kitte kitteen kiitten kkitten kittenn 
level = elvel llevel levell lefl lovel levol leevel leveel 
bevel = bevell befl bovel bevol bbevel beevel beveel bevvel bevle 
seven = sefn soven sevon seve seeven seveen sevenn sseven sevven ceven 
patent = pattent patentt petent pitent putent patont patet 
potent = pottent potentt potont potet poteent potennt pootent ppotent 
pungent = pungentt pungont punget pugent pungeent punggent punngent pungennt ppungent 
open = opon opeen openn oopen oppen oepen opan opin epen 
bucket = busket bussket buscket buckett buckot bbucket buccket buckeet buckket 
rocket = rosket rossket roscket rrocket rockett rockot roccket rockeet rockket roocket 
pocket = posket possket poscket pockett pockot poccket pockeet pockket poocket ppocket 
socket = sosket sossket soscket sockett sockot soccket sockeet sockket soocket ssocket 
token = ttoken tokon tokeen tokken tokenn tooken toeken tokan tokin 
taken = ttaken teken tiken tuken takon taaken taeken 
broken = brroken brokon bbroken brokeen brokken brokenn brooken broeken bwroken 
shaken = sheken shiken shuken shakon shoken shaaken shaeken 
poem = poom poeem poemm pooem ppoem poenm poemp poam poim 
poet = poett poot poeet pooet ppoet poat poit peet 
poetry = potry poetrry poettry pootry poeetry pooetry ppoetry poetryy 
diet = deit diett diot ddiet dieet diiet deiet diat diit 
item = ittem itom iteem iitem itemm eitem itenm itemp itam 
strident = strrident sttrident stridentt stridont stridet striddent strideent striident stridennt 
silent = sielnt sillent silentt silont silet sileent siilent silennt ssilent 
admit = admitt edmit idmit udmit odmit aadmit aedmit 
adrift = adrrift adriftt edrift idrift udrift odrift aadrift 
adopt = adoptt edopt idopt udopt odopt aadopt aedopt 
cadet = sadet ssadet scadet cadett cedet cidet cudet cadot 
nickel = niskel nisskel nisckel nickell nickol nicckel nickeel niickel nickkel 
chicken = shicken chisken sshicken chissken schicken chiscken chickon chicke cchicken chiccken 
wicked = wisked wissked wiscked wickod wiccked wickedd wickeed wiicked wickked wwicked 
ticket = tisket tissket tiscket tticket tickett tickot ticcket tickeet tiicket tickket 
brier = breir brrier brierr brior bbrier brieer briier breier 
bribery = brribery briberry bribory bbribery bribbery bribeery briibery briberyy 
omen = omon ome omeen ommen omenn oomen oemen onmen ompen oman 
moment = momentt momont momet momeent mmoment momment momennt mooment moement 
ailment = aillment ailmentt eilment iilment uilment ailmont ailmet oilment 
driven = drriven drifn drivon ddriven driveen driiven drivenn drivven dreiven 
raven = rraven rafn reven ruven ravon roven raaven raeven 
haven = hafn heven hiven huven havon hoven haaven 
linen = llinen linon lineen liinen linnen linenn leinen linan linin 
children = shildren sshildren schildren childrren chilldren childron childre cchildren childdren childreen 
golden = gollden goldon golde goldden goldeen ggolden goldenn goolden goelden 
stolen = stoeln stollen sttolen stoleen stolenn stoolen sstolen stoelen 
resident = rresident residentt rosident residont residet residdent reesident resideent resiident residennt 
decrepit = desrepit dessrepit descrepit decrrepit decrepitt docrepit decropit deccrepit ddecrepit deecrepit 
lintel = llintel lintell linttel lintol litel linteel liintel linntel 
novel = novell nofl novol noveel nnovel noovel novvel noevel novle 
gospel = gospell gospol gospeel ggospel goospel gosppel gosspel goespel gosple 
swivel = swivell swifl swivol swiveel swiivel sswivel swivvel swwivel sweivel 
life = llife lifo lifee liffe liife leife livee lifa lifi 
wife = wifo wifee wiffe wiife wwife weife wivee wifa wifi wifen 
rife = rrife rifo rifee riffe riife reife wrife rivee rifa 
ripen = rripen ripon ripeen riipen ripenn rippen reipen wripen ripan 
aspen = espen ispen uspen aspon aspe ospen aaspen 
absent = absentt ebsent ibsent ubsent absont abset obsent 
insistent = insisttent insistentt insistont insistet isistent insisteent iinsistent insiistent innsistent insistennt 
rivet = rrivet rivett rivot riveet riivet rivvet reivet wrivet 
driven = drriven drifn drivon ddriven driveen driiven drivenn drivven dreiven 
noted = notted notod notedd noteed nnoted nooted noeted notad notid 
potent = pottent potentt potont potet poteent potennt pootent ppotent 
ardent = erdent ordent arrdent ardentt irdent urdent ardont ardet 
garden = gerden gorden garrden girden gurden gardon garde 
insist = insistt isist iinsist insiist innsist inssist insisst einsist inseist 
inflict = inflist inflisst inflisct infllict inflictt iflict inflicct infflict iinflict infliict 
spoken = spokon spokeen spokken spokenn spooken sppoken sspoken spoeken cpoken 
waken = weken wiken wuken wakon waaken waeken waiken 
taken = ttaken teken tiken tuken takon taaken taeken 
token = ttoken tokon tokeen tokken tokenn tooken toeken tokan tokin 
event = eventt efnt ovent evont evet eevent eveent evennt evvent 
expend = espend oxpend expond exped expendd eexpend expeend expennd exppend exxpend 
eminent = eminentt ominent eminont eminet emient eeminent emineent emiinent emminent eminnent 
denizen = denisen donizen denizon deizen denize ddenizen deenizen denizeen deniizen dennizen 
specimen = spesimen spessimen spescimen spocimen specimon specime speccimen speecimen specimeen speciimen 
evidently = evidentlly evidenttly ovidently evidontly evidetly eviddently eevidently evideently eviidently 
boot = boott bboot booot boeot booet beot boet bonot 
hoof = hof hooff hhoof hooof hoeof hooef hoove heof hoef 
smooth = smoth smootth smoothh smmooth smoooth ssmooth smoeoth smooeth 
eleven = eelven elleven elefn oleven eloven elevon eleve eeleven eleeven eleveen 
level = elvel llevel levell lefl lovel levol leevel leveel 
bevel = bevell befl bovel bevol bbevel beevel beveel bevvel bevle 
seven = sefn soven sevon seve seeven seveen sevenn sseven sevven ceven 
anoint = anointt enoint inoint unoint aoint anoit onoint 
defendant = defendantt defendent defendint defendunt dofendant defondant defendat defedant 
human = humen humin humun huma humon humaan humaen 
refusal = rrefusal refusall refusel refusil refusul rofusal refusol 
remote = rremote remotte romote remoto reemote remotee remmote remoote 
note = notte noto notee nnote noote noete nota noti nete 
notes = nottes notos notees nnotes nootes notess noetes notec 
vote = votte voto votee voote vvote voete vota voti vete 
agony = egony igony ugony agoy ogony aagony aegony 
canopy = sanopy ssanopy scanopy cenopy cinopy cunopy caopy conopy 
balcony = balsony balssony balscony ballcony belcony bilcony bulcony balcoy 
ebony = obony eboy ebbony eebony ebonny eboony ebonyy eboeny abony ibony 
erect = erest eresst eresct errect erectt orect eroct erecct eerect ereect 
elect = eelct elest elesst elesct ellect electt olect eloct elecct eelect 
neglect = negelct neglest neglesst neglesct negllect neglectt noglect negloct neglecct neeglect 
respect = respest respesst respesct rrespect respectt rospect respoct respecct reespect respeect 
deficit = defisit defissit defiscit deficitt doficit deficcit ddeficit deeficit defficit defiicit 
centigram = sentigram ssentigram scentigram centigrram centtigram centigrem centigrim centigrum contigram cetigram 
destiny = desttiny dostiny destiy ddestiny deestiny destiiny destinny desstiny destinyy 
contend = sontend ssontend scontend conttend contond conted cotend ccontend contendd conteend 
second = sesond sessond sescond socond secod seccond secondd seecond seconnd secoond 
consent = sonsent ssonsent sconsent consentt consont conset cosent cconsent conseent connsent 
compel = sompel ssompel scompel compell comel compol ccompel compeel commpel 
talon = tallon ttalon telon tilon tulon talo tolon 
felon = fellon folon felo feelon ffelon felonn feloon feloen fleon 
felony = fellony folony feloy feelony ffelony felonny feloony felonyy feloeny 
melon = mellon molon melo meelon mmelon melonn meloon meloen mleon 
pacify = pasify passify pascify pecify picify pucify pocify 
magnify = megnify mignify mugnify mognify maagnify maegnify maignify 
amplify = ampllify amlify emplify implify umplify omplify aamplify 
gratify = grratify grattify gretify gritify grutify grotify graatify 
piston = pistton pisto piiston pistonn pistoon ppiston pisston pistoen peiston 
custom = sustom ssustom scustom custtom ccustom customm custoom cusstom cuustom 
custody = sustody ssustody scustody custtody ccustody custoddy custoody cusstody cuustody 
customer = sustomer ssustomer scustomer customerr custtomer customor ccustomer customeer custommer custoomer 
ballot = balot balllot ballott bellot billot bullot bollot 
gallop = galop galllop gellop gillop gullop gollop 
gallon = galon galllon gellon gillon gullon gallo gollon 
edit = editt odit eddit eedit ediit edeit adit idit endit 
merit = merrit meritt morit meerit meriit mmerit mereit marit 
exit = exitt esit oxit eexit exiit exxit exeit axit ixit 
weak = wak weik weuk woak weok weaak weaek weaik 
speak = spak speek speik speuk spoak speok speaak 
sneak = snak sneek sneik sneuk snoak sneok sneaak 
streak = strak strreak sttreak streek streik streuk stroak streok 
bush = bbush bushh bussh buush buch busch buzh bunsh besh 
bushy = bbushy bushhy busshy buushy bushyy buchy buschy brushy buzhy 
push = pushh ppush pussh puush puch pusch prush puzh pash 
cabinet = sabinet ssabinet scabinet cabinett cebinet cibinet cubinet cabinot cabiet 
accident = acident ascident acsident asscident acssident asccident acscident accidentt eccident iccident 
prominent = prrominent prominentt prominont prominet promient promineent promiinent promminent prominnent prominennt 
animal = animall enimal animel inimal animil unimal animul aimal 
pelican = pelisan pelissan peliscan pellican pelicen pelicin pelicun polican pelica 
dominant = dominantt dominent dominint dominunt dominat domiant dominont 
edify = odify eddify eedify ediffy ediify edifyy edeify edivey adify idify 
verify = verrify frify vorify veerify veriffy veriify vverify verifyy vereify 
petrify = petrrify pettrify potrify peetrify petriffy petriify ppetrify petrifyy 
notify = nottify notiffy notiify nnotify nootify notifyy noetify noteify notivey 
to = tto te tou tuo tu taa tae tai 
atom = attom etom itom utom otom aatom aetom 
into = intto ito iinto innto intoo intoe einto inte 
lion = lian llion lio liion lionn lioon lioen leion linon 
lemon = elmon llemon lomon lemo leemon lemmon lemonn lemoon lemoen 
heron = herron horon heeron hheron heronn heroon heroen haron 
mason = mison muson maso moson maason maeson maison maoson 
medicine = medisine medissine mediscine modicine medicino medicie mediccine meddicine meedicine medicinee 
precipice = presipice precipise pressipice precipisse prescipice precipisce prrecipice procipice precipico preccipice 
deficit = defisit defissit defiscit deficitt doficit deficcit ddeficit deeficit defficit defiicit 
family = familly femily fimily fumily fomily faamily faemily 
mutiny = muttiny mutiy mutiiny mmutiny mutinny muutiny mutinyy muteiny nmutiny 
paucity = pausity paussity pauscity paucitty peucity piucity puucity poucity 
infinite = infinitte infinito ifinite infiite infinitee inffinite iinfinite infiinite infiniite innfinite 
intimate = inttimate intimatte intimete intimite intimute intimato itimate intimote 
protest = prrotest prottest protestt protost proteest prootest pprotest protesst 
protect = protesst protesct prrotect prottect protectt protoct protecct proteect prootect pprotect 
button = buton buttton butto bbutton buttonn buttoon buutton 
mutton = muton muttton mutto mmutton muttonn muttoon muutton 
contain = sontain ssontain scontain conttain contein contiin contuin contai cotain 
contented = sontented ssontented scontented conttented contentted contonted contentod conteted cotented ccontented 
content = sontent ssontent scontent conttent contentt contont contet cotent ccontent conteent 
contend = sontend ssontend scontend conttend contond conted cotend ccontend contendd conteend 
democrat = demosrat demossrat demoscrat democrrat democratt democret democrit democrut domocrat 
domestic = domestis domestiss domestisc domesttic domostic domesticc ddomestic domeestic domestiic dommestic 
nominate = nominatte nominete nominite nominute nominato nomiate nominote 
dominance = dominanse dominansse dominansce dominence dominince dominunce dominanco dominace domiance 
dominant = dominantt dominent dominint dominunt dominat domiant dominont 
more = morre moro moree mmore moore moere mowre nmore mpore 
tore = torre ttore toro toree toore toere towre tora 
store = storre sttore storo storee stoore sstore stoere ctore 
chore = sshore schore chorre choro cchore choree chhore choore choere 
nobody = nobbody noboddy nnobody noobody noboody nobodyy noebody noboedy nebody nobedy 
consider = sonsider ssonsider sconsider considerr considor cosider cconsider considder consideer consiider 
justify = justtify justiffy justiify jjustify jusstify juustify justifyy justeify juctify 
glorify = glorrify gllorify gloriffy gglorify gloriify gloorify glorifyy gloerify 
velvet = vellvet velvett flvet velft volvet velvot veelvet velveet 
helmet = hellmet helmett holmet helmot heelmet helmeet hhelmet helmmet 
pagan = pegan pagen pigan pagin pugan pagun paga 
vacant = vasant vassant vascant vacantt vecant vacent vicant vacint vucant vacunt 
husband = husbend husbind husbund husbad husbond husbaand husbaend 
an = un aan aen ain aon aun ean een ein 
dread = drad drread dreed dreid dreud droad dreod 
bread = brread breid breud breod breaad breaed breaid breaod 
tread = trread ttread treid treud troad treod treaad treaed 
thread = thrad thrread tthread threed threid threud throad threod 
ecstasy = esstasy essstasy escstasy ecsttasy ecstesy ecstisy ecstusy ocstasy 
obstacle = obstacel obstasle obstassle obstascle obstaclle obsttacle obstecle obsticle obstucle obstaclo 
constant = sonstant ssonstant sconstant consttant constantt constent constint constunt constat costant 
distant = disttant distantt distent distint distunt distat distont 
general = generral generall generel generil generul goneral genoral geeral 
informal = inforrmal informall informel informil informul iformal informol 
convent = sonvent ssonvent sconvent conventt confnt convont convet covent cconvent conveent 
client = cleint slient sslient sclient cllient clientt cliont cliet cclient clieent 
amass = amas emass amess imass umass amuss omass 
mass = maass maess maiss maoss mauss meass meess meiss meoss meuss 
beaver = baver beaverr beafr beever beiver beuver boaver beavor 
bead = beed beid beud boad beod beaad beaed 
beam = bam beem beim beum boam beom beaam 
bean = bein beun boan bea beon beaan beaen beain 
dogmatic = dogmatis dogmatiss dogmatisc dogmattic dogmetic dogmitic dogmutic dogmotic 
ecstatic = esstatic ecstatis essstatic ecstatiss escstatic ecstatisc ecsttatic ecstattic ecstetic ecstitic 
vanity = vanitty venity vinity vunity vaity vonity vaanity 
gravity = grravity gravitty grevity grivity gruvity grovity graavity 
eaves = aves eafs eeves eives euves oaves eavos eoves 
cheap = sheap ssheap scheap cheip cheup choap cheop cheaap 
sheath = shath sheatth sheeth sheith sheuth shoath sheoth 
race = rase rasse rasce rrace rece ruce raco roce 
brace = brase brasse brasce brrace brece brice bruce braco 
trace = trase trasse trasce trrace ttrace trece traco troce traace 
face = fase fasse fasce fece fice fuce faco foce 
alive = allive alif elive ilive ulive alivo aalive 
live = llive lif livo livee liive livve leive liva livi 
click = clisk sslick clissk sclick clisck cllick cclick clicck cliick clickk 
cricket = sricket crisket ssricket crissket scricket criscket crricket crickett crickot ccricket 
dead = deid deud doad deod deaad deaed deaid deaod 
head = heid heud hoad heod heaad heaed heaid heaod 
stead = stad sttead steid steud stoad steod steaad steaed 
spread = sprad sprread spreid spreud sproad spreod spreaad spreaed 
feather = featherr featther feether feither feuther foather feathor feother 
leather = elather leatherr lleather leatther leether leither leuther leathor 
weather = wather weatherr weatther weether weither weuther woather weathor 
bear = beor bearr beir beur beaar beaer beair 
pear = peor pearr peir peur poar peaar peaer 
tear = teer teor tearr ttear teir teur toar 
mice = mise misse misce mico micce micee miice mmice meice nmice 
price = prise prisse prisce prrice prico pricce pricee priice pprice 
advice = advisse advisce edvice idvice udvice advico odvice 
pastry = pastrry pasttry pestry pistry pustry postry paastry 
hasty = hastty hesty histy husty hosty haasty haesty 
cold = ssold colld ccold coldd coold coeld celd conld cuold 
scold = ssold sssold sscold scolld sccold scoldd scoold scoeld 
death = dath deatth deeth deith deuth doath deoth 
breath = brath brreath breatth breeth breith breuth broath breoth 
ready = rady rready reidy reudy roady reody reaady reaedy 
steady = stady stteady steedy steidy steudy stoady steody 
dragon = drragon dregon drigon drugon drago drogon draagon 
wagon = wegon wigon wugon wago wogon waagon waegon 
agony = egony igony ugony agoy ogony aagony aegony 
intensify = inttensify intonsify intesify itensify inteensify intensiffy iintensify intensiify inntensify intennsify 
edify = odify eddify eedify ediffy ediify edifyy edeify edivey adify idify 
verify = verrify frify vorify veerify veriffy veriify vverify verifyy vereify 
petrify = petrrify pettrify potrify peetrify petriffy petriify ppetrify petrifyy 
cake = ssake scake ceke cike cuke cako caake 
snake = sneke snike snuke snako snoke snaake snaeke 
forsake = forrsake forseke forsike forsuke forsako forsoke forsaake 
grace = grase grasse grasce grrace grece grice gruce graco 
race = rase rasse rasce rrace rece ruce raco roce 
brace = brase brasse brasce brrace brece brice bruce braco 
trace = trase trasse trasce trrace ttrace trece traco troce traace 
fuel = fuell fuol fueel ffuel fuuel fule fruel veuel fual 
tinsel = tinsell ttinsel tinsol tisel tinseel tiinsel tinnsel tinssel 
morsel = morrsel morsell morsol morseel mmorsel moorsel morssel moersel 
lintel = llintel lintell linttel lintol litel linteel liintel linntel 
tallow = talow talllow ttallow tellow tillow tullow tollow 
shallow = shalow shalllow shellow shillow shullow shollow 
billow = bilow billlow bbillow biillow billoow billoww billoew 
pillow = pilow pilllow piillow pilloow ppillow pilloww pilloew 
have = haf heve huve havo haave haeve haive haove 
solve = sollve solf solvo solvee soolve ssolve solvve soelve colve 
sleeve = sleve seleve slleeve sleef sloeve sleove sleevo sleeeve sleevee 
geese = gese goese geose geeso geeese geesee ggeese geesse geece 
didactic = didastic didactis didasstic didactiss didasctic didactisc didacttic didectic didictic diductic 
gigantic = gigantis gigantiss gigantisc giganttic gigentic gigintic giguntic gigatic 
antic = antiss antisc anttic entic intic untic atic ontic 
tactic = tastic tactis tasstic tactiss tasctic tactisc ttactic tacttic tectic tictic 
leave = elave lleave leeve leive leuve loave leavo leove 
heave = heaf heeve heive heuve hoave heavo heove 
weave = weaf weeve weive weuve woave weavo weove 
follow = folow folllow ffollow foollow folloow followw foellow 
hollow = holow holllow hhollow hoollow holloow holloww hoellow 
angelic = angelis angeliss angelisc angellic engelic ingelic ungelic angolic agelic 
density = densitty donsity desity ddensity deensity densiity dennsity denssity densityy 
semester = semesterr semestter somester semoster semestor seemester semeester semesteer semmester 
gardener = gerdener gordener garrdener gardenerr girdener gurdener gardoner gardenor gardeer 
target = terget torget tarrget ttarget targett tirget turget targot 
garment = germent gorment garrment garmentt girment gurment garmont garmet 
spice = spise spisse spisce spico spicce spicee spiice sppice sspice speice 
slice = slise slisse slisce sllice slico slicce slicee sliice sslice 
deaf = daf deef deif deuf doaf deof deaaf 
threat = thrat thrreat tthreat threatt threet threit threut threot 
wealth = walth weallth wealtth weelth weilth weulth woalth weolth 
instead = instad insttead insteed insteid insteud instoad istead insteod 
forgive = forrgive forgif forgivo forgivee fforgive forggive forgiive foorgive forgivve 
give = gif givo givee ggive giive givve geive dgive giva givi 
live = llive lif livo livee liive livve leive liva livi 
pavement = pavementt pafment pevement pivement puvement pavoment pavemont pavemet 
statement = sttatement stattement statementt stetement stitement stutement statoment statemont statemet 
further = furrther furtherr furtther furthor furtheer ffurther furthher 
lurk = lurrk llurk lurkk luurk luwrk lrurk lunrk lerk 
absurd = absurrd ebsurd ibsurd ubsurd obsurd aabsurd aebsurd 
diurnal = diurrnal diurnall diurnel diurnil diurnul diurnol diurnaal 
basic = basiss basisc besic bisic busic bosic baasic 
ethics = ethiss ethisss ethiscs etthics othics ethiccs eethics ethhics ethiics ethicss 
public = publis publiss publisc publlic pubblic publicc publiic ppublic puublic 
white = whitte whito whitee whhite whiite wwhite wheite whita whiti 
skate = skatte skete skite skute skato skote skaate 
spade = spede spide spude spado spode spaade spaede 
poke = poko pokee pokke pooke ppoke poeke poka poki poken ponke 
wild = willd wildd wiild wwild weild winld wald wuld 
wind = wid windd wiind winnd wwind weind wond wund waand 
windy = widy winddy wiindy winndy wwindy windyy weindy wandy wendy 
kick = kisk kissk kisck kicck kiick kkick kickk keick kinck kack 
pick = pisk pissk pisck picck piick pickk ppick peick pinck paack 
brick = brissk brisck brrick bbrick bricck briick brickk breick bwrick 
trick = trisk trissk trisck trrick ttrick tricck triick trickk 
rare = rere rore rrare rarre rire rure raro 
bare = bere bire bure baro baare baere 
dare = dere dore darre dure daro daare 
mare = marre mure maro maare maere maire maore maure meare 
emulate = emullate emulatte emulete emulite emulute omulate emulato emulote 
speculate = spesulate spessulate spesculate specullate speculatte speculete speculite speculute spoculate speculato 
perspire = perrspire perspirre porspire perspiro peerspire perspiree perspiire pperspire persppire 
fireman = firreman firemin firemun firoman firema firemon firemaan firemaen 
fire = firre firo firee ffire fiire feire fiwre veire fira 
mire = mirre miro miree miire mmire meire miwre nmire mpire 
meeting = meetting moeting meoting meetig meeeting meetingg meetiing mmeeting meetinng 
discreet = discret dissreet disssreet disscreet discrreet discreett discroet discreot disccreet ddiscreet 
meet = meett moet meot meeet mmeet nmeet mpeet maet 
beet = beett boet beot bbeet beeet baet biet beit 
colony = solony ssolony scolony collony coloy ccolony colonny coolony coloony 
develop = devellop deflop dovelop devolop ddevelop deevelop deveelop develoop developp 
golf = gollf golff ggolf goolf goelf golve dgolf gelf gonlf 
god = godd ggod goed dgod ged gond goud guod gid 
got = gott ggot goot goet dgot gont guot gat gaat 
shore = shorre shoro shoree shhore shoore sshore shoere schore 
wore = worre woro woree woore wwore woere wowre wora wori 
more = morre moro moree mmore moore moere mowre nmore mpore 
tore = torre ttore toro toree toore toere towre tora 
case = sase ssase scase cese cise cuse caso cose 
chase = shase sshase schase chese chise chuse chaso 
vase = vese vuse vaso vose vaase vaese vaise vaose 
match = matsh matssh matsch mattch metch mitch mutch motch 
patch = patsh patssh patsch pattch petch putch potch paatch 
snatch = snatsh snatssh snatsch snattch snetch snutch snotch snaatch 
dispatch = dispatsh dispatssh dispatsch dispattch dispetch dispitch disputch dispotch 
hare = hore harre hure haro haare haere haire haore 
flare = flere flore flarre fllare flire flure flaro 
glare = glere glore glarre gllare glire glure glaro 
share = shere sharre shure sharo shaare shaere shaire 
pitch = pitsh pitssh pitsch pittch pitcch pitchh piitch ppitch peitch 
witch = witsh witssh witsch wittch witcch witchh wiitch wwitch weitch 
switch = switsh switssh switsch swittch switcch switchh swiitch sswitch swwitch 
twitch = twitsh twitssh twitsch ttwitch twittch twitcch twitchh twiitch 
mince = minse minsse minsce minco mincce mincee miince mmince minnce meince 
wince = winse winsse winsce winco wice wincce wincee wiince winnce wwince 
prance = pranse pransse pransce prrance prence prunce pranco prace pronce 
chance = shance chanse sshance chansse schance chansce chence chince chunce chanco 
bundle = bundel bundlle bundlo budle bbundle bunddle bundlee bunndle buundle 
dwindle = dwindel dwindlle dwindlo dwidle ddwindle dwinddle dwindlee dwiindle dwinndle 
handle = handel handlle hendle hindle hundle handlo hadle hondle 
fondle = fondel fondlle fondlo fodle fonddle fondlee ffondle fonndle foondle 
mitt = mit mittt miitt mmitt meitt nmitt 
ditty = dity dittty dditty diitty dittyy deitty 
kitty = kity kittty kiitty kkitty kittyy keitty 
little = litle littel llittle littlle litttle littlo littlee liittle 
billet = bilet bilelt billlet billett billot bbillet billeet biillet 
millet = milet milelt milllet millett millot milleet miillet 
skillet = skilet skilelt skilllet skillett skillot skilleet skiillet skkillet 
sullen = sulen suleln sulllen sullon sulle sulleen sullenn 
mellow = melow melllow mollow meellow mmellow melloow melloww 
fellow = felow felllow feellow ffellow felloow felloww felloew 
care = cere sare ssare carre cire caro caare 
scare = scere ssare sssare sscare scarre scire scure scaro 
wash = wesh wush wosh waash waesh waish waosh waush 
watch = watsh watssh watsch wattch wetch wutch wotch waatch 
wander = wanderr wender wunder wandor waander waender wainder waonder 
prison = prrison priso priison prisonn prisoon pprison prisson prisoen preison 
crimson = srimson ssrimson scrimson crrimson crimso ccrimson criimson crimmson crimsonn crimsoon 
limit = llimit limitt liimit limiit limmit leimit limeit linmit 
digit = digitt ddigit diggit diigit digiit deigit digeit didgit dingit 
brazen = brrazen brasen brezen brizen bruzen brazon brozen 
frozen = frrozen frosen frozon frozeen ffrozen frozenn froozen frozzen froezen 
oath = oatth oeth oith outh ooth oaath oaeth 
poach = poash poassh poasch poech poich poaach poaech poaich 
oak = oek ouk ook oaak oaek oaik oaok oauk 
device = devisse devisce dovice devico devicce ddevice deevice devicee deviice devvice 
entice = entise entisse entisce enttice ontice entico etice enticce eentice enticee 
tablet = tabelt tabllet ttablet tablett teblet tiblet tublet tablot 
planet = pllanet planett plenet plinet plunet planot plaet plonet 
hatchet = hatshet hatsshet hatschet hattchet hatchett hetchet hitchet hutchet hatchot 
triplet = tripelt trriplet tripllet ttriplet triplett triplot tripleet triiplet tripplet 
spare = spere sparre spure sparo spaare spaere spaire 
snare = snere snarre snire snure snaro snaare 
basis = besis bisis busis bosis baasis baesis baisis 
basic = basiss basisc besic bisic busic bosic baasic 
title = titel titlle ttitle titlo titlee tiitle teitle titla 
rifle = rifel rrifle riflle riflo riflee riifle reifle wrifle 
bible = bibel biblle biblo bbible bibble biblee biible beible bibla 
refresh = rrefresh refrresh rofresh refrosh reefresh refreesh reffresh refreshh 
record = resord ressord rescord rrecord recorrd rocord reccord recordd reecord recoord 
predict = predist predisst predisct prredict predictt prodict predicct preddict preedict prediict 
expect = expest expesst expesct expectt espect oxpect expoct expecct eexpect expeect 
algebra = algebrra allgebra elgebra algebre ilgebra algebri ulgebra algebru algobra 
amended = imended umended amonded amendod ameded omended aamended aemended 
relevant = reelvant rrelevant rellevant relevantt relevent relevint relevunt rolevant relovant relevat 
arrow = arow errow orrow arrrow irrow urrow 
marrow = marow merrow marrrow mirrow murrow 
narrow = narow nerrow norrow narrrow nirrow nurrow 
sparrow = sparow sperrow sporrow sparrrow spirrow spurrow 
eligible = eligibel elligible eligiblle oligible eligiblo eligibble eeligible eligiblee eliggible eliigible 
flexible = felxible flexibel fllexible flexiblle flesible floxible flexiblo flexibble fleexible flexiblee 
punish = puish punishh puniish punnish ppunish punissh puunish puneish punich 
banish = benish binish bunish baish bonish baanish baenish 
vanish = venish vinish vunish vaish vonish vaanish vaenish 
adder = ader adderr edder idder addor aadder aedder aidder 
ladder = lader ladderr lladder ledder lidder ludder laddor lodder 
rudder = rrudder rudderr ruddor ruddder ruddeer ruudder ruddar 
fodder = foder fodderr foddor foddder foddeer ffodder foodder foedder 
zone = sone zono zoe zonee zonne zoone zzone zoene zona zoni 
alone = allone elone ilone ulone alono olone aalone 
wheel = whel wheell whoel wheol wheeel whheel wwheel whele 
reel = rreel reell roel reol reeel rele wreel 
feel = fel feell foel feol feeel ffeel fele veeel 
which = whish whissh whisch whicch whhich whichh whiich wwhich wheich whinch 
rich = rish rissh risch rrich ricch richh riich reich wrich 
enrich = enrish enrissh enrisch enrrich onrich erich enricch eenrich enrichh enriich 
pawn = pewn piwn puwn pown paawn paewn paiwn 
spawn = spewn spiwn spuwn spown spaawn spaewn spaiwn 
brawn = brrawn brewn briwn bruwn braawn braewn braiwn 
lawn = llawn lewn liwn luwn lown laawn laewn 
first = firrst firstt ffirst fiirst firsst feirst firct 
thirst = thirrst tthirst thirstt thhirst thiirst thirsst theirst 
thirsty = thirrsty tthirsty thirstty thhirsty thiirsty thirssty thirstyy 
firstly = firrstly firstlly firsttly ffirstly fiirstly firsstly firstlyy 
fatten = faten fattten fetten fitten futten fatton fatte 
bitten = biten bittten bitton bitte bbitten bitteen biitten bittenn 
mitten = miten mittten mitton mitte mitteen miitten mmitten mittenn 
smitten = smiten smittten smitton smitte smitteen smiitten smmitten smittenn ssmitten 
enslave = ensllave enslaf ensleve enslive ensluve onslave enslavo eslave 
slave = sllave slaf sleve slive sluve slavo slove 
cavity = savity ssavity scavity cavitty cevity civity cuvity covity 
gravity = grravity gravitty grevity grivity gruvity grovity graavity 
ahead = ahad ehead aheed ihead aheid uhead aheud ahoad 
head = heid heud hoad heod heaad heaed heaid heaod 
inert = inerrt inertt inort iert ineert iinert innert einert 
invert = inverrt invertt infrt invort ivert inveert iinvert innvert 
avert = averrt avertt afrt evert ivert uvert avort 
alert = aelrt alerrt allert alertt elert ilert ulert alort 
namesake = nemesake nameseke nimesake namesike numesake namesuke namosake namesako 
same = seme sime sume samo saame saeme saime 
name = neme nime nume namo nome naame naeme 
tame = ttame teme tume tamo taame taeme taime taome 
dirt = dirrt dirtt ddirt diirt deirt diwrt dinrt dert 
dirty = dirrty dirtty ddirty diirty dirtyy deirty diwrty dinrty 
shirt = shirrt shirtt shhirt shiirt sshirt sheirt chirt 
flirt = flirrt fllirt flirtt fflirt fliirt fleirt fliwrt 
riddle = ridle riddel rriddle riddlle riddlo ridddle riddlee riiddle 
middle = midle middel middlle middlo midddle middlee miiddle mmiddle 
fiddle = fidle fiddel fiddlle fiddlo fidddle fiddlee ffiddle fiiddle 
puddle = pudle puddel puddlle puddlo pudddle puddlee ppuddle puuddle 
term = terrm tterm torm teerm termm tarm tewrm 
fern = ferrn forn feern ffern fernn farn fewrn veern 
herb = herrb horb herbb heerb hherb harb hewrb 
infer = inferr infor ifer infeer inffer iinfer innfer einfer infar 
own = ownn oown owwn oewn ewn onwn ouwn uown iwn 
blown = bllown bblown blownn bloown blowwn bloewn blewn blonwn blouwn 
thrown = thrrown tthrown thhrown thrownn throown throwwn throewn thwrown 
owner = ownerr ownor owneer ownner oowner owwner oewner ownar 
loss = los lloss looss losss loess locs losc 
gloss = glos glloss ggloss glooss glosss gloess glocs glosc 
cross = cros sross ssross scross crross ccross crooss crosss 
across = acros asross assross ascross acrross ecross icross ucross 
furry = furrry ffurry fuurry furryy fuwrry furwry frurry 
hurry = hury hurrry hhurry huurry hurryy huwrry hurwry 
curry = cury surry ssurry currry ccurry cuurry curryy 
breeze = breze brreeze breese broeze breoze breezo bbreeze breeeze breezee 
freeze = freze frreeze freese froeze freoze freezo freeeze freezee ffreeze 
sneeze = sneze sneese snoeze sneoze sneezo sneeeze sneezee snneeze ssneeze 
birth = birrth birtth bbirth birthh biirth beirth biwrth binrth 
firth = firrth firtth ffirth firthh fiirth feirth fiwrth veirth 
trunk = trrunk ttrunk tunk truk trunkk trunnk truunk twrunk 
sunk = suk sunkk sunnk ssunk suunk cunk scunk srunk zunk 
shrunk = shrrunk shunk shruk shhrunk shrunkk shrunnk sshrunk shruunk chrunk 
banker = bankerr benker binker bankor bonker baanker baenker bainker 
mix = miix mmix mixx meix nmix mpix mex mox mux 
fix = ffix fiix fixx feix veix finx fex fux faax 
third = thirrd tthird thirdd thhird thiird theird thiwrd thinrd 
thirdly = thirrdly thirdlly tthirdly thirddly thhirdly thiirdly thirdlyy 
girder = girrder girderr girdor girdder girdeer ggirder giirder geirder 
moan = moen moin moun moa moaan moaen moain 
bemoan = bemoen bemoin bemoun bomoan bemoa bemoon bemoaan 
firm = firrm ffirm fiirm firmm feirm fiwrm firnm firmp veirm 
girl = girrl girll ggirl giirl geirl giwrl dgirl ginrl 
birch = birsh birssh birsch birrch bbirch bircch birchh biirch beirch 
chirp = shirp sshirp schirp chirrp cchirp chhirp chiirp chirpp cheirp 
saddle = sadle saddel saddlle seddle siddle suddle saddlo soddle 
huddle = hudle huddel huddlle huddlo hudddle huddlee hhuddle huuddle 
cuddle = cudle cuddel suddle ssuddle scuddle cuddlle cuddlo ccuddle cudddle 
puddle = pudle puddel puddlle puddlo pudddle puddlee ppuddle puuddle 
prize = prrize prise prizo prizee priize pprize prizze preize pwrize 
size = sise sizo sizee siize ssize sizze cize scize zize 
were = werre wero weere weree wwere wewre wera weri wenre 
swerve = swerrve swerf sworve swervo sweerve swervee sswerve swervve swwerve 
pivot = pivott piivot pivoot ppivot pivvot pivoet peivot pivet pinvot 
bigot = bigott bbigot biggot biigot bigoot bigoet beigot bidgot biget 
consist = sonsist ssonsist sconsist consistt cosist cconsist consiist connsist coonsist conssist 
venom = fnom vonom veom veenom venomm vennom venoom vvenom venoem venonm 
verse = verrse frse vorse veerse versee versse vverse varse 
terse = terrse tterse torse terso teerse tersee tersse tarse 
gallant = galant galllant gallantt gellant gallent gillant gallint gullant gallunt 
ballast = balast balllast ballastt bellast ballest billast ballist bullast ballust 
marry = mary morry marrry mirry murry maarry 
carry = cary cerry corry sarry ssarry scarry carrry cirry 
behave = behaf beheve behive behuve bohave behavo behove 
rave = rrave raf reve ruve ravo raave raeve raive 
brave = brrave braf brive bruve brove braave braeve braive 
pave = paf peve pive puve pavo pove paave 
abash = ebash abesh ibash abish ubash abush 
about = abuot abot aboutt ebout ibout ubout obout 
liable = liabel lliable liablle lieble liible liuble liablo lioble 
tribal = trribal triball ttribal tribel tribil tribul tribol 
harrow = harow herrow horrow harrrow hirrow hurrow 
arrow = arow errow orrow arrrow irrow urrow 
narrow = narow nerrow norrow narrrow nirrow nurrow 
six = siix ssix sixx seix cix scix zix sinx sox 
mix = miix mmix mixx meix nmix mpix mex mox mux 
fix = ffix fiix fixx feix veix finx fex fux faax 
often = oftten ofton ofte ofteen offten oftenn ooften oeften oveten 
sweeten = sweten sweetten swoeten sweoten sweeton sweete sweeeten sweeteen sweetenn 
widen = widon widden wideen wiiden widenn wwiden weiden widan widin 
maiden = meiden miiden muiden maidon maide moiden maaiden 
voice = voise voisse voisce voico voicce voicee voiice vooice vvoice voeice 
choice = shoice choise sshoice choisse schoice choisce choico cchoice choicce choicee 
prefer = prrefer preferr profer prefor preefer prefeer preffer pprefer 
exert = exerrt exertt esert oxert exort eexert exeert exxert 
verbal = verrbal verball frbal verbel verbil verbul vorbal verbol 
merchant = mershant mersshant merschant merrchant merchantt merchent merchint merchunt morchant merchat 
abreast = abrast abrreast abreastt ebreast abreest ibreast abreist ubreast abreust abroast 
breakfast = brakfast brreakfast breakfastt breekfast breakfest breikfast breakfist breukfast breakfust broakfast 
err = errr orr eerr ewrr erwr irr 
berry = bery berrry borry bberry beerry berryy barry 
cherry = chery ssherry scherry cherrry chorry ccherry cheerry chherry 
soda = sode sodi sodu sodo sodaa sodae sodai 
sofa = sofe sofi sofu sofo sofaa sofae sofai 
heavy = havy heevy heivy heuvy hoavy heovy heaavy 
heavily = havily heavilly heevily heivily heuvily hoavily heovily 
health = halth heallth healtth heelth heilth heulth hoalth heolth 
head = heid heud hoad heod heaad heaed heaid heaod 
tighten = ttighten tightten tighton tighte tighteen tigghten tighhten tiighten tightenn 
lighten = llighten lightten lighton lighte lighteen ligghten lighhten liighten lightenn 
stir = stirr sttir stiir sstir steir ctir sctir 
skirt = skirrt skirtt skiirt skkirt sskirt skeirt ckirt 
serve = serrve sorve seerve servee sserve servve sarve cerve 
merge = merrge morge mergo meerge mergee mergge mmerge mewrge 
clergy = celrgy slergy sslergy sclergy clerrgy cllergy clorgy cclergy cleergy clerggy 
verdict = verdist verdisst verdisct verrdict verdictt frdict vordict verdicct verddict veerdict 
mute = mutte muto mutee mmute muute nmute mpute mrute muta 
dispute = disputte disputo ddispute disputee diispute disppute disspute dispuute deispute 
acute = asute assute ascute acutte ecute icute ucute acuto 
fabricate = fabrisate fabrissate fabriscate fabrricate fabricatte febricate fabricete fibricate fabricite fubricate 
cultivate = sultivate ssultivate scultivate culltivate culttivate cultivatte cultivete cultivite cultivute cultivato 
damsel = damsell demsel dimsel dumsel damsol domsel daamsel 
chisel = shisel sshisel schisel chisell chisol cchisel chiseel chhisel chiisel 
shudder = shuder shudderr shuddor shuddder shuddeer shhudder sshudder shuudder 
rudder = rrudder rudderr ruddor ruddder ruddeer ruudder ruddar 
publish = publlish pubblish publishh publiish ppublish publissh puublish publeish publich 
public = publis publiss publisc publlic pubblic publicc publiic ppublic puublic 
blanket = bllanket blankett blenket blinket blunket blankot blaket blonket 
tank = ttank tenk tink tunk tak tonk taank 
bank = benk bink bak baank baenk baink baonk baunk 
blank = bllank blenk blunk blak blonk blaank blaenk blaink 
began = begen bogan bega begon begaan begaen begain begaon begaun 
begin = bogin begi bbegin beegin beggin begiin beginn begein bedgin bagin 
befit = befitt bofit bbefit beefit beffit befiit befeit beveit bafit 
between = betwen bettween botween betwoen betweon betwee bbetween beetween betweeen 
droll = drol drroll drolll ddroll drooll droell 
stroll = strol strroll strolll sttroll strooll sstroll 
smell = smel smelll smoll smeell smmell ssmell smlel 
shell = shel shelll sholl sheell shhell sshell shlel 
abrupt = abrrupt abruptt abupt ebrupt ibrupt ubrupt obrupt 
extra = extrra exttra estra extre extri extru oxtra extro 
dogma = dogme dogmi dogmu dogmo dogmaa dogmae dogmai 
logical = logisal logissal logiscal llogical logicall logicel logicil logicul 
jam = jem jim jum jom jaam jaem jaim 
jump = jum jjump jummp jumpp juump junmp jrump jamp 
jug = jugg jjug juug jrug judg jung jeg jaag jaeg jaig 
jig = jigg jiig jjig jeig jidg jing jeg jaag jaeg 
down = ddown downn doown dowwn doewn dewn donwn douwn duown 
downtown = downttown ddowntown downntown downtownn doowntown downtoown dowwntown downtowwn doewntown 
town = ttown townn toown towwn toewn tewn tonwn touwn tuown 
drown = drrown ddrown drownn droown drowwn droewn dwrown drewn dronwn 
flax = fllax flix flox flaax flaex flaix flaox flaux fleax 
index = indes indox idex inddex indeex iindex inndex indexx eindex indax 
fix = ffix fiix fixx feix veix finx fex fux faax 
mix = miix mmix mixx meix nmix mpix mex mox mux 
exalt = exallt exaltt esalt exelt exilt oxalt exolt exaalt 
halt = hallt haltt helt hult holt haalt haelt hailt 
malt = mallt maltt mult maalt maelt mailt maolt mault mealt 
salt = sallt saltt selt sult solt saalt saelt sailt 
girlish = girrlish girllish ggirlish girlishh giirlish girliish girlissh geirlish 
girl = girrl girll ggirl giirl geirl giwrl dgirl ginrl 
build = builld bbuild buildd buiild buuild bueild bruild baild buinld 
guild = guilld guildd gguild guiild guuild gueild gruild dguild gaild 
built = buillt builtt bbuilt buiilt buuilt bueilt bruilt bailt 
guilt = guillt guiltt gguilt guiilt guuilt gueilt gruilt dguilt 
consistent = sonsistent ssonsistent sconsistent consisttent consistentt consistont consistet cosistent cconsistent consisteent 
contingent = sontingent ssontingent scontingent conttingent contingentt contingont continget contigent cotingent ccontingent 
galaxy = gallaxy gelaxy galexy gilaxy galixy gulaxy galuxy 
malady = mallady melady maledy malidy mulady maludy molady 
buckle = buckel buskle busskle busckle bucklle bucklo bbuckle bucckle bucklee buckkle 
duck = dussk dusck ducck dduck duckk duuck druck dack dunck 
truck = trusk trussk trusck trruck ttruck trucck truckk truuck 
stuck = stusk stussk stusck sttuck stucck stuckk sstuck stuuck ctuck 
sedate = sedatte sedete sedite sedute sodate sedato sedote 
date = datte dete dite dute dato daate daete 
distress = distres distrress disttress distross ddistress distreess diistress disstress distresss 
impress = impres imprress imress impross impreess iimpress immpress imppress impresss 
dress = dres drress ddress dreess dresss drecs dresc 
groove = grroove groof groovo groovee ggroove grooove groovve groeove 
groom = grom grroom ggroom groomm grooom groeom grooem gwroom 
room = rom rroom roomm rooom roeom rooem wroom roonm 
broom = brom brroom bbroom broomm brooom broeom brooem bwroom 
angular = anguler angulor angularr angullar engular ingular angulir ungular angulur 
singular = singuler singulor singularr singullar singulir singulur sigular 
particular = perticular particuler porticular particulor partisular partissular partiscular parrticular particularr particullar 
regular = reguler regulor rregular regularr regullar regulir regulur rogular 
colon = solon ssolon scolon collon colo ccolon colonn coolon coloon 
felon = fellon folon felo feelon ffelon felonn feloon feloen fleon 
felony = fellony folony feloy feelony ffelony felonny feloony felonyy feloeny 
bewitch = bewitsh bewitssh bewitsch bewittch bowitch bbewitch bewitcch beewitch bewitchh bewiitch 
witch = witsh witssh witsch wittch witcch witchh wiitch wwitch weitch 
switch = switsh switssh switsch swittch switcch switchh swiitch sswitch swwitch 
encroach = ensroach encroash enssroach encroassh enscroach encroasch encrroach encroech encroich encrouch 
roach = roash roassh roasch rroach roech roich rouch rooch 
coach = soach coash ssoach coassh scoach coasch coech coich 
poach = poash poassh poasch poech poich poaach poaech poaich 
word = worrd wordd woord wword woerd wowrd werd wonrd wourd 
worm = worrm wormm woorm wworm woerm wowrm wornm wormp werm 
world = worrld worlld worldd woorld wworld woerld wowrld werld 
worth = worrth wortth worthh woorth wworth woerth wowrth werth 
brown = brrown bbrown brownn broown browwn broewn bwrown brewn bronwn 
frown = frrown ffrown frownn froown frowwn froewn fwrown verown frewn 
crown = srown ssrown scrown crrown ccrown crownn croown crowwn croewn 
gown = ggown gownn goown gowwn goewn dgown gewn gonwn gouwn guown 
worthy = worrthy wortthy worthhy woorthy wworthy worthyy woerthy wowrthy 
worldly = worrldly worlldly worldlly worlddly woorldly wworldly worldlyy 
work = worrk workk woork wwork woerk wowrk werk wonrk wourk 
worker = worrker workerr workor workeer workker woorker wworker woerker 
haphazard = haphazerd haphazord haphazarrd haphasard hephazard haphezard hiphazard haphizard haphazird 
calvary = calvery calvory salvary ssalvary scalvary calvarry callvary celvary cilvary 
calendar = caelndar calendor salendar ssalendar scalendar calendarr callendar celendar cilendar calendir 
quit = quitt quiit qquit quuit queit qruit qait qunit quat 
quilt = quillt quiltt quiilt qquilt quuilt queilt qruilt qailt 
squint = squintt squit squiint squinnt sqquint ssquint squuint squeint cquint 
quiver = quiverr quifr quivor quiveer quiiver qquiver quuiver quivver queiver 
muscular = musculer musculor mussular musssular musscular muscularr muscullar musculir musculur 
popular = populer populor popularr popullar populir populur 
singular = singuler singulor singularr singullar singulir singulur sigular 
particular = perticular particuler porticular particulor partisular partissular partiscular parrticular particularr particullar 
eject = ejest ejesst ejesct ejectt oject ejoct ejecct eeject ejeect ejject 
reject = rejest rejesst rejesct rreject rejectt roject rejoct rejecct reeject rejeect 
jest = jestt jost jeest jjest jesst ject jesct jext 
just = justt jjust jusst juust juct jusct jrust juzt 
libel = llibel libell libol libbel libeel liibel leibel lible 
label = llabel labell lebel lubel labol lobel laabel laebel 
angel = angell engel ingel ungel angol agel ongel 
quick = quisk quissk quisck quicck quiick quickk qquick quuick queick qruick 
quicksand = quisksand quissksand quiscksand quicksend quicksind quicksund quicksad quicksond 
quicken = quisken quissken quiscken quickon quicke quiccken quickeen quiicken quickken quickenn 
degree = degre degrree dogree degroe degreo ddegree deegree degreee deggree 
decree = decre desree dessree descree decrree docree decroe decreo deccree ddecree 
owl = owll oowl owwl oewl ewl onwl ouwl uowl 
prowl = prrowl prowll proowl pprowl prowwl proewl pwrowl prewl 
growl = grrowl growll ggrowl groowl growwl groewl gwrowl dgrowl 
howl = howll hhowl hoowl howwl hoewl hewl honwl houwl huowl 
kite = kitte kito kitee kiite kkite keite kita kiti kiten 
migrate = migrrate migratte migrete migrite migrute migrato migrote 
dune = duno ddune dunee dunne duune drune duna duni dane dunen 
tune = ttune tuno tue tunee tunne tuune trune tuni tane 
prune = prrune pune pruno prue prunee prunne pprune pruune pwrune 
june = juno jue junee jjune junne juune jrune juna juni jane 
await = awaitt ewait aweit iwait awiit uwait awuit 
wait = waitt weit wiit wuit woit waait waeit 
chess = ches shess sshess schess choss cchess cheess chhess chesss 
mess = meess mmess messs mecs mesc mescs messc 
dress = dres drress ddress dreess dresss drecs dresc 
bless = bles belss blless bloss bbless bleess blesss blecs 
truth = trruth ttruth trutth tuth truthh truuth twruth 
truly = trruly trully ttruly tuly truuly trulyy twruly 
truant = trruant ttruant truantt tuant truent truint truunt truat 
brutal = brrutal brutall bruttal butal brutel brutil brutul brutol 
plume = pllume plumo plumee plumme pplume pluume plunme plumpe plrume 
flume = fllume flumo flumee fflume flumme fluume flunme flumpe flrume 
flute = fllute flutte fluto flutee fflute fluute flrute velute 
dilute = dillute dilutte diluto ddilute dilutee diilute diluute deilute 
rude = rrude ude rudo rudde rudee ruude wrude ruda 
crude = srude ssrude scrude crrude cude crudo ccrude crudde crudee 
cowl = sowl ssowl cowll ccowl coowl cowwl coewl cewl conwl 
scowl = ssowl sssowl sscowl scowll sccowl scoowl scowwl scoewl 
massive = masive messive mussive massivo mossive maassive maessive maissive 
passive = pasive passif pessive pissive pussive passivo possive 
put = pput puut prut paat paet pait paot paut peet peit 
pulpit = pullpit pulpitt pulpiit ppulpit pulppit puulpit pulpeit prulpit 
ago = igo ugo ogo aago aego aigo aogo augo 
agree = agre agrree egree igree ugree agroe agreo ogree 
avoid = evoid ivoid uvoid aavoid aevoid aivoid aovoid 
was = wes wis wus wos waas waes wais 
hundred = hundrred hundrod hudred hunddred hundredd hundreed hhundred hunndred huundred 
sacred = sasred sassred sascred sacrred secred sicred sucred sacrod 
forest = forrest forestt forost foreest fforest foorest foresst foerest 
record = resord ressord rescord rrecord recorrd rocord reccord recordd reecord recoord 
delude = dellude dolude deludo ddelude deludde deelude deludee deluude dleude 
exclude = exslude exsslude exsclude excllude esclude oxclude excludo excclude excludde eexclude 
delicate = delisate delissate deliscate dellicate delicatte delicete delicite delicute dolicate delicato 
duplicate = duplisate duplissate dupliscate dupllicate duplicatte duplicete duplicite duplicute duplicato 
clown = slown sslown sclown cllown cclown clownn cloown clowwn cloewn 
crown = srown ssrown scrown crrown ccrown crownn croown crowwn croewn 
brown = brrown bbrown brownn broown browwn broewn bwrown brewn bronwn 
down = ddown downn doown dowwn doewn dewn donwn douwn duown 
restore = rrestore restorre resttore rostore restoro reestore restoree restoore 
store = storre sttore storo storee stoore sstore stoere ctore 
any = eny iny uny ay ony aany aeny 
many = meny miny muny mony maany maeny mainy 
milk = millk miilk milkk mmilk meilk nmilk mpilk minlk malk 
bulk = bullk bbulk bulkk buulk brulk bunlk belk bolk baalk 
keel = kel keell koel keol keeel kkeel kele kael 
keep = kep koep keop keeep kkeep keepp kaep keap kiep 
elastic = elastis elastiss elastisc ellastic elasttic elestic elistic elustic olastic 
disjointed = disjointted disjointod disjoited ddisjointed disjointedd disjointeed diisjointed disjoiinted disjjointed disjoinnted 
ruby = rruby uby rubby ruuby rubyy wruby raby runby 
ruin = rruin uin rui ruiin ruinn ruuin ruein wruin 
prudent = prrudent prudentt pudent prudont prudet pruddent prudeent prudennt pprudent 
duly = dduly duuly dulyy druly daly dunly dely dily doly 
wasp = wesp wusp wosp waasp waesp waisp waosp wausp 
swamp = swemp swimp swump swomp swaamp swaemp swaimp 
swan = swen swin swun swa swon swaan swaen 
wad = wid wud wod waad waed waid waod waud 
esteem = estem estteem osteem estoem esteom eesteem esteeem esteemm essteem 
amnesty = amnestty emnesty imnesty umnesty amnosty omnesty aamnesty 
amount = amuont amont amountt emount imount umount amout omount 
amidst = amidstt emidst imidst umidst omidst aamidst aemidst 
missive = misive missif missivo missivee miissive missiive mmissive misssive missivve 
massive = masive messive mussive massivo mossive maassive maessive maissive 
passive = pasive passif pessive pissive pussive passivo possive 
fence = fense fensse fensce fonce fenco fece fencce feence fencee ffence 
menace = menase menasse menasce menece menice menuce monace menaco meace 
amputate = amputtate amputatte amutate emputate amputete imputate amputite umputate amputute amputato 
litigate = llitigate littigate litigatte litigete litigite litigute litigato litigote 
locate = losate lossate loscate llocate locatte locete locite locute locato 
outfit = uotfit otfit outtfit outfitt outffit outfiit ooutfit ouutfit 
out = uot ot outt oout ouut oeut orut eut onut 
pout = puot poutt poout ppout pouut poeut porut poat peut 
flout = fluot flot fllout floutt fflout floout flouut floeut 
selfish = sellfish solfish seelfish selffish selfishh selfiish sselfish selfissh selfeish 
blemish = belmish bllemish blomish bblemish bleemish blemishh blemiish blemmish blemissh 
perish = perrish porish peerish perishh periish pperish perissh pereish 
jeans = jans jeens jeins jeuns joans jeas jeons 
bean = bein beun boan bea beon beaan beaen beain 
dean = dan deen dein deun doan dea deon 
mean = meen mein meun mea meon meaan meaen 
book = bok bbook bookk boook boeok booek beok boek bonok 
brook = brok brrook bbrook brookk broook broeok brooek bwrook 
took = tok ttook tookk toook toeok tooek teok toek 
look = lok llook lookk loook loeok looek leok loek 
fracas = frasas frassas frascas frracas frecas fraces fricas fracis frucas fracus 
vacant = vasant vassant vascant vacantt vecant vacent vicant vacint vucant vacunt 
tremor = trremor tremorr ttremor tromor treemor tremmor tremoor 
tumor = tumorr ttumor tummor tumoor tuumor tumoer tumowr tunmor 
rumor = rrumor rumorr umor rummor rumoor ruumor rumoer wrumor 
memory = memorry momory meemory mmemory memmory memoory memoryy memoery memowry 
row = rrow roow roww roew wrow rew ronw rouw ruow 
throw = thrrow tthrow thhrow throow throww throew thwrow thronw 
grow = grrow ggrow groow groww groew gwrow dgrow gronw grouw 
crow = srow ssrow scrow crrow ccrow croow croww croew cwrow 
negligence = negligense negligensse negligensce neglligence nogligence negligonce negligenco negligece negligencce neegligence 
eminent = eminentt ominent eminont eminet emient eeminent emineent emiinent emminent eminnent 
evidently = evidentlly evidenttly ovidently evidontly evidetly eviddently eevidently evideently eviidently 
joke = joko jokee jjoke jokke jooke joeke joka joki jeke joken 
choke = shoke sshoke schoke choko cchoke chokee chhoke chokke chooke choeke 
poke = poko pokee pokke pooke ppoke poeke poka poki poken ponke 
spoke = spoko spokee spokke spooke sppoke sspoke spoeke cpoke scpoke 
method = metthod mothod methodd meethod methhod mmethod methood methoed nmethod 
propel = prropel propell propol propeel proopel ppropel proppel proepel 
reckon = reskon resskon resckon rreckon rockon recko recckon reeckon reckkon reckonn 
season = sason seeson seison seuson soason seaso seoson 
huge = hugo hugee hugge hhuge huuge hruge hudge huga hugi hage 
cage = ssage scage cege cige cuge cago coge 
impinge = iminge impingo impige impingee impingge iimpinge impiinge immpinge impinnge imppinge 
imbecile = imbeciel imbesile imbessile imbescile imbecille imbocile imbecilo imbbecile imbeccile imbeecile 
infinite = infinitte infinito ifinite infiite infinitee inffinite iinfinite infiinite infiniite innfinite 
loyal = lloyal loyall loyel loyil loyul loyol loyaal 
royal = rroyal royall royel royil royul royol royaal 
motor = motorr mottor mmotor mootor motoor moetor motoer motowr 
tutor = tutorr ttutor tuttor tutoor tuutor tutoer tutowr 
actor = astor asstor asctor actorr acttor ector ictor uctor 
captor = saptor ssaptor scaptor captorr capttor ceptor ciptor cuptor 
good = goodd ggood goood goeod gooed dgood geod goed gonod 
hood = hoodd hhood hoood hoeod hooed heod honod hoond houod 
wood = wod woodd woood wwood woeod weod woed wonod woond 
stood = stod sttood stoodd stoood sstood stoeod stooed ctood 
favor = favorr fevor fivor fuvor fovor faavor faevor 
flavor = flavorr fllavor flevor flivor fluvor flovor flaavor 
savor = savorr sevor sivor suvor sovor saavor saevor 
fervor = ferrvor fervorr forvor feervor ffervor fervoor fervvor fervoer 
visitor = visitorr visittor viisitor visiitor visitoor vissitor vvisitor visitoer 
editor = editorr edittor oditor edditor eeditor ediitor editoor editoer 
creditor = sreditor ssreditor screditor crreditor creditorr credittor croditor ccreditor credditor creeditor 
tow = ttow toow toww toew tew tonw touw tuow taw 
bestow = besttow bostow bbestow beestow bestoow besstow bestoww bestoew bectow 
sow = soow ssow soww soew zow sonw souw suow siw 
snow = snnow snoow ssnow snoww snoew cnow scnow znow snew 
advisor = advisorr edvisor idvisor udvisor odvisor aadvisor aedvisor 
ivory = ivorry iivory ivoory ivvory ivoryy ivoery eivory ivowry ivery 
angry = angrry engry ingry ungry agry ongry aangry 
anger = angerr enger inger unger angor ager onger 
finger = fingerr fingor figer fingeer ffinger fingger fiinger finnger feinger 
sentinel = sentinell senttinel sontinel sentinol setinel sentiel seentinel sentineel sentiinel 
eminent = eminentt ominent eminont eminet emient eeminent emineent emiinent emminent eminnent 
denizen = denisen donizen denizon deizen denize ddenizen deenizen denizeen deniizen dennizen 
specimen = spesimen spessimen spescimen spocimen specimon specime speccimen speecimen specimeen speciimen 
factory = fastory fasstory fasctory factorry facttory fectory fictory fuctory 
history = historry histtory hhistory hiistory histoory hisstory historyy histoery 
odor = odorr oddor oodor odoor oedor odoer odowr edor oder 
humor = humorr hhumor hummor humoor huumor humoer humowr hunmor humpor 
armor = ermor ormor arrmor armorr irmor urmor 
arbor = erbor orbor arrbor arborr irbor urbor 
doctor = dostor dosstor dosctor doctorr docttor docctor ddoctor dooctor doctoor 
decorator = desorator dessorator descorator decorrator decoratorr decorattor decoretor decoritor decorutor docorator 
directory = direstory diresstory diresctory dirrectory directorry directtory diroctory direcctory ddirectory direectory 
basket = baskett besket bisket busket baskot bosket baasket 
brisket = brrisket briskett briskot bbrisket briskeet briisket briskket brissket 
musket = muskett muskot muskeet muskket mmusket mussket muusket mucket 
drunken = drrunken dunken drunkon drunke druken ddrunken drunkeen drunkken drunnken drunkenn 
wool = wol wooll woool wwool woeol wooel weol woel 
woodland = wodland woodlland woodlend woodlind woodlund woodlad woodlond 
wood = wod woodd woood wwood woeod weod woed wonod woond 
debate = debatte debete debite debute dobate debato debote 
debase = debese debise debuse dobase debaso debose debaase 
grafted = grrafted graftted grefted grifted grufted graftod grofted 
relax = rrelax rellax relex relix relux rolax relox 
expand = espand expind expund oxpand expad expond expaand expaend 
result = rresult resullt resultt rosult reesult ressult resuult 
using = usig usingg usiing usinng ussing uusing useing ucing uscing 
music = musis musiss musisc musicc musiic mmusic mussic muusic museic mucic 
ladle = ladel lladle ladlle ledle lidle ludle ladlo lodle 
cradle = cradel sradle ssradle scradle crradle cradlle credle cridle crudle cradlo 
jelly = jely jellly jeelly jjelly jellyy jlely 
jellyfish = jelyfish jelllyfish jollyfish jeellyfish jellyffish jellyfishh jellyfiish jjellyfish 
add = edd idd udd aadd aedd aidd aodd 
addict = adict addist addisst addisct addictt eddict iddict uddict 
adder = ader adderr edder idder addor aadder aedder aidder 
ladder = lader ladderr lladder ledder lidder ludder laddor lodder 
enactment = enastment enasstment enasctment enacttment enactmentt enectment enictment enuctment onactment enactmont 
enjoyment = enjoymentt onjoyment enjoymont ejoyment enjoymet eenjoyment enjoymeent enjjoyment enjoymment ennjoyment 
forbid = forrbid forbbid forbidd fforbid forbiid foorbid foerbid forbeid fowrbid 
forget = forrget forgett forgeet fforget forgget foorget foerget fowrget 
victory = vistory visstory visctory victorry victtory vicctory viictory victoory 
mayor = mayorr meyor miyor muyor moyor maayor maeyor 
rally = raly rrally rallly relly rilly rully rolly 
silly = sily sillly siilly ssilly sillyy seilly cilly 
jolly = joly jollly jjolly joolly jollyy joelly 
amendment = amendmentt emendment imendment umendment amondment amendmont amedment amendmet 
assessment = asessment assesment assessmentt essessment issessment ussessment assossment assessmont assessmet 
acumen = asumen assumen ascumen ecumen icumen ucumen acumon acume 
joy = jjoy jooy joyy jey jony jouy juoy jiy juy 
enjoy = onjoy ejoy eenjoy enjjoy ennjoy enjooy enjoyy enjoey anjoy injoy 
foot = fot foott ffoot fooot foeot fooet veoot feot 
hook = hok hhook hookk hoook hoeok hooek heok hoek honok 
shook = shok shhook shookk shoook sshook shoeok shooek chook 
lookout = lokout lookuot lookot llookout lookoutt lookkout loookout lookoout 
imitate = imittate imitatte imitete imitite imitute imitato imitote 
obligate = oblligate obligatte obligete obligite obligute obligato obligote 
snore = snorre snoro snoree snnore snoore ssnore snoere cnore 
ignore = ignorre ignoro ignoree iggnore iignore ignnore ignoore ignoere eignore 
gruel = grruel gruell guel gruol grueel ggruel gruuel grule 
frugal = frrugal frugall frugel frugil frugul frugol frugaal 
gaudy = geudy giudy guudy goudy gaaudy gaeudy gaiudy 
audit = auditt eudit iudit uudit oudit aaudit aeudit 
milking = millking milkig milkingg miilking milkiing milkking mmilking milkinng meilking 
milk = millk miilk milkk mmilk meilk nmilk mpilk minlk malk 
crook = crok srook ssrook scrook crrook ccrook crookk croook 
brook = brok brrook bbrook brookk broook broeok brooek bwrook 
forever = forrever foreverr forefr forover forevor foreever foreveer fforever foorever 
janitor = janitorr janittor jenitor jinitor junitor jaitor jonitor 
flange = fllange flenge flinge flunge flango flage flonge 
fringe = frringe fringo frige fringee ffringe fringge friinge frinnge freinge 
tinge = ttinge tingo tige tingee tingge tiinge tinnge teinge tindge 
food = fod foodd ffood foood foeod fooed veood feod foed 
fool = fooll ffool foool foeol fooel veool feol foel 
gone = gono goe gonee ggone gonne goone goene dgone gona goni 
lure = lurre llure luro luree luure luwre lrure lura 
jade = jede jide jude jado jode jaade jaede 
native = nattive natif netive nitive nutive nativo notive 
emit = emitt eemit emiit emmit emeit enmit empit amit imit 
exist = existt esist oxist eexist exiist exisst exxist exeist exict 
rebut = rrebut rebutt robut rebbut reebut rebuut wrebut rebrut 
deduct = dedust dedusst dedusct deductt doduct deducct ddeduct dedduct deeduct 
inmate = inmatte imate inmete inmite inmute inmato inmote 
stipulate = stipullate sttipulate stipulatte stipulete stipulite stipulute stipulato stipulote 
vary = vory varry viry vury vaary vaery vairy 
charity = cherity chority sharity ssharity scharity charrity charitty chirity churity 
meditate = medittate meditatte meditete meditite meditute moditate meditato meditote 
hesitate = hesittate hesitatte hesitete hesitite hesitute hositate hesitato hesitote 
cook = cok sook ssook scook ccook cookk coook coeok cooek 
crook = crok srook ssrook scrook crrook ccrook crookk croook 
book = bok bbook bookk boook boeok booek beok boek bonok 
brook = brok brrook bbrook brookk broook broeok brooek bwrook 
way = wey wiy wuy woy waay waey waiy 
clay = sslay sclay cllay cley cliy cluy claay 
defray = defrray defrey defriy defruy dofray defroy defraay 
daisy = deisy diisy duisy doisy daaisy daeisy daiisy 
daily = dailly deily diily duily daaily daeily daiily 
dainty = daintty deinty diinty duinty daity dointy daainty 
freshen = frreshen froshen freshon freshe freeshen fresheen ffreshen freshhen freshenn 
burden = burrden burdon burde bburden burdden burdeen burdenn buurden buwrden 
mile = miel mille milo milee miile mmile meile nmile mpile 
smile = smiel smille smilo smilee smiile smmile ssmile smeile cmile 
pile = piel pille pilo pilee piile ppile peile pila pili 
tile = tiel tille ttile tilo tilee tiile teile tila 
assert = asert asserrt assertt essert issert ussert ossert 
alert = aelrt alerrt allert alertt elert ilert ulert alort 
avert = averrt avertt afrt evert ivert uvert avort 
enrage = enrrage enrege enrige enruge onrage enrago erage enroge 
engage = engege engige enguge ongage engago egage engoge 
page = pege pige puge pago poge paage paege 
cage = ssage scage cege cige cuge cago coge 
dispose = disposo ddispose disposee diispose dispoose disppose disspose disposse dispoese deispose 
pose = poso posee poose ppose poese poce posce poze posa posi 
coronet = soronet ssoronet scoronet corronet coronett coronot coroet ccoronet coroneet coronnet 
domestic = domestis domestiss domestisc domesttic domostic domesticc ddomestic domeestic domestiic dommestic 
host = hostt hhost hoost hosst hoest hoct hosct hozt 
hold = holld holdd hhold hoold hoeld honld hould huold hald 
holy = hholy hooly holyy hoely hely honly houly huoly haly 
earn = arn eern eorn earrn eirn eurn oarn 
learn = larn elarn leern leorn learrn llearn leirn leurn loarn 
pearl = parl peerl peorl pearrl pearll peirl peurl poarl 
heard = heerd heord hearrd heird heurd 
refute = rrefute refutte rofute refuto reefute refutee reffute refuute 
mute = mutte muto mutee mmute muute nmute mpute mrute muta 
altitude = alltitude alttitude altittude eltitude iltitude ultitude altitudo oltitude 
gratitude = grratitude grattitude gratittude gretitude grititude grutitude gratitudo grotitude 
amaze = amase emaze ameze imaze amize umaze amuze amazo 
raze = rraze rase reze rize ruze razo roze 
gaze = gase geze gize guze gazo goze gaaze 
blaze = bllaze bleze blize bluze blazo bloze blaaze 
dumb = dumbb ddumb dummb duumb dunmb dumpb drumb damb 
numb = numbb nummb nnumb nuumb nunmb numpb nrumb namb 
thumb = tthumb thumbb thhumb thummb thuumb thunmb thumpb thrumb thamb 
crumb = srumb ssrumb scrumb crrumb cumb crumbb ccrumb crummb cruumb 
scarce = scerce scorce ssarce scarse sssarce scarsse sscarce scarsce scarrce 
care = cere sare ssare carre cire caro caare 
scare = scere ssare sssare sscare scarre scire scure scaro 
federal = federral federall federel federil federul foderal fedoral federol 
oral = orral orall orel oril orul orol oraal 
teeth = teth tteeth teetth toeth teoth teeeth teethh 
steep = stteep stoep steop steeep steepp ssteep cteep 
tangible = tangibel tangiblle ttangible tengible tingible tungible tangiblo tagible 
forcible = forcibel forsible forssible forscible forrcible forciblle forciblo forcibble forccible forciblee 
cuticle = cuticel suticle cutisle ssuticle cutissle scuticle cutiscle cuticlle cutticle cuticlo 
pale = pael palle pele palo paale paele paile paole paule 
tale = tael talle ttale tele tule talo taale taele 
gale = gael galle gele gile gule galo gole 
sale = sael salle sele sile sule salo saale 
boy = bboy booy boyy boey bouy biy baay baey baiy baoy 
toy = ttoy tooy toyy toey tey touy tuoy tay 
troy = trroy ttroy trooy troyy troey twroy trony trouy 
drawl = drrawl drawll drewl driwl druwl drowl draawl 
crawl = srawl ssrawl crrawl crawll crewl criwl cruwl crowl 
sprawl = sprrawl sprawll sprewl spriwl spruwl sprowl spraawl 
blonde = bllonde blondo blode bblonde blondde blondee blonnde bloonde bloende 
bronze = brronze bronse bronzo broze bbronze bronzee bronnze broonze bronzze 
olive = ollive olif olivo olivee oliive oolive olivve oelive oleive 
involved = invollved involfd involvod ivolved involvedd involveed iinvolved innvolved invoolved 
flow = fllow fflow floow floww floew velow flonw flouw fluow 
slow = sllow sloow sslow sloww sloew clow sclow zlow 
below = bolow bbelow beelow beloow beloww beloew bleow balow bilow belew 
kind = kindd kiind kkind kinnd keind kand kend 
kept = keptt kopt keept kkept keppt kapt kipt kenpt 
fork = forrk ffork forkk foork foerk fowrk veork ferk fonrk 
stork = storrk sttork storkk stoork sstork stoerk ctork 
resonant = rresonant resonantt resonent resonint resonunt rosonant resonat resoant 
political = politisal politissal politiscal pollitical politicall polittical politicel politicil politicul 
role = roel rrole rolle rolo rolee roole roele wrole 
stole = stoel stolle sttole stolo stolee stoole sstole stoele 
confine = sonfine ssonfine sconfine confino confie cofine cconfine confinee conffine confiine 
confide = sonfide ssonfide sconfide confido cofide cconfide confidde confidee conffide confiide 
file = fiel fille filee ffile fiile feile veile fila fili 
while = whiel whille whilo whilee whhile whiile wwhile wheile whila 
deduce = deduse dedusse dedusce doduce deduco deducce ddeduce dedduce deeduce deducee 
reduce = reduse redusse redusce rreduce roduce reduco reducce redduce reeduce reducee 
arose = erose orose arrose irose urose aroso 
arise = erise orise arrise irise urise ariso 
are = arre ure aro aare aere aire aore aure eare 
substitute = substtitute substittute substitutte substituto subbstitute substitutee substiitute ssubstitute subsstitute 
multitude = mulltitude multtitude multittude multitudo multitudde multitudee multiitude mmultitude 
eliminate = elliminate eliminatte eliminete eliminite eliminute oliminate eliminato elimiate 
imitate = imittate imitatte imitete imitite imitute imitato imitote 
intimate = inttimate intimatte intimete intimite intimute intimato itimate intimote 
armament = ermament ormament arrmament armamentt armement irmament armiment urmament armument 
apartment = apertment aportment aparrtment aparttment apartmentt epartment ipartment apirtment upartment 
absorbent = absorrbent absorbentt ebsorbent ibsorbent ubsorbent absorbont absorbet obsorbent 
urgency = urgensy urgenssy urgenscy urrgency urgoncy urgecy urgenccy urgeency urggency urgenncy 
edible = edibel ediblle odible ediblo edibble eddible eedible ediblee ediible 
edit = editt odit eddit eedit ediit edeit adit idit endit 
early = arly eerly eorly earrly earlly eirly eurly oarly 
search = sarch seerch seorch searsh searssh searsch searrch seirch seurch 
ashes = eshes ishes ushes ashos oshes aashes aeshes 
bushes = bushos bbushes bushees bushhes busshes bushess buushes buches bushec 
pushes = pushos pushees pushhes ppushes pusshes pushess puushes puches pushec 
bath = batth beth bith buth baath baeth baith 
path = patth peth puth poth paath paeth paith paoth 
poison = poiso poiison poisonn pooison poisoon ppoison poisson poeison poisoen 
reason = rason rreason reeson reison reuson roason reaso reoson 
treason = trason trreason ttreason treeson treison treuson troason treaso 
crutch = srutch crutsh ssrutch crutssh scrutch crutsch crrutch cruttch cutch ccrutch 
clutch = slutch clutsh sslutch clutssh sclutch clutsch cllutch cluttch cclutch clutcch 
polar = poler polor polarr pollar polir polur 
solar = soler solor solarr sollar solir solur 
acid = asid assid ascid ecid icid ucid ocid 
lucid = lusid lussid luscid llucid luccid lucidd luciid luucid luceid 
pencil = pensil penssil penscil pencill poncil pecil penccil peencil penciil 
deficit = defisit defissit defiscit deficitt doficit deficcit ddeficit deeficit defficit defiicit 
desolate = desollate desolatte desolete desolite desolute dosolate desolato desolote 
resolute = rresolute resollute resolutte rosolute resoluto reesolute resolutee resoolute 
mule = muel mulle mulo mulee mmule muule nmule mpule mrule 
whale = whael whalle whele whule whalo whaale whaele whaile 
scale = scael ssale sssale sscale scalle scele scile scule scalo 
risen = rrisen rison riseen riisen risenn rissen reisen ricen 
chisel = shisel sshisel schisel chisell chisol cchisel chiseel chhisel chiisel 
tendency = tendensy tendenssy tendenscy ttendency tondency tendoncy tedency tendecy tendenccy tenddency 
amnesty = amnestty emnesty imnesty umnesty amnosty omnesty aamnesty 
image = imege imige imuge imoge imaage imaege imaige 
voyage = voyege voyige voyuge voyago voyoge voyaage voyaege 
dredge = drredge drege drodge dredgo ddredge dreddge dreedge dredgee dredgge 
ledge = eldge lledge lege ledgo leddge leedge ledgee ledgge 
sledge = seldge slledge slege slodge sledgo sleddge sleedge sledgee sledgge 
play = pllay pley pliy pluy plaay plaey plaiy 
display = displlay displey displiy displuy disploy displaay displaey 
banner = baner bannerr benner binner bunner bannor bonner 
inner = iner innerr innor inneer iinner innner einner 
dinner = dinnerr dinnor ddinner dinneer diinner dinnner deinner dinnar 
calculator = salculator calsulator ssalculator calssulator scalculator calsculator calculatorr callculator calcullator calculattor 
ancestor = ansestor anssestor anscestor ancestorr ancesttor encestor incestor uncestor ancostor acestor 
afterward = afterwerd afterrward afterwarrd aftterward efterward ifterward afterwird ufterward afterwurd 
calvary = calvery calvory salvary ssalvary scalvary calvarry callvary celvary cilvary 
hatred = hatrred hattred hetred hitred hutred hatrod hotred 
hundred = hundrred hundrod hudred hunddred hundredd hundreed hhundred hunndred huundred 
ivy = iivy ivvy ivyy eivy invy avy evy ovy 
i = ei aa ae ai ao au ee eo eu 
ninth = nintth nith ninthh niinth nninth ninnth neinth nanth 
find = fid findd ffind fiind finnd feind veind fand 
alike = allike elike ilike ulike aliko olike aalike 
like = llike liko likee liike likke leike lika liki linke 
exhale = exhael exhalle eshale exhele exhile exhule oxhale exhalo 
pale = pael palle pele palo paale paele paile paole paule 
tale = tael talle ttale tele tule talo taale taele 
gale = gael galle gele gile gule galo gole 
counsel = cuonsel consel sounsel ssounsel scounsel counsell counsol cousel ccounsel counseel 
tinsel = tinsell ttinsel tinsol tisel tinseel tiinsel tinnsel tinssel 
week = wek woek weok weeek weekk wweek waek wiek weik 
meek = mek moek meok meeek meekk mmeek nmeek mpeek maek 
seek = sek soek seok seeek seekk sseek ceek sceek 
sleek = slek selek slleek sloek sleok sleeek sleekk ssleek 
legitimate = elgitimate llegitimate legittimate legitimatte legitimete legitimite legitimute logitimate legitimato 
obstinate = obsttinate obstinatte obstinete obstinite obstinute obstinato obstiate obstinote 
intimate = inttimate intimatte intimete intimite intimute intimato itimate intimote 
nominate = nominatte nominete nominite nominute nominato nomiate nominote 
coax = soax ssoax scoax coex coix coux coox 
coat = soat ssoat scoat coatt coet coit cout 
coach = soach coash ssoach coassh scoach coasch coech coich 
fluke = flluke fluko flukee ffluke flukke fluuke flruke veluke fluka 
flume = fllume flumo flumee fflume flumme fluume flunme flumpe flrume 
flute = fllute flutte fluto flutee fflute fluute flrute velute 
explode = expllode esplode oxplode explodo explodde eexplode explodee exploode expplode 
rode = rrode rodo rodde rodee roode roede wrode roda rodi 
node = nodo nodde nodee nnode noode noede noda nodi nede noden 
checker = shecker chesker sshecker chessker schecker chescker checkerr chocker checkor cchecker 
bicker = bisker bissker biscker bickerr bickor bbicker biccker bickeer biicker bickker 
household = huosehold hosehold householld housohold householdd houseehold hhousehold househhold hoousehold 
house = huose houso housee hhouse hoouse housse houuse hoeuse houce 
blouse = bluose blose bllouse blouso bblouse blousee bloouse blousse blouuse 
mouse = muose mose mouso mousee mmouse moouse mouuse moeuse mouce mousce 
visiting = visitting visitig visitingg viisiting visiiting visitiing visitinng vissiting vvisiting 
using = usig usingg usiing usinng ussing uusing useing ucing uscing 
ruse = rruse ruso rusee russe ruuse ruce rusce wruse 
rude = rrude ude rudo rudde rudee ruude wrude ruda 
prune = prrune pune pruno prue prunee prunne pprune pruune pwrune 
treachery = trachery treashery treasshery treaschery trreachery treacherry ttreachery treechery treichery treuchery 
tread = trread ttread treid treud troad treod treaad treaed 
patrol = patrrol patroll pattrol pitrol putrol potrol paatrol paetrol 
redundant = rredundant redundantt redundent redundint redundunt rodundant redundat redudant 
dismal = dismall dismel dismil dismul dismol dismaal dismael 
miracle = miracel mirasle mirassle mirascle mirracle miraclle mirecle miricle mirucle miraclo 
chest = shest sshest schest chestt chost cchest cheest chhest chesst 
bench = bensh benssh bensch bonch bech bbench bencch beench benchh bennch 
chat = shat sshat schat chatt chet chut chot chaat 
chant = shant sshant schant chantt chent chint chunt chont 
deface = defase defasse defasce defece defice defuce doface defaco 
face = fase fasse fasce fece fice fuce faco foce 
asterisk = asterrisk astterisk esterisk isterisk usterisk astorisk osterisk 
task = ttask tesk tisk tosk taask taesk taisk taosk 
ask = esk isk usk osk aask aesk aisk 
bask = besk bisk bosk baask baesk baisk baosk bausk 
dew = dow ddew deew deww daw diw denw 
new = neew nnew neww naw niw nenw nuw naaw 
grew = grrew greew ggrew greww gwrew dgrew graw griw grenw 
blew = belw bllew bblew bleew bleww blaw bliw blenw 
quill = quil quilll quiill qquill quuill queill 
quit = quitt quiit qquit quuit queit qruit qait qunit quat 
squint = squintt squit squiint squinnt sqquint ssquint squuint squeint cquint 
disturb = disturrb distturb disturbb ddisturb diisturb dissturb distuurb deisturb 
turn = turrn tturn turnn tuurn tuwrn trurn tunrn tirn 
chose = shose sshose schose choso cchose chosee chhose chosse choese choce 
raise = rraise reise riise ruise raiso roise raaise 
cider = sider ssider scider ciderr cidor ccider cidder cideer ciider 
grocer = groser groscer grrocer grocerr grocor groccer groceer ggrocer groocer 
ulcer = ulser ulsser ulscer ulcerr ullcer ulcor ulccer ulceer 
grocery = grosery grossery groscery grrocery grocerry grocory groccery groceery ggrocery groocery 
broker = brroker brokerr brokor bbroker brokeer brokker brooker broeker 
poker = pokerr pokor pokeer pokker pooker ppoker poeker pokar 
baker = bakerr beker buker bakor boker baaker baeker baiker 
flew = felw fllew fleew fflew fleww velew fliw flenw 
stew = sttew steew sstew steww ctew sctew ztew staw 
crew = srew ssrew crrew ccrew creew creww cwrew criw crenw 
blew = belw bllew bblew bleew bleww blaw bliw blenw 
embassy = embasy embessy embissy embussy ombassy embossy embaassy 
assembly = asembly assemblly essembly issembly ussembly assombly ossembly 
flimsy = fllimsy fflimsy fliimsy flimmsy flimssy flimsyy fleimsy flimcy 
clumsy = slumsy sslumsy sclumsy cllumsy cclumsy clummsy clumssy cluumsy clumsyy 
horse = horrse horso horsee hhorse hoorse horsse hoerse horce 
corpse = sorpse ssorpse scorpse corrpse corpso ccorpse corpsee coorpse corppse 
limestone = llimestone limesttone limostone limestono limestoe limeestone limestonee liimestone limmestone 
time = ttime timo timee tiime timme teime tinme timpe tima 
lime = llime limee liime limme leime linme limpe lima limi 
slime = sllime slimo slimee sliime slimme sslime sleime sclime 
overrate = overrrate overratte ofrrate overrete overrite overrute ovorrate overrato 
ate = atte ete ite ute ato ote aate 
rate = rrate ratte rete rute rato raate raete raite 
date = datte dete dite dute dato daate daete 
delay = dellay deley deliy deluy dolay deloy delaay 
decay = desay dessay descay decey deciy decuy docay 
almost = allmost almostt elmost ilmost ulmost olmost aalmost 
salt = sallt saltt selt sult solt saalt saelt sailt 
malt = mallt maltt mult maalt maelt mailt maolt mault mealt 
halt = hallt haltt helt hult holt haalt haelt hailt 
beginner = beginer beginnerr boginner beginnor bbeginner beeginner beginneer begginner begiinner 
inner = iner innerr innor inneer iinner innner einner 
dinner = dinnerr dinnor ddinner dinneer diinner dinnner deinner dinnar 
disclose = disslose dissslose dissclose discllose discloso discclose ddisclose disclosee diisclose 
close = slose sslose sclose cllose closo cclose closee cloose closse 
pose = poso posee poose ppose poese poce posce poze posa posi 
dispose = disposo ddispose disposee diispose dispoose disppose disspose disposse dispoese deispose 
potato = pottato potatto poteto potito potuto pototo potaato 
despotism = despottism dospotism ddespotism deespotism despotiism despotismm despootism desppotism desspotism despotissm 
exponent = exponentt esponent oxponent exponont exponet expoent eexponent exponeent exponnent exponennt 
punishment = punishmentt punishmont punishmet puishment punishmeent punishhment puniishment punishmment punnishment punishmennt 
calico = salico caliso ssalico calisso scalico calisco callico celico cilico culico 
purity = purrity puritty puriity ppurity puurity purityy pureity puwrity 
security = sesurity sessurity sescurity securrity securitty socurity seccurity seecurity securiity 
havoc = havos havoss havosc hevoc hivoc huvoc hovoc 
cannon = sannon ssannon scannon cennon cinnon cunnon canno connon 
rayon = rrayon reyon riyon ruyon rayo royon raayon 
today = ttoday todey todiy toduy todoy todaay todaey 
sorry = sory sorrry soorry ssorry sorryy soerry corry 
mulberry = mulbery mulberrry mullberry mulborry mulbberry mulbeerry mmulberry 
curry = cury surry ssurry currry ccurry cuurry curryy 
carry = cary cerry corry sarry ssarry scarry carrry cirry 
longitude = llongitude longittude longitudo logitude longitudde longitudee longgitude longiitude lonngitude 
altitude = alltitude alttitude altittude eltitude iltitude ultitude altitudo oltitude 
gratitude = grratitude grattitude gratittude gretitude grititude grutitude gratitudo grotitude 
hazel = hazell hasel hezel hizel huzel hazol hozel 
brazen = brrazen brasen brezen brizen bruzen brazon brozen 
notoriety = notoreity notorriety nottoriety notorietty notorioty notorieety notoriiety nnotoriety nootoriety notooriety 
malefactor = maelfactor malefastor malefasstor malefasctor malefactorr mallefactor malefacttor melefactor malefector milefactor 
actor = astor asstor asctor actorr acttor ector ictor uctor 
factory = fastory fasstory fasctory factorry facttory fectory fictory fuctory 
bringing = brringing briging bringig bbringing bringging bringingg briinging bringiing brinnging bringinng 
handling = handlling hendling hindling hundling hadling handlig hondling 
nostril = nostrril nostrill nosttril nostriil nnostril noostril nosstril 
sandwich = sandwish sandwissh sandwisch sendwich sindwich sundwich sadwich sondwich 
hatch = hatsh hatssh hatsch hattch hetch hotch haatch haetch haitch 
botch = botsh botssh botsch bottch bbotch botcch botchh bootch boetch 
dear = dar deor dearr deir deur doar deaar 
beard = beerd beord bearrd beird beurd 
dreary = drary dreery dreory drreary drearry dreiry dreury droary 
shear = shar sheor shearr sheir sheur shoar sheaar 
anecdote = anesdote anessdote anescdote anecdotte enecdote inecdote unecdote anocdote anecdoto aecdote 
majesty = majestty mejesty mijesty mujesty majosty mojesty maajesty 
comical = somical comisal ssomical comissal scomical comiscal comicall comicel comicil comicul 
logical = logisal logissal logiscal llogical logicall logicel logicil logicul 
iceberg = iseberg isseberg isceberg iceberrg icoberg iceborg icebberg icceberg iceeberg icebeerg 
price = prise prisse prisce prrice prico pricce pricee priice pprice 
mice = mise misse misce mico micce micee miice mmice meice nmice 
advice = advisse advisce edvice idvice udvice advico odvice 
delegate = deelgate dellegate delegatte delegete delegite delegute dolegate delogate delegato 
relevant = reelvant rrelevant rellevant relevantt relevent relevint relevunt rolevant relovant relevat 
smith = smitth smithh smiith smmith ssmith smeith cmith scmith 
midst = midstt middst miidst mmidst midsst meidst midct midsct 
soothe = sothe sootthe sootho soothee soothhe sooothe ssoothe soeothe 
goose = gose gooso goosee ggoose gooose goosse goeose gooese gooce 
detachment = detashment detasshment detaschment dettachment detachmentt detechment detichment detuchment dotachment detachmont 
judgment = judgmentt jugment judgmont judgmet juddgment judgmeent judggment jjudgment judgmment judgmennt 
decade = desade dessade descade decede decude docade decado decaade 
cascade = sascade cassade ssascade casssade scascade casscade cescade cascede ciscade cascide 
love = llove lof lovo lovee loove lovve loeve lova lovi 
glove = gllove glof glovo glovee gglove gloove glovve gloeve dglove 
shove = shof shovo shovee shhove shoove sshove shovve shoeve chove 
above = abof ebove ibove ubove abovo obove aabove 
teachable = tachable teachabel teashable teasshable teaschable teachablle tteachable teechable teacheble teichable 
teach = tach teash teassh teasch tteach teech teich teuch toach 
each = ach eash eassh easch eech eich euch oach 
reach = rach reash reassh reasch rreach reech reich reuch 
rainstorm = rrainstorm rainstorrm rainsttorm reinstorm riinstorm ruinstorm raistorm roinstorm 
strain = strrain sttrain strein striin struin strai stroin 
rain = rrain riin rai roin raain raein raiin raoin rauin 
train = trrain ttrain trein triin truin trai troin 
ton = tton tonn toon toen toun tuon taan taen 
front = frront frontt frot ffront fronnt froont froent fwront 
month = montth monthh mmonth monnth moonth moenth nmonth mponth menth 
from = frrom ffrom fromm froom froem fwrom fronm fromp verom 
other = otherr otther othor otheer othher oother oether othar 
brother = brrother brotherr brotther brothor bbrother brotheer brothher broother 
another = anotherr anotther enother inother unother anothor aother onother 
smear = smar smeer smeor smearr smeir smeur smoar 
spear = speer speor spearr speir speur spoar 
clear = clar celar cleer cleor slear sslear sclear clearr cllear 
weary = weery weory wearry weiry weury woary 
flannel = flanel fllannel flannell flennel flinnel flunnel flannol 
channel = chanel shannel sshannel schannel channell chennel chinnel chunnel channol 
funnel = funel funnell funnol funneel ffunnel funnnel fuunnel 
bonnet = bonet bonnett bonnot bbonnet bonneet bonnnet boonnet 
none = nono noe nonee nnone nonne noone noene nona noni nene 
done = dono ddone donee donne doone doene doni dene donen 
icy = isy issy iscy iccy iicy icyy eicy incy acy ecy 
racy = rasy rassy rascy rracy recy ricy rucy rocy 
mercy = mersy merssy merscy merrcy morcy merccy meercy mmercy mercyy 
widow = widdow wiidow widoow wwidow widoww widoew weidow widew widonw widouw 
window = winddow wiindow winndow windoow wwindow windoww windoew weindow windew 
some = somo somee somme soome ssome soeme scome sonme sompe 
come = ssome scome como ccome comee comme coome coeme conme compe 
eddy = edy oddy edddy eeddy eddyy addy iddy enddy 
giddy = gidy gidddy ggiddy giiddy giddyy geiddy dgiddy ginddy gaddy 
jet = jett jeet jjet jat jit jent jaat 
inject = injest injesst injesct injectt injoct iject injecct injeect iinject injject 
join = joi joiin jjoin joinn jooin joein jein jonin 
force = forse forsse forsce forrce forco forcce forcee fforce foorce 
farce = ferce farse farsse farsce farrce firce furce farco 
entertain = enterrtain enttertain enterttain entertein entertiin entertuin ontertain entortain etertain entertai 
painter = painterr paintter peinter piinter puinter paintor paiter 
mastodon = masttodon mestodon mistodon mustodon mastodo mostodon maastodon 
personality = perrsonality personallity personalitty personelity personility personulity porsonality persoality 
scratch = ssratch scratsh sssratch scratssh sscratch scratsch scrratch scrattch scretch scritch 
snatch = snatsh snatssh snatsch snattch snetch snutch snotch snaatch 
match = matsh matssh matsch mattch metch mitch mutch motch 
patch = patsh patssh patsch pattch petch putch potch paatch 
oregano = orregano oregeno oregino oreguno orogano oregao oregono 
penalty = penallty penaltty penelty penilty penulty ponalty pealty penolty 
extremity = extrremity exttremity extremitty estremity oxtremity extromity eextremity extreemity extremiity extremmity 
dormitory = dorrmitory dormitorry dormittory ddormitory dormiitory dormmitory doormitory dormitoory 
compute = sompute ssompute scompute computte comute computo ccompute computee commpute coompute 
confuse = sonfuse ssonfuse sconfuse confuso cofuse cconfuse confusee conffuse connfuse coonfuse 
protocol = protosol protossol protoscol prrotocol protocoll prottocol protoccol prootocol protoocol 
nobody = nobbody noboddy nnobody noobody noboody nobodyy noebody noboedy nebody nobedy 
paw = piw puw paaw paew paiw paow pauw peaw 
draw = drraw driw druw drow draaw draew draiw draow 
law = llaw lew liw luw laaw laew laiw 
flaw = fllaw fliw fluw flaaw flaew flaiw flaow flauw 
management = managementt menagement manegement minagement manigement munagement manugement managoment managemont maagement 
amusement = amusementt emusement imusement umusement amusoment amusemont amusemet omusement 
thaw = tthaw thiw thuw thow thaaw thaew thaiw thaow 
saw = siw suw saaw saew saiw saow sauw seaw 
jaw = jew jiw juw jow jaaw jaew jaiw 
claw = sslaw sclaw cllaw cliw cluw clow claaw claew 
pillar = pilar piller pillor pillarr pilllar pillir pillur 
dollar = dolar doller dollor dollarr dolllar dollir dollur 
collar = colar coller collor sollar ssollar scollar collarr colllar 
deplore = deplorre depllore doplore deploro ddeplore deeplore deploree deploore depplore 
explore = explorre expllore esplore oxplore exploro eexplore exploree exploore expplore 
basin = besin bisin busin basi bosin baasin baesin 
basis = besis bisis busis bosis baasis baesis baisis 
lace = lasse lasce llace lece luce laco loce laace 
truce = truse trusse trusce trruce ttruce tuce truco trucce trucee 
induce = induse indusse indusce induco iduce inducce indduce inducee iinduce innduce 
anvil = anvill envil invil unvil avil onvil aanvil 
pupil = pupill pupiil ppupil puppil puupil pupeil prupil papil pupinl 
recompense = resompense ressompense rescompense rrecompense recomense rocompense recomponse recompenso recompese reccompense 
carbonate = cerbonate corbonate sarbonate ssarbonate scarbonate carrbonate carbonatte carbonete cirbonate 
problem = probelm prroblem probllem problom probblem probleem problemm prooblem pproblem 
tablet = tabelt tabllet ttablet tablett teblet tiblet tublet tablot 
become = besome bessome bescome bocome becomo bbecome beccome beecome becomee becomme 
come = ssome scome como ccome comee comme coome coeme conme compe 
reprint = rreprint reprrint reprintt roprint reprit reeprint repriint reprinnt repprint 
repay = rrepay repey repiy repuy ropay repoy repaay 
prepay = prrepay prepey prepiy prepuy propay prepoy prepaay 
repeal = repal rrepeal repeall repeel repeil repeul ropeal repoal 
now = nnow noow noww noew nonw nouw nuow naw niw nuw 
endow = ondow edow enddow eendow enndow endoow endoww endoew andow indow 
brow = brrow bbrow broow broww broew bwrow bronw brouw bruow 
prow = prrow proow pprow proww proew pwrow prew pronw prouw 
themselves = themsellves tthemselves themselfs thomselves themsolves themselvos theemselves themseelves themselvees thhemselves 
them = tthem thom theem thhem themm thenm themp tham thim 
carnival = cernival cornival sarnival ssarnival scarnival carrnival carnivall carnivel cirnival 
skeptical = skeptisal skeptissal skeptiscal skepticall skepttical skepticel skepticil skepticul skoptical 
bauble = baubel baublle beuble biuble buuble baublo bouble 
taught = ttaught taughtt teught tiught tuught tought taaught 
caustic = saustic caustis ssaustic caustiss scaustic caustisc causttic ceustic ciustic cuustic 
canvas = sanvas ssanvas scanvas cenvas canves cinvas canvis cunvas canvus cavas 
asleep = aslep aselep aslleep esleep isleep usleep asloep asleop 
cardinal = cerdinal cordinal sardinal ssardinal scardinal carrdinal cardinall cardinel cirdinal 
card = cerd sard ssard scard carrd cird caard 
lard = lerd larrd llard lird lurd laard 
hard = hord harrd hird hurd haard haerd haird 
awake = ewake aweke iwake awike uwake awuke awako 
wake = weke wike wuke wako waake waeke waike 
bake = beke buke bako boke baake baeke baike baoke 
rake = rrake reke rike ruke rako roke raake 
confirm = sonfirm ssonfirm sconfirm confirrm cofirm cconfirm conffirm confiirm confirmm connfirm 
firm = firrm ffirm fiirm firmm feirm fiwrm firnm firmp veirm 
twinkle = twinkel twinklle ttwinkle twinklo twikle twinklee twiinkle twinkkle twinnkle 
pink = pik piink pinkk pinnk ppink peink pank penk 
drink = drrink drik ddrink driink drinkk drinnk dreink dwrink 
sink = sik siink sinkk sinnk ssink seink cink scink zink 
refreshing = rrefreshing refrreshing rofreshing refroshing refreshig reefreshing refreeshing reffreshing refreshingg refreshhing 
refresh = rrefresh refrresh rofresh refrosh reefresh refreesh reffresh refreshh 
tower = towerr ttower towor toweer toower towwer toewer towar 
flower = flowerr fllower flowor floweer fflower floower flowwer floewer 
flowery = flowerry fllowery flowory floweery fflowery floowery flowwery floweryy 
remind = rremind romind remid remindd reemind remiind remmind reminnd remeind 
restrain = rrestrain restrrain resttrain restrein restriin restruin rostrain restrai 
respond = rrespond rospond respod respondd reespond responnd respoond resppond resspond 
reclaim = reslaim resslaim resclaim rreclaim recllaim recleim recliim recluim roclaim 
rodeo = rodea rrodeo rodoo roddeo rodeeo roodeo rodeoo roedeo rodeoe 
romeo = romea rromeo romoo romeeo rommeo roomeo romeoo roemeo romeoe 
aspect = aspest aspesst aspesct aspectt espect ispect uspect aspoct 
insect = insest insesst insesct insectt insoct isect insecct inseect iinsect innsect 
cargo = cergo corgo sargo ssargo scargo carrgo cirgo curgo 
car = cer sar ssar carr caar caer cair caor 
card = cerd sard ssard scard carrd cird caard 
sadden = saden sedden sidden saddon sadde saadden saedden saidden 
sudden = suden suddon sudde suddden suddeen suddenn ssudden suudden cudden 
space = spase spasse spasce spece spuce spaco spoce spaace 
race = rase rasse rasce rrace rece ruce raco roce 
brace = brase brasse brasce brrace brece brice bruce braco 
trace = trase trasse trasce trrace ttrace trece traco troce traace 
be = bo bbe ba ben bae bai bao bau 
maybe = meybe miybe muybe maybo moybe maaybe maeybe 
repress = repres rrepress reprress ropress repross reepress repreess reppress 
reproach = reproash reproassh reproasch rreproach reprroach reproech reproich reprouch roproach 
replenish = repelnish rreplenish repllenish roplenish replonish repleish reeplenish repleenish replenishh repleniish 
pretend = prretend prettend protend pretond preted pretendd preetend preteend pretennd ppretend 
detest = dettest detestt dotest detost ddetest deetest deteest detesst 
zeal = zal zeall zeel zeil zeul zoal zeol 
deal = dal deall deel deil deul doal deol 
real = ral rreal reall reil reul roal reol reaal 
meal = mal meall meel meil meul moal meol 
jot = jott jjot joot joet jont jout juot jat jit 
object = objest objesst objesct objectt objoct obbject objecct objeect objject oobject 
theft = ttheft theftt thoft theeft thefft thheft thevet thaft 
tenth = ttenth tentth tonth teth teenth tenthh tennth tnth 
ten = tten te tenn taan taen tain taon taun 
net = nett neet nnet nat nent naat naet nait 
revenge = rrevenge refnge rovenge revonge revengo revege reevenge reveenge revengee revengge 
preventive = prreventive preventtive prefntive preventif proventive prevontive preventivo prevetive preeventive preveentive 
rabble = rable rabbel rrabble rabblle rebble ribble rabblo robble 
scrabble = scrable scrabbel ssrabble sssrabble sscrabble scrrabble scrabblle screbble scrubble scrabblo 
scribble = scrible scribbel ssribble sssribble sscribble scrribble scribblle scribblo scribbble 
cobble = coble cobbel sobble ssobble scobble cobblle cobblo cobbble ccobble 
relapse = rrelapse rellapse relepse relipse relupse rolapse relapso relopse 
release = relase reelase rrelease rellease releese releise releuse rolease reloase releaso 
prowess = prowes prrowess prowoss proweess proowess pprowess prowesss prowwess 
prow = prrow proow pprow proww proew pwrow prew pronw prouw 
penny = peny ponny peenny pennny ppenny pennyy panny 
funny = funy ffunny funnny fuunny funnyy frunny veunny 
sunny = suny sunnny ssunny suunny sunnyy cunny scunny 
shall = shal shalll shull sholl shaall shaell shaill shaoll 
gallery = galery galelry gallerry galllery gellery gillery gullery gallory 
rally = raly rrally rallly relly rilly rully rolly 
how = hhow hoow howw hoew honw houw huow hiw huw haaw 
cow = ssow ccow coow coww coew cew conw couw cuow 
allow = alow alllow ellow illow ullow ollow 
now = nnow noow noww noew nonw nouw nuow naw niw nuw 
ebb = eb obb ebbb eebb abb ibb enbb 
pebble = peble pebbel pebblle pobble pebblo pebbble peebble pebblee 
boundary = buondary bondary boundery boundory boundarry boundiry boundury boudary 
vinegar = vineger vinegor vinegarr vinegir vinegur vinogar viegar 
eager = ager eagerr eeger eiger euger oager eagor eoger 
easy = asy eesy eisy eusy oasy eosy eaasy 
read = rread reid reud reod reaad reaed reaid reaod 
bead = beed beid beud boad beod beaad beaed 
parole = paroel perole porole parrole parolle pirole purole parolo 
role = roel rrole rolle rolo rolee roole roele wrole 
recoil = resoil ressoil rescoil rrecoil recoill rocoil reccoil reecoil recoiil 
recur = resur ressur rescur rrecur recurr rocur reccur reecur 
detach = detash detassh detasch dettach detech detich detuch dotach 
inches = inshes insshes insches inchos iches incches inchees inchhes iinches innches 
embody = ombody embbody emboddy eembody emmbody emboody embodyy emboedy enmbody empbody 
redden = reden rredden rodden reddon redde reddden reedden reddeen reddenn 
sadden = saden sedden sidden saddon sadde saadden saedden saidden 
sudden = suden suddon sudde suddden suddeen suddenn ssudden suudden cudden 
research = resarch reseerch reseorch researsh researssh researsch rresearch researrch reseirch 
search = sarch seerch seorch searsh searssh searsch searrch seirch seurch 
twelve = twellve ttwelve twelf twolve twelvo tweelve twelvee twelvve 
absolve = absollve absolf ebsolve ibsolve ubsolve absolvo obsolve 
burglar = burgler burglor burrglar burglarr burgllar burglir burglur 
similar = similer similor similarr simillar similir similur 
solar = soler solor solarr sollar solir solur 
polar = poler polor polarr pollar polir polur 
restrict = restrist restrisst restrisct rrestrict restrrict resttrict restrictt rostrict restricct reestrict 
restrain = rrestrain restrrain resttrain restrein restriin restruin rostrain restrai 
me = mee mme nme mpe maa mae mai mao mau mea 
he = hee hhe hu haa hae hai hao hau hea 
she = sho shee shhe sshe che sche zhe sha shi 
we = wo wwe wa wi wu waa wae 
spruce = spruse sprusse sprusce sprruce spuce spruco sprucce sprucee sppruce 
truce = truse trusse trusce trruce ttruce tuce truco trucce trucee 
gross = gros grross ggross grooss grosss groess grocs grosc 
kiss = kis kiiss kkiss kisss keiss kics kisc 
russet = ruset rrusset russett usset russot russeet russset 
declaim = deslaim desslaim desclaim decllaim decleim decliim decluim doclaim 
aim = eim iim uim oim aaim aeim aiim 
maim = meim miim muim moim maaim maeim maiim 
mercer = merser mersser merscer merrcer mercerr morcer mercor merccer meercer merceer 
mercy = mersy merssy merscy merrcy morcy merccy meercy mmercy mercyy 
assault = asault assaullt assaultt essault asseult issault assiult ussault assuult 
fault = faullt faultt feult fiult fuult foult faault 
faulty = faullty faultty feulty fiulty fuulty foulty faaulty 
imitation = imitatian imittation imitattion imitasion imitetion imitition imitution imitatio 
recitation = recitatian resitation ressitation rescitation rrecitation recittation recitattion recitasion recitetion recitition 
destination = destinatian desttination destinattion destinasion destinetion destinition destinution dostination destiation destinatio 
battle = batle battel battlle batttle bettle bittle buttle battlo 
cattle = catle cattel sattle ssattle scattle cattlle catttle cettle cittle 
bottle = botle bottel bottlle botttle bottlo bbottle bottlee boottle 
eon = ean oon eo eeon eonn eoon eoen aon een enon 
demon = domon ddemon deemon demmon demonn demoon demoen denmon dempon damon 
bacon = bason basson bascon becon bicon bucon baco bocon 
parse = perse porse parrse pirse parso paarse 
crease = crase srease ssrease screase crrease creese creise creuse croase creaso 
increase = incrase insrease inssrease inscrease incrrease increese increise increuse incroase increaso 
disuse = disuso ddisuse disusee diisuse dissuse disusse disuuse deisuse dicuse disuce 
meter = meterr metter moter metor meeter meteer mmeter metar 
fever = feverr fefr fover fevor feever feveer ffever fevver fevar 
theater = thater theaterr ttheater theatter theeter theiter theuter thoater theator 
legal = elgal llegal legall legel legil legul logal legol 
coward = cowerd coword soward ssoward scoward cowarrd cowird cowurd 
custard = custerd custord sustard ssustard scustard custarrd custtard custird custurd 
steward = stewerd steword stewarrd stteward stewird stewurd stoward 
lizard = lizerd lizord lizarrd llizard lisard lizird lizurd 
lamb = llamb lemb lumb lomb laamb laemb laimb laomb 
comb = somb ssomb scomb combb ccomb commb coomb coemb conmb compb 
climb = slimb sslimb sclimb cllimb climbb cclimb cliimb climmb cleimb 
condition = conditian sondition ssondition scondition condittion condision codition conditio ccondition conddition 
consider = sonsider ssonsider sconsider considerr considor cosider cconsider considder consideer consiider 
parental = perental porental parrental parentall parenttal parentel pirental parentil purental 
regular = reguler regulor rregular regularr regullar regulir regulur rogular 
singular = singuler singulor singularr singullar singulir singulur sigular 
particular = perticular particuler porticular particulor partisular partissular partiscular parrticular particularr particullar 
dupe = dupo ddupe dupee duppe duupe dupa dupi dape dupen dunpe 
fluid = flluid fluidd ffluid fluiid fluuid flueid flruid veluid flaid 
include = inslude insslude insclude incllude includo iclude incclude includde includee iinclude 
signal = signall signel signil signul signol signaal signael 
malignant = mallignant malignantt melignant malignent milignant malignint mulignant malignunt malignat 
defraud = defrraud defreud defriud defruud dofraud defroud defraaud 
default = defaullt defaultt defeult defiult defuult dofault defoult 
author = authorr autthor euthor iuthor uuthor outhor aauthor 
theory = theary theorry ttheory thoory theeory thheory theoory theoryy 
sordid = sorrdid sorddid sordidd sordiid soordid ssordid soerdid sordeid cordid 
rabbit = rabit rrabbit rabbitt rebbit ribbit rubbit robbit 
turnip = turrnip tturnip turniip turnnip turnipp tuurnip turneip tuwrnip 
deity = dity deitty doity ddeity deeity deiity deityy diety 
notion = notian nottion nosion notio notiion nnotion notionn nootion notioon 
nation = natian nattion nasion netion nition nution natio 
mention = mentian menttion mension montion metion mentio meention mentiion mmention menntion 
section = sectian sestion sesstion sesction secttion secsion soction sectio secction seection 
civilization = civilizatian sivilization ssivilization scivilization civillization civilizattion civilizasion civilisation civilizetion civilizition 
imitation = imitatian imittation imitattion imitasion imitetion imitition imitution imitatio 
bliss = blis blliss bbliss bliiss blisss bleiss blics blisc 
kiss = kis kiiss kkiss kisss keiss kics kisc 
die = dei dio ddie diee diie deie dia dii dien 
tried = treid trried ttried triod triedd trieed triied treied 
fried = freid frried friod friedd frieed ffried friied freied fwried 
cried = creid sried ssried scried crried criod ccried criedd crieed criied 
toothpaste = tothpaste ttoothpaste tootthpaste toothpastte toothpeste toothpiste toothpuste toothpasto 
tooth = toth ttooth tootth toothh toooth toeoth tooeth 
action = actian astion asstion asction acttion acsion ection iction uction actio 
caption = captian saption ssaption scaption capttion capsion ception ciption cuption captio 
fraction = fractian frastion frasstion frasction frraction fracttion fracsion frection fruction fractio 
election = electian eelction elestion elesstion elesction ellection electtion elecsion olection eloction 
pardon = perdon pordon parrdon pirdon purdon pardo 
wanton = wantton wenton winton wunton waton wanto wonton 
person = perrson porson perso peerson personn persoon pperson persson persoen 
sermon = serrmon sormon sermo seermon sermmon sermonn sermoon ssermon sermoen 
fiction = fictian fistion fisstion fisction ficttion ficsion fictio ficction ffiction fiiction 
friction = frictian fristion frisstion frisction frriction fricttion fricsion frictio fricction ffriction 
convene = sonvene ssonvene sconvene confne convone conveno convee covene cconvene conveene 
concrete = soncrete consrete ssoncrete conssrete sconcrete conscrete concrrete concrette concrote concreto 
conclude = sonclude conslude ssonclude consslude sconclude consclude concllude concludo coclude cconclude 
stupid = sttupid stupidd stupiid stuppid sstupid stuupid stupeid ctupid 
student = sttudent studentt studont studet studdent studeent studennt sstudent 
senator = senatorr senattor senetor senitor senutor sonator seator senotor 
assessor = asessor assesor assessorr essessor issessor ussessor assossor ossessor 
memorable = memorabel memorrable memorablle memoreble memorible memoruble momorable memorablo 
station = statian sttation stattion stasion stetion stition stution statio 
foundation = foundatian fuondation fondation foundattion foundasion foundetion foundition foundution foundatio foudation 
neon = nean neo neeon nneon neonn neoon neoen naon nion neen 
eon = ean oon eo eeon eonn eoon eoen aon een enon 
invention = inventian inventtion infntion invension invontion invetion ivention inventio inveention iinvention 
mention = mentian menttion mension montion metion mentio meention mentiion mmention menntion 
major = majorr mejor mijor mujor mojor maajor maejor 
juror = jurror jurorr jjuror juroor juuror juroer juwror jurowr 
enforce = enforse enforsse enforsce enforrce onforce enforco eforce enforcce eenforce enforcee 
force = forse forsse forsce forrce forco forcce forcee fforce foorce 
witness = witnes wittness witeness witiness witnoss witneess wiitness witnness witnesss 
harness = harnes herness horness harrness hirness hurness harnoss 
decrease = decrase desrease dessrease descrease decrrease decreese decreise decreuse docrease decroase 
crease = crase srease ssrease screase crrease creese creise creuse croase creaso 
by = bby byy 
my = mmy myy nmy mpy 
try = trry ttry tryy twry 
why = whhy wwhy whyy 
fulfill = fulfil fullfill fulfilll ffulfill fulffill fulfiill 
fill = fil filll ffill fiill feill veill 
ill = il illl iill eill inll oll 
bill = bil billl bbill biill beill binll 
alkali = allkali alkalli elkali alkeli ilkali alkili ulkali alkuli 
banana = benana banena banane binana banina banani bunana banuna bananu baana 
malady = mallady melady maledy malidy mulady maludy molady 
cavalry = savalry ssavalry scavalry cavalrry cavallry cevalry cavelry civalry cavilry cuvalry 
fly = flly ffly flyy vely 
rely = rrely relly roly reely relyy rley wrely raly 
reply = rreply replly roply reeply repply replyy wreply raply 
lying = llying lyig lyingg lyiing lyinng lyying lyeing lyindg 
hybrid = hybrrid hybbrid hybridd hhybrid hybriid hyybrid hybreid hybwrid hybrind 
hydra = hydrra hydre hydri hydru hydraa hydrae hydrai 
hydrant = hydrrant hydrantt hydrent hydrint hydrunt hydrat hydront 
bridge = brridge brige bridgo bbridge briddge bridgee bridgge briidge breidge 
abridge = abrridge abrige ebridge ibridge ubridge abridgo obridge 
civilize = sivilize ssivilize scivilize civillize civilise civilizo ccivilize civilizee ciivilize civiilize 
mobilize = mobillize mobilise mobilizo mobbilize mobilizee mobiilize mobiliize mmobilize moobilize 
nonentity = nonenttity nonentitty nonontity nonetity noentity noneentity nonentiity nnonentity nonnentity nonenntity 
destiny = desttiny dostiny destiy ddestiny deestiny destiiny destinny desstiny destinyy 
centigram = sentigram ssentigram scentigram centigrram centtigram centigrem centigrim centigrum contigram cetigram 
toils = toills ttoils toiils tooils toilss toeils toilc 
noisy = noiisy nnoisy nooisy noissy noisyy noeisy noicy noiscy 
lungs = llungs lunggs lunngs lungss luungs lungc lungsc lrungs 
fertile = fertiel ferrtile fertille ferttile fortile fertilo feertile fertilee ffertile fertiile 
hostile = hostiel hostille hosttile hostilo hostilee hhostile hostiile hoostile hosstile 
tile = tiel tille ttile tilo tilee tiile teile tila 
bedtime = bedttime bodtime bedtimo bbedtime beddtime beedtime bedtimee bedtiime bedtimme 
pastime = pasttime pestime pistime pustime pastimo postime paastime 
labeling = llabeling labelling lebeling lubeling laboling labelig lobeling laabeling 
label = llabel labell lebel lubel labol lobel laabel laebel 
formula = forrmula formulla formule formuli formulu formulo formulaa 
informal = inforrmal informall informel informil informul iformal informol 
corporal = sorporal ssorporal scorporal corrporal corporral corporall corporel corporil corporul 
senator = senatorr senattor senetor senitor senutor sonator seator senotor 
type = ttype typee typpe tyype typa typi typen 
tyrant = tyrrant ttyrant tyrantt tyrent tyrint tyrunt tyrat tyront 
patronize = patrronize pattronize patronise petronize pitronize putronize patronizo patroize 
absolute = absollute absolutte ebsolute ibsolute ubsolute absoluto obsolute 
option = optian opttion opsion optio optiion optionn ooption optioon opption 
salvation = salvatian sallvation salvattion salvasion selvation salvetion silvation salvition sulvation salvution 
vowel = vowell vowol voweel voowel vvowel vowwel voewel vowle vowal 
towel = towell ttowel towol toweel toowel towwel toewel towle 
endure = endurre ondure enduro edure enddure eendure enduree enndure enduure 
manure = manurre menure minure munure manuro maure monure 
badge = bage bedge bidge badgo baadge baedge baidge baodge 
lodge = llodge lodgo loddge lodgee lodgge loodge loedge lodga 
breathe = brathe brreathe breatthe breethe breithe breuthe broathe breatho 
criticize = sriticize critisize ssriticize critissize scriticize critiscize crriticize critticize criticise criticizo 
retake = rretake rettake reteke retike retuke rotake retako retoke 
retrace = retrase retrasse retrasce rretrace retrrace rettrace retrece retrice retruce rotrace 
reflex = refelx rreflex refllex refles roflex reflox reeflex refleex refflex 
regal = rregal regall regel regil regul rogal regol 
tailor = tailorr taillor ttailor teilor tiilor tuilor toilor 
stupor = stuporr sttupor stupoor stuppor sstupor stuupor stupoer ctupor 
superb = superrb suporb superbb supeerb supperb ssuperb suuperb suparb 
herb = herrb horb herbb heerb hherb harb hewrb 
skeptic = skeptis skeptiss skeptisc skepttic skoptic skepticc skeeptic skeptiic skkeptic skepptic 
kept = keptt kopt keept kkept keppt kapt kipt kenpt 
moonshine = monshine moonshino moonshie mooshine moonshinee moonshhine moonshiine mmoonshine moonnshine moonshinne 
moon = mon mmoon moonn mooon moeon mooen nmoon mpoon meon 
squad = squed squud squod squaad squaed squaid squaod squaud 
squat = squatt squet squit squut squot squaat squaet 
squash = squesh squush squosh squaash squaesh squaish squaosh squaush 
tartar = tertar tortar tartor tarrtar tartarr ttartar tarttar tirtar tartir 
lunar = luner lunor lunarr llunar lunir lunur luar 
nonfiction = nonfictian nonfistion nonfisstion nonfisction nonficttion nonficsion nofiction nonfictio nonficction nonffiction 
fiction = fictian fistion fisstion fisction ficttion ficsion fictio ficction ffiction fiiction 
picnic = pisnic picnis pissnic picniss piscnic picnisc piccnic picnicc piicnic picniic 
clip = sslip sclip cllip cclip cliip clipp cleip clinp clep 
crib = srib ssrib scrib crrib cribb ccrib criib creib cwrib 
clinch = slinch clinsh sslinch clinssh sclinch clinsch cllinch clich cclinch clincch 
banjo = benjo binjo bunjo bajo bonjo baanjo baenjo 
enjoy = onjoy ejoy eenjoy enjjoy ennjoy enjooy enjoyy enjoey anjoy injoy 
bubble = buble bubbel bubblle bubblo bbubble bubbble bubblee buubble 
rabble = rable rabbel rrabble rabblle rebble ribble rabblo robble 
being = bing boing beig bbeing beeing beingg beiing beinng bieng 
be = bo bbe ba ben bae bai bao bau 
cotton = coton sotton ssotton scotton cottton cotto ccotton cottonn cootton 
button = buton buttton butto bbutton buttonn buttoon buutton 
mutton = muton muttton mutto mmutton muttonn muttoon muutton 
awaken = ewaken aweken iwaken awiken uwaken awuken awakon 
waken = weken wiken wuken wakon waaken waeken waiken 
taken = ttaken teken tiken tuken takon taaken taeken 
shaken = sheken shiken shuken shakon shoken shaaken shaeken 
true = trrue ttrue tue truo truee truue twrue 
sue = suo suee ssue suue scue srue zue sua sui 
blue = bllue bluo bblue bluee bluue blrue blua blui blae 
glue = gllue gluo gluee gglue gluue glrue dglue glua glui 
compete = sompete ssompete scompete compette comete competo ccompete compeete competee commpete 
comprise = somprise ssomprise scomprise comprrise comrise compriso ccomprise comprisee compriise commprise 
compute = sompute ssompute scompute computte comute computo ccompute computee commpute coompute 
doll = dol dolll ddoll dooll doell donll 
jolly = joly jollly jjolly joolly jollyy joelly 
belittle = belitle belittel bellittle belittlle belitttle bolittle belittlo bbelittle beelittle 
little = litle littel llittle littlle litttle littlo littlee liittle 
off = offf ooff oeff ovef ofve onff ouff uoff aff 
offer = ofer offerr offor offeer offfer ooffer oeffer offar 
differ = difer differr diffor ddiffer diffeer difffer diiffer deiffer 
chaff = chaf shaff sshaff schaff cheff chiff chuff choff 
baffle = bafle baffel bafflle beffle biffle buffle bafflo boffle 
ruffle = rufle ruffel rruffle rufflle uffle rufflo rufflee rufffle 
shuffle = shufle shuffel shufflle shufflo shufflee shufffle shhuffle sshuffle 
torrent = torent torrrent ttorrent torrentt torront torret torreent torrennt toorrent 
sorrel = sorel sorrrel sorrell sorrol sorreel soorrel 
abhorrent = abhorent abhorrrent abhorrentt ebhorrent ibhorrent ubhorrent abhorront abhorret 
here = herre hore heere heree hhere hewre hera heri 
rebate = rrebate rebatte rebete rebite rebute robate rebato rebote 
impede = imede impode impedo impedde impeede impedee iimpede immpede imppede eimpede 
these = tthese theso theese thesee thhese thesse thece thesce 
going = goig ggoing goingg goiing goinng gooing goeing dgoing goindg 
clothing = slothing sslothing sclothing cllothing clotthing clothig cclothing clothingg clothhing clothiing 
jewel = jewell jowel jewol jeewel jeweel jjewel jewwel jewle jawel 
jewelry = jewelrry jewellry jowelry jewolry jeewelry jeweelry jjewelry jewwelry 
frigid = frrigid frigidd ffrigid friggid friigid frigiid freigid frigeid fwrigid 
digit = digitt ddigit diggit diigit digiit deigit digeit didgit dingit 
serpent = serrpent serpentt sorpent serpont serpet seerpent serpeent serpennt serppent 
stiffen = stifen sttiffen stiffon stiffe stiffeen stifffen stiiffen stiffenn sstiffen 
kitchen = kitshen kitsshen kitschen kittchen kitchon kitche kitcchen kitcheen kitchhen kiitchen 
weaken = weeken weiken weuken woaken weakon weake weoken 
cabin = sabin ssabin scabin cebin cibin cubin cabi cobin 
robin = rrobin robi robbin robiin robinn roobin roebin robein wrobin 
behind = bohind behid bbehind behindd beehind behhind behiind behinnd beheind bahind 
belong = bellong bolong belog bbelong beelong belongg belonng beloong beloeng 
example = exampel examplle examle esample exemple eximple exumple oxample examplo 
exactly = exastly exasstly exasctly exactlly exacttly esactly exectly exictly exuctly oxactly 
competent = sompetent ssompetent scompetent compettent competentt cometent compotent competont competet ccompetent 
benefited = benefitted bonefited benofited benefitod beefited bbenefited benefitedd beenefited beneefited benefiteed 
resentment = rresentment resenttment resentmentt rosentment resontment resentmont resetment resentmet reesentment reseentment 
optimism = opttimism optiimism optimiism optimmism optimismm ooptimism opptimism optimissm oeptimism 
multiply = mulltiply multiplly multtiply multiiply mmultiply multipply muultiply 
suffer = sufer sufferr suffor suffeer sufffer ssuffer suuffer suffar 
differ = difer differr diffor ddiffer diffeer difffer diiffer deiffer 
recondite = resondite ressondite rescondite rrecondite reconditte rocondite recondito recodite reccondite reconddite 
recognize = resognize ressognize rescognize rrecognize recognise rocognize recognizo reccognize reecognize recognizee 
wrath = rath wrrath wratth wreth writh wruth wraath 
wren = ren wrren wron wre wreen wrenn wwren wran 
wrench = wrensh wrenssh wrensch rench wrrench wronch wrech wrencch wreench wrenchh 
wring = wrring wrig wringg wriing wrinng wwring wreing wrindg 
territory = teritory terrritory territorry tterritory territtory torritory teerritory terriitory territoory 
berry = bery berrry borry bberry beerry berryy barry 
cherry = chery ssherry scherry cherrry chorry ccherry cheerry chherry 
err = errr orr eerr ewrr erwr irr 
duel = duell duol dduel dueel duuel dule druel duil dael 
duly = dduly duuly dulyy druly daly dunly dely dily doly 
illegal = ilegal ilelgal illlegal illegall illegel illegil illegul illogal 
legal = elgal llegal legall legel legil legul logal legol 
grabbed = grabed grrabbed grebbed gribbed grabbod grobbed graabbed graebbed 
rabble = rable rabbel rrabble rabblle rebble ribble rabblo robble 
hoax = hoex hoix houx hoox hoaax hoaex hoaix 
road = rroad roed roid roud roaad roaed roaid 
toad = ttoad toid toud tood toaad toaed toaid toaod 
boat = boatt boet boit boaat boaet boait boaot boaut 
avail = availl evail aveil ivail aviil uvail avuil 
vain = viin vuin vai voin vaain vaein vaiin vaoin 
noontime = nontime noonttime noontimo nootime noontimee noontiime noontimme nnoontime noonntime nooontime 
noon = noo nnoon noonn nooon noeon nooen noen nonon 
fury = ffury fuury furyy fuwry frury veury fary funry fery 
purist = purrist puristt puriist ppurist purisst puurist pureist purict 
purity = purrity puritty puriity ppurity puurity purityy pureity puwrity 
staff = staf sttaff steff stoff staaff staeff staiff staoff stauff 
traffic = trafic traffis traffiss traffisc trraffic ttraffic treffic triffic truffic 
argument = ergument orgument arrgument argumentt irgument urgument argumont argumet 
garment = germent gorment garrment garmentt girment gurment garmont garmet 
omen = omon ome omeen ommen omenn oomen oemen onmen ompen oman 
moment = momentt momont momet momeent mmoment momment momennt mooment moement 
condor = sondor ssondor scondor condorr codor ccondor conddor conndor coondor condoor 
effort = efort efforrt effortt offort eeffort efffort effoort 
plethora = pelthora plethorra pllethora pletthora plethore plethori plethoru plothora 
balloon = baloon ballon ballloon belloon billoon bulloon balloo 
boon = bon bboon boonn booon boeon booen beon boen bonon 
noon = noo nnoon noonn nooon noeon nooen noen nonon 
moon = mon mmoon moonn mooon moeon mooen nmoon mpoon meon 
scuffle = scufle scuffel ssuffle sssuffle sscuffle scufflle scufflo sccuffle scufflee scufffle 
ruffle = rufle ruffel rruffle rufflle uffle rufflo rufflee rufffle 
shuffle = shufle shuffel shufflle shufflo shufflee shufffle shhuffle sshuffle 
development = devellopment developmentt deflopment dovelopment devolopment developmont developmet ddevelopment deevelopment deveelopment 
democrat = demosrat demossrat demoscrat democrrat democratt democret democrit democrut domocrat 
cemetery = semetery ssemetery scemetery cemeterry cemettery cometery cemotery cemetory ccemetery ceemetery 
pretzel = prretzel pretzell prettzel pretsel protzel pretzol preetzel pretzeel ppretzel 
helpless = helples helpelss hellpless helplless holpless helploss heelpless helpleess hhelpless 
effect = efect effest effesst effesct effectt offect effoct effecct eeffect effeect 
spy = sppy sspy spyy cpy scpy zpy 
deny = dony dey ddeny deeny denny denyy dany diny 
awry = ary awrry ewry iwry uwry owry aawry 
idea = ida idee idei ideu idoa ideo ideaa 
penal = penall penel penil penul ponal penol penaal 
derive = derrive derif dorive derivo dderive deerive derivee deriive derivve 
revive = rrevive revif rovive revivo reevive revivee reviive revvive revivve 
deprive = deprrive deprif doprive deprivo ddeprive deeprive deprivee depriive depprive 
drive = drrive drif drivo ddrive drivee driive drivve dreive dwrive 
harvest = hervest horvest harrvest harvestt harfst hirvest hurvest harvost 
forest = forrest forestt forost foreest fforest foorest foresst foerest 
buzz = buz busz buzs bbuzz buuzz buzzz bruzz bazz bunzz 
muzzle = muzle muzzel muzzlle muszle muzsle muzzlo muzzlee mmuzzle muuzzle 
drizzle = drizle drizzel drrizzle drizzlle driszle drizsle drizzlo ddrizzle drizzlee driizzle 
dizzy = dizy diszy dizsy ddizzy diizzy dizzyy dizzzy deizzy dinzzy 
froze = frroze frose frozo frozee ffroze frooze frozze froeze fwroze 
freeze = freze frreeze freese froeze freoze freezo freeeze freezee ffreeze 
away = eway awey iway awiy uway awuy 
way = wey wiy wuy woy waay waey waiy 
embellish = embelish embelllish ombellish embollish embbellish eembellish embeellish embellishh embelliish 
bell = bel belll bbell beell blel benll 
markup = merkup morkup marrkup mirkup murkup 
park = parrk pirk purk paark paerk pairk paork paurk 
mark = merk mork marrk mirk maark maerk 
bark = bork barrk birk burk baark baerk bairk 
orange = orrange orenge oringe orunge orango orage oronge 
tinge = ttinge tingo tige tingee tingge tiinge tinnge teinge tindge 
fringe = frringe fringo frige fringee ffringe fringge friinge frinnge freinge 
jail = jaill jeil jiil juil joil jaail jaeil 
mailbox = maillbox meilbox miilbox muilbox moilbox maailbox maeilbox 
rail = rrail raill reil riil ruil raail raeil 
pail = paill peil piil puil poil paail paeil 
plantation = plantatian pllantation planttation plantattion plantasion plentation plantetion plintation plantition pluntation 
station = statian sttation stattion stasion stetion stition stution statio 
wrist = rist wrrist wristt wriist wrisst wwrist wreist wrict 
wring = wrring wrig wringg wriing wrinng wwring wreing wrindg 
excuse = exsuse exssuse exscuse escuse oxcuse excuso exccuse eexcuse excusee excusse 
use = uso usee usse uuse uce usce uze usa usi 
waiver = waiverr waifr weiver wiiver wuiver waivor woiver 
wait = waitt weit wiit wuit woit waait waeit 
carpenter = cerpenter corpenter sarpenter ssarpenter scarpenter carrpenter carpenterr carpentter cirpenter 
ripen = rripen ripon ripeen riipen ripenn rippen reipen wripen ripan 
wonder = wonderr wondor woder wondder wondeer wonnder woonder wwonder woender 
affront = afront affrront affrontt effront iffront uffront affrot offront 
pervade = perrvade pervede pervide pervude porvade pervado pervode 
blockade = bloskade blosskade blosckade bllockade blockede blockide blockude blockado 
blade = bllade blede blide blude blado blode blaade 
made = mede mide mude mado maade maede maide 
king = kig kingg kiing kking kinng keing kindg kang keng 
kidnap = kidnep kidnip kidnup kidnop kidnaap kidnaep kidnaip 
kindle = kindel kindlle kindlo kidle kinddle kindlee kiindle kkindle kinndle 
alcohol = alsohol alssohol alscohol allcohol alcoholl elcohol ilcohol ulcohol 
balcony = balsony balssony balscony ballcony belcony bilcony bulcony balcoy 
fundamental = fundamentall fundamenttal fundemental fundamentel fundimental fundamentil fundumental fundamentul fundamontal fundametal 
metal = metall mettal metel metil metul motal metol 
mental = mentall menttal mentel mentil mentul montal mentol 
aware = awere awore awarre eware iware awire uware awure awaro 
unaware = unawere unawore unawarre uneware uniware unawire unuware unawure unawaro 
televise = teelvise tellevise ttelevise tolevise telovise televiso teelevise teleevise televisee televiise 
delegate = deelgate dellegate delegatte delegete delegite delegute dolegate delogate delegato 
element = eelment ellement elementt olement eloment elemont elemet eelement eleement elemeent 
enemy = onemy enomy eemy eenemy eneemy enemmy ennemy enemyy enenmy enempy 
spelling = speling spellling spolling spellig speelling spellingg spelliing 
sell = sel selll soll seell ssell slel 
bell = bel belll bbell beell blel benll 
smell = smel smelll smoll smeell smmell ssmell smlel 
crayon = srayon ssrayon scrayon crrayon creyon criyon cruyon crayo 
bray = brray brey briy bruy broy braay braey 
pray = prray priy pruy proy praay praey praiy praoy 
tray = trray ttray triy truy traay traey traiy traoy 
laurel = laurrel llaurel laurell leurel liurel luurel laurol lourel 
claus = slaus sslaus sclaus cllaus cleus clius cluus clous 
flaunt = fllaunt flauntt fleunt fliunt fluunt flaut flount 
sadness = sadnes sedness sidness sudness sadnoss sodness saadness 
mattress = mattres matress mattrress matttress mettress mittress muttress mattross 
ermine = errmine ormine ermino ermie eermine erminee ermiine ermmine erminne 
doctrine = dostrine dosstrine dosctrine doctrrine docttrine doctrino doctrie docctrine ddoctrine doctrinee 
crisis = srisis ssrisis scrisis crrisis ccrisis criisis crisiis crissis crisiss 
jurist = jurrist juristt juriist jjurist jurisst juurist jureist jurict 
citron = sitron ssitron scitron citrron cittron citro ccitron ciitron citronn citroon 
proceed = proced proseed prosseed prosceed prroceed procoed proceod procceed proceedd proceeed 
rosy = rrosy roosy rossy rosyy roesy rocy roscy wrosy 
noisy = noiisy nnoisy nooisy noissy noisyy noeisy noicy noiscy 
exempt = exemptt exemt esempt oxempt exompt eexempt exeempt exemmpt exemppt 
exist = existt esist oxist eexist exiist exisst exxist exeist exict 
admonish = edmonish idmonish udmonish admoish odmonish aadmonish aedmonish 
punish = puish punishh puniish punnish ppunish punissh puunish puneish punich 
fossil = fosil fossill ffossil fossiil foossil fosssil foessil fosseil 
possible = posible possibel possiblle possiblo possibble possiblee possiible poossible ppossible 
kindred = kindrred kindrod kidred kinddred kindredd kindreed kiindred kkindred kinndred 
kindle = kindel kindlle kindlo kidle kinddle kindlee kiindle kkindle kinndle 
sedition = seditian sedittion sedision sodition seditio seddition seedition sediition seditiion seditionn 
vacation = vacatian vasation vassation vascation vacattion vacasion vecation vacetion vication vacition 
nectar = necter nector nestar nesstar nesctar nectarr necttar nectir nectur 
custard = custerd custord sustard ssustard scustard custarrd custtard custird custurd 
together = togetherr ttogether togetther togother togethor togeether togetheer toggether togethher toogether 
toward = towerd toword towarrd ttoward towird towurd 
devotion = devotian devottion devosion dovotion devotio ddevotion deevotion devotiion devotionn devootion 
notion = notian nottion nosion notio notiion nnotion notionn nootion notioon 
describe = dessribe desssribe desscribe descrribe doscribe describo describbe desccribe ddescribe deescribe 
tribe = trribe ttribe tribo tribbe tribee triibe treibe twribe 
vein = vin voin vei veein veiin veinn vvein vien viin 
veil = vil veill fil voil veeil veiil vveil viel 
eight = ight eightt oight eeight eigght eighht eiight ieght 
freight = frreight freightt froight freeight ffreight freigght freighht freiight 
promise = prromise promiso promisee promiise prommise proomise ppromise promisse proemise 
nominate = nominatte nominete nominite nominute nominato nomiate nominote 
odd = od oddd oodd oedd edd ondd oudd uodd 
fodder = foder fodderr foddor foddder foddeer ffodder foodder foedder 
barrel = barel berrel borrel barrrel barrell birrel burrel barrol 
sorrel = sorel sorrrel sorrell sorrol sorreel soorrel 
inhabit = inhabitt inhebit inhubit ihabit inhobit inhaabit inhaebit inhaibit 
cabin = sabin ssabin scabin cebin cibin cubin cabi cobin 
organization = organizatian orrganization organizattion organizasion organisation orgenization organizetion orginization organizition orgunization 
recitation = recitatian resitation ressitation rescitation rrecitation recittation recitattion recitasion recitetion recitition 
destination = destinatian desttination destinattion destinasion destinetion destinition destinution dostination destiation destinatio 
carrot = carot cerrot corrot sarrot ssarrot scarrot carrrot carrott 
carry = cary cerry corry sarry ssarry scarry carrry cirry 
license = lisense lissense liscense llicense liconse licenso licese liccense liceense liicense 
slice = slise slisse slisce sllice slico slicce slicee sliice sslice 
sheriff = sherif sherriff shoriff sheeriff sherifff shheriff sheriiff ssheriff 
merit = merrit meritt morit meerit meriit mmerit mereit marit 
concern = soncern consern ssoncern conssern sconcern conscern concerrn concorn cocern cconcern 
conceal = concal sonceal conseal ssonceal consseal sconceal consceal conceall conceel conceil 
simplicity = simplisity simplissity simpliscity simpllicity simplicitty simlicity simpliccity siimplicity simpliicity simpliciity 
activity = astivity asstivity asctivity acttivity activitty ectivity ictivity uctivity 
lazy = llazy lasy lezy lizy luzy lozy laazy 
crazy = srazy ssrazy scrazy crrazy crasy crezy crizy cruzy 
frenzy = frrenzy frensy fronzy frezy freenzy ffrenzy frennzy frenzyy frenzzy 
deacon = dacon deason deasson deascon deecon deicon deucon doacon deaco 
congeal = congal songeal ssongeal scongeal congeall congeel congeil congeul congoal cogeal 
forward = forwerd forword forrward forwarrd forwird forwurd 
wayward = waywerd wayword waywarrd weyward wiyward waywird wuyward waywurd 
buzzard = buzard buzzerd buzzord buzzarrd buszard buzsard buzzird buzzurd 
saucy = sausy saussy sauscy seucy siucy suucy soucy 
saucer = sauser sausser sauscer saucerr seucer siucer suucer saucor 
division = divisian divisio ddivision diivision diviision divisiion divisionn divisioon divission divvision 
inscription = inscriptian inssription insssription insscription inscrription inscripttion inscripsion iscription inscriptio insccription 
vacate = vasate vassate vascate vacatte vecate vacete vicate vacite vucate vacute 
prostrate = prrostrate prostrrate prosttrate prostratte prostrete prostrite prostrute prostrato 
candidate = sandidate ssandidate scandidate candidatte cendidate candidete cindidate candidite cundidate candidute 
altitude = alltitude alttitude altittude eltitude iltitude ultitude altitudo oltitude 
microbe = misrobe missrobe miscrobe micrrobe microbo microbbe miccrobe microbee miicrobe mmicrobe 
tribe = trribe ttribe tribo tribbe tribee triibe treibe twribe 
tube = ttube tubo tubbe tubee tuube trube tubi tabe tuben 
cube = sube ssube scube cubo cubbe ccube cubee cuube crube cuba 
fortress = fortres forrtress fortrress forttress fortross fortreess ffortress foortress 
groundless = groundles gruondless grondless groundelss grroundless groundlless groundloss groudless grounddless groundleess 
yet = yett yot yeet yyet yat yit yent 
yes = yos yees yess yyes yec yesc yex yez yas 
yell = yel yelll yoll yeell yyell ylel 
yellow = yelow yelllow yollow yeellow yelloow yelloww yyellow 
absence = absense absensse absensce ebsence ibsence ubsence absonce absenco absece 
inducement = indusement indussement induscement inducementt inducoment inducemont inducemet iducement induccement indducement 
sentence = sentense sentensse sentensce senttence sontence sentonce sentenco setence sentece sentencce 
preference = preferense preferensse preferensce prreference preferrence proference preforence preferonce preferenco preferece 
remiss = remis rremiss romiss reemiss remiiss remmiss remisss remeiss 
reward = rewerd rreward rewarrd rewird rewurd roward 
infection = infectian infestion infesstion infesction infecttion infecsion infoction ifection infectio infecction 
section = sectian sestion sesstion sesction secttion secsion soction sectio secction seection 
gentle = gentel gentlle genttle gontle gentlo getle geentle gentlee ggentle 
title = titel titlle ttitle titlo titlee tiitle teitle titla 
nylon = nyllon nylo nnylon nylonn nyloon nyylon nyloen nylen 
deny = dony dey ddeny deeny denny denyy dany diny 
repulse = rrepulse repullse ropulse repulso reepulse repulsee reppulse repulsse 
repeal = repal rrepeal repeall repeel repeil repeul ropeal repoal 
mightily = mightilly mighttily migghtily mighhtily miightily mightiily mmightily mightilyy 
family = familly femily fimily fumily fomily faamily faemily 
medicinal = medisinal medissinal mediscinal medicinall medicinel medicinil medicinul modicinal medicial 
dominant = dominantt dominent dominint dominunt dominat domiant dominont 
yard = yerd yord yarrd yird yurd 
yarn = yern yorn yarrn yirn yurn 
fashion = fashian feshion fishion fushion fashio foshion faashion 
cushion = cushian sushion ssushion scushion cushio ccushion cushhion cushiion cushionn cushioon 
region = regian rregion rogion regio reegion reggion regiion regionn regioon 
legion = legian elgion llegion logion legio leegion leggion legiion legionn 
award = awerd aword awarrd eward iward awird uward awurd 
ward = werd warrd wird wurd waard waerd 
war = wer wor warr wir wur 
warm = werm warrm wirm wurm waarm waerm 
fathom = fatthom fethom fithom futhom fothom faathom faethom 
freedom = fredom frreedom froedom freodom freeddom freeedom ffreedom freedomm freedoom 
gossip = gosip ggossip gossiip goossip gossipp gosssip goessip gosseip gocsip 
fossil = fosil fossill ffossil fossiil foossil fosssil foessil fosseil 
year = yar yeer yeor yearr yeir yeur yoar 
gearing = garing geering georing gearring geiring geuring goaring gearig 
indelible = indelibel indellible indeliblle indolible indeliblo idelible indelibble inddelible indeelible indeliblee 
bundle = bundel bundlle bundlo budle bbundle bunddle bundlee bunndle buundle 
contrary = contrery controry sontrary ssontrary scontrary contrrary contrarry conttrary contriry 
vary = vory varry viry vury vaary vaery vairy 
cancer = sancer canser ssancer cansser scancer canscer cancerr cencer cincer cuncer 
grocer = groser groscer grrocer grocerr grocor groccer groceer ggrocer groocer 
grocery = grosery grossery groscery grrocery grocerry grocory groccery groceery ggrocery groocery 
frustrate = frrustrate frustrrate frusttrate frustratte fustrate frustrete frustrite frustrute frustrato 
magistrate = magistrrate magisttrate magistratte megistrate magistrete migistrate magistrite mugistrate magistrute magistrato 
baseball = basebal baseballl beseball basebell biseball basebill buseball basebull basoball 
ball = bal balll baall baell baill baoll baull beall beell 
attract = atract attrast attrasst attrasct attrract atttract attractt ettract attrect 
attendant = atendant atttendant attendantt ettendant attendent ittendant attendint uttendant attendunt 
attempt = atempt atttempt attemptt attemt ettempt ittempt uttempt attompt 
napkin = nepkin nipkin nupkin napki nopkin naapkin naepkin 
ask = esk isk usk osk aask aesk aisk 
bask = besk bisk bosk baask baesk baisk baosk bausk 
mask = mesk misk mosk maask maesk maisk maosk mausk 
stockings = stoskings stosskings stosckings sttockings stockigs stocckings stockinggs stockiings stockkings stockinngs 
stock = stosk stossk stosck sttock stocck stockk stoock sstock stoeck 
hair = hairr hiir huir hoir haair haeir haiir haoir 
chair = shair sshair schair chairr cheir chiir chuir 
unfair = unfairr unfeir unfiir unfuir ufair unfoir unfaair 
repair = rrepair repairr repeir repiir repuir ropair repoir 
demise = domise demiso ddemise deemise demisee demiise demmise demisse demeise demice 
despise = dospise despiso ddespise deespise despisee despiise desppise desspise despisse despeise 
kennel = kenel kennell konnel kennol keennel kenneel kkennel kennnel 
flannel = flanel fllannel flannell flennel flinnel flunnel flannol 
funnel = funel funnell funnol funneel ffunnel funnnel fuunnel 
turpitude = turrpitude tturpitude turpittude turpitudo turpitudde turpitudee turpiitude turppitude 
turn = turrn tturn turnn tuurn tuwrn trurn tunrn tirn 
cliff = clif sliff ssliff scliff clliff ccliff clifff cliiff 
afford = aford afforrd efford ifford ufford offord aafford 
off = offf ooff oeff ovef ofve onff ouff uoff aff 
deer = der deerr deor ddeer deeer deewr daer 
cheer = cher ssheer scheer cheerr choer cheor ccheer cheeer chheer 
sneer = sner sneerr snoer sneor sneeer snneer ssneer snear 
been = ben boen beon bbeen beeen beenn baen bien bein 
said = seid siid suid soid saaid saeid saiid 
despair = despairr despeir despiir despuir dospair despoir despaair 
airport = airrport airporrt airportt eirport iirport uirport oirport 
haircut = hairsut hairssut hairscut hairrcut haircutt heircut hiircut huircut 
arbitrate = erbitrate orbitrate arrbitrate arbitrrate arbittrate arbitratte arbitrete irbitrate arbitrite 
armistice = ermistice ormistice armistise armistisse armistisce arrmistice armisttice irmistice urmistice 
incite = insite inssite inscite incitte incito icite inccite incitee iincite inciite 
imbalance = imbalanse imbalansse imbalansce imballance imbelance imbalence imbilance imbalince imbulance imbalunce 
ambulance = ambulanse ambulansse ambulansce ambullance embulance ambulence imbulance ambulince umbulance ambulunce 
jury = jurry jjury juury juryy juwry jrury jary junry 
rural = rrural rurral rurall ural rurel ruril rurul rurol 
liberate = liberrate lliberate liberatte liberete liberite liberute liborate liberato 
inmate = inmatte imate inmete inmite inmute inmato inmote 
dictate = distate disstate disctate dicttate dictatte dictete dictite dictute dictato 
galling = galing gallling gilling gallig golling gaalling gaelling gailling 
all = al alll ull oll aall aell aill aoll 
ball = bal balll baall baell baill baoll baull beall beell 
tall = tal talll ttall tull taall taell taill taoll 
tornado = torrnado ttornado tornedo tornido tornudo tornodo tornaado 
cornet = sornet ssornet scornet corrnet cornett cornot ccornet corneet cornnet coornet 
forget = forrget forgett forgeet fforget forgget foorget foerget fowrget 
ransack = ransask ransassk ransasck rransack rensack ranseck rinsack ransick runsack ransuck 
wedlock = wedlosk wedlossk wedlosck wedllock wodlock wedlocck weddlock weedlock wedlockk 
neck = nesk nessk nesck nock necck neeck neckk nneck nack nenck 
lack = lask lassk lasck llack leck laack laeck laick laock 
extreme = extrreme exttreme estreme oxtreme extrome extremo eextreme extreeme extremee extremme 
rebate = rrebate rebatte rebete rebite rebute robate rebato rebote 
minus = mius miinus mminus minnus minuss minuus meinus minuc minusc 
cactus = sactus castus ssactus casstus scactus casctus cacttus cectus cictus cuctus 
focus = fosus fossus foscus foccus ffocus foocus focuss focuus foecus focuc 
locust = losust lossust loscust llocust locustt loccust loocust locusst 
everybody = everrybody efrybody overybody evorybody everybbody everyboddy eeverybody eveerybody everyboody 
everything = everrything everytthing efrything overything evorything everythig eeverything eveerything everythingg everythhing 
engineer = enginer engineerr ongineer enginoer engineor egineer engieer eengineer engineeer 
sneer = sner sneerr snoer sneor sneeer snneer ssneer snear 
wallow = walow walllow wellow wullow wollow waallow waellow 
billow = bilow billlow bbillow biillow billoow billoww billoew 
pillow = pilow pilllow piillow pilloow ppillow pilloww pilloew 
concede = soncede consede ssoncede conssede sconcede conscede concode concedo cocede cconcede 
convene = sonvene ssonvene sconvene confne convone conveno convee covene cconvene conveene 
concrete = soncrete consrete ssoncrete conssrete sconcrete conscrete concrrete concrette concrote concreto 
petition = petitian pettition petittion petision potition petitio peetition petiition petitiion petitionn 
reduction = reductian redustion redusstion redusction rreduction reducttion reducsion roduction reductio reducction 
caution = cautian saution ssaution scaution cauttion causion ceution ciution cuution cautio 
hero = herro horo heero hhero heroo heroe haro hewro 
zero = zerro sero zoro zeero zeroo zzero zeroe zaro 
preferred = prefered prreferred preferrred proferred preforred preferrod preferredd preeferred prefeerred 
prefer = prrefer preferr profer prefor preefer prefeer preffer pprefer 
drunkenness = drunkeness drunkennes drrunkenness dunkenness drunkonness drunkennoss drukenness ddrunkenness drunkeenness 
drunken = drrunken dunken drunkon drunke druken ddrunken drunkeen drunkken drunnken drunkenn 
broken = brroken brokon bbroken brokeen brokken brokenn brooken broeken bwroken 
rejoice = rejoise rejoisse rejoisce rrejoice rojoice rejoico rejoicce reejoice rejoicee rejoiice 
voice = voise voisse voisce voico voicce voicee voiice vooice vvoice voeice 
choice = shoice choise sshoice choisse schoice choisce choico cchoice choicce choicee 
faculty = fasulty fassulty fasculty facullty facultty feculty ficulty fuculty 
bankruptcy = bankruptsy bankruptssy bankruptscy bankrruptcy bankrupttcy bankuptcy benkruptcy binkruptcy bunkruptcy bakruptcy 
modicum = modisum modissum modiscum modiccum moddicum modiicum mmodicum modicumm moodicum modicuum 
upon = upo uponn upoon uppon uupon upoen rupon apon upen 
prohibit = prrohibit prohibitt prohibbit prohhibit prohiibit prohibiit proohibit pprohibit 
obesity = obesitty obosity obbesity obeesity obesiity oobesity obessity obesityy oebesity 
thesis = tthesis thosis theesis thhesis thesiis thessis thesiss theseis thecis 
zenith = zenitth senith zonith zeith zeenith zenithh zeniith zennith zzenith 
educate = edusate edussate eduscate educatte educete educite educute oducate educato 
prejudice = prejudise prejudisse prejudisce prrejudice projudice prejudico prejudicce prejuddice preejudice prejudicee 
postpone = posttpone postpono postpoe postponee postponne poostpone postpoone ppostpone postppone posstpone 
tone = ttone tono tonee toone toene tona toni tene tonen 
stone = sttone stono stoe stonee stonne stoone sstone stoene ctone 
bone = bono boe bbone bonee bonne boone boene bona boni bene 
zoology = zology zoollogy soology zoologgy zooology zooloogy zoologyy zzoology 
colony = solony ssolony scolony collony coloy ccolony colonny coolony coloony 
agony = egony igony ugony agoy ogony aagony aegony 
canopy = sanopy ssanopy scanopy cenopy cinopy cunopy caopy conopy 
lasso = laso llasso lesso lisso lusso losso laasso 
glass = glas gllass gless gliss gluss glaass glaess 
visible = visibel visiblle visiblo visibble visiblee viisible visiible vissible vvisible 
feasible = fasible feasibel feasiblle feesible feisible feusible foasible feasiblo 
soprano = soprrano sopreno soprino sopruno soprao soprono sopraano 
consider = sonsider ssonsider sconsider considerr considor cosider cconsider considder consideer consiider 
tearful = tarful teerful teorful tearrful tearfull ttearful teirful teurful toarful 
tear = teer teor tearr ttear teir teur toar 
unite = unitte unito uite unitee uniite unnite uunite uneite runite 
alkaline = allkaline alkalline elkaline alkeline ilkaline alkiline ulkaline alkuline alkalino alkalie 
franchise = franshise fransshise franschise frranchise frenchise frinchise frunchise franchiso frachise 
competition = competitian sompetition ssompetition scompetition compettition competittion cometition competision compotition competitio 
petition = petitian pettition petittion petision potition petitio peetition petiition petitiion petitionn 
industry = industrry industtry idustry inddustry iindustry inndustry indusstry induustry 
statutory = statutorry sttatutory stattutory statuttory stetutory stitutory stututory stotutory 
antidote = anttidote antidotte entidote intidote untidote antidoto atidote ontidote 
impulse = impullse imulse impulso impulsee iimpulse immpulse imppulse impulsse impuulse 
indulge = indullge indulgo idulge inddulge indulgee indulgge iindulge inndulge induulge 
belie = belei bellie bolie belio bbelie beelie beliee beliie beleie 
untie = untei unttie untio utie untiee untiie unntie uuntie unteie 
die = dei dio ddie diee diie deie dia dii dien 
tried = treid trried ttried triod triedd trieed triied treied 
impossible = imposible impossibel impossiblle imossible impossiblo impossibble impossiblee iimpossible impossiible 
possible = posible possibel possiblle possiblo possibble possiblee possiible poossible ppossible 
cameo = camea sameo ssameo scameo cemeo cimeo cumeo camoo 
resist = rresist resistt rosist reesist resiist ressist resisst reseist 
stereo = sterea sterreo sttereo storeo steroo steereo stereeo stereoo sstereo 
resemble = resembel rresemble resemblle rosemble resomble resemblo resembble reesemble reseemble resemblee 
jolt = jollt joltt jjolt joolt joelt jelt jonlt joult 
jam = jem jim jum jom jaam jaem jaim 
jet = jett jeet jjet jat jit jent jaat 
jest = jestt jost jeest jjest jesst ject jesct jext 
introduce = introduse introdusse introdusce intrroduce inttroduce introduco itroduce introducce introdduce introducee 
truce = truse trusse trusce trruce ttruce tuce truco trucce trucee 
timing = ttiming timig timingg tiiming timiing timming timinng teiming timeing 
humid = humidd hhumid humiid hummid huumid humeid hunmid humpid hrumid hamid 
eclipse = eslipse esslipse esclipse ecllipse oclipse eclipso ecclipse eeclipse eclipsee ecliipse 
consecrate = sonsecrate consesrate ssonsecrate consessrate sconsecrate consescrate consecrrate consecratte consecrete consecrite 
berserk = berrserk berserrk borserk bersork bberserk beerserk berseerk berserkk 
insert = inserrt insertt insort isert inseert iinsert innsert inssert 
baritone = beritone boritone barritone barittone biritone buritone baritono baritoe 
bare = bere bire bure baro baare baere 
barbarism = berbarism barberism borbarism barborism barrbarism barbarrism birbarism barbirism 
cheddar = chedar chedder cheddor sheddar ssheddar scheddar cheddarr cheddir cheddur 
council = cuoncil concil souncil counsil ssouncil counssil scouncil counscil councill coucil 
pencil = pensil penssil penscil pencill poncil pecil penccil peencil penciil 
dismiss = dismis ddismiss diismiss dismiiss dismmiss dissmiss dismisss deismiss dismeiss 
bliss = blis blliss bbliss bliiss blisss bleiss blics blisc 
prescribe = pressribe presssribe presscribe prrescribe prescrribe prescribo prescribbe presccribe preescribe prescribee 
respond = rrespond rospond respod respondd reespond responnd respoond resppond resspond 
itemized = ittemized itemised itomized itemizod itemizedd iteemized itemizeed iitemized itemiized itemmized 
item = ittem itom iteem iitem itemm eitem itenm itemp itam 
hermit = herrmit hermitt hormit heermit hhermit hermiit hermmit hermeit 
dormitory = dorrmitory dormitorry dormittory ddormitory dormiitory dormmitory doormitory dormitoory 
airplane = airrplane airpllane eirplane airplene iirplane airpline uirplane airplune airplano airplae 
airport = airrport airporrt airportt eirport iirport uirport oirport 
mesmerize = mesmerrize mesmerise mosmerize mesmorize mesmerizo meesmerize mesmeerize mesmerizee mesmeriize mmesmerize 
enterprise = enterrprise enterprrise entterprise onterprise entorprise enterpriso eterprise eenterprise enteerprise enterprisee 
accelerate = acelerate acceelrate ascelerate acselerate asscelerate acsselerate asccelerate acscelerate accelerrate accellerate 
submit = submitt subbmit submiit submmit ssubmit suubmit submeit cubmit 
subvert = subverrt subvertt subfrt subvort subbvert subveert ssubvert suubvert 
pure = purre puro ppure puure puwre prure pura puri puren 
impure = impurre imure impuro impuree iimpure immpure imppure impuure eimpure 
cure = ssure scure curre curo ccure curee cuure cuwre crure 
rubber = ruber rrubber rubberr ubber rubbor rubbber rubbeer 
rubbish = rubish rrubbish ubbish rubbbish rubbishh rubbiish rubbissh ruubbish 
presented = prresented presentted prosented presonted presentod preseted presentedd preesented preseented presenteed 
pretend = prretend prettend protend pretond preted pretendd preetend preteend pretennd ppretend 
landslide = llandslide landsllide lendslide lindslide lundslide landslido ladslide londslide 
blonde = bllonde blondo blode bblonde blondde blondee blonnde bloonde bloende 
vestige = vesttige fstige vostige vestigo veestige vestigee vestigge vestiige vesstige 
storage = storrage sttorage storege storige storuge storago storoge 
buy = bbuy buuy buyy bruy buny biy baay baey baiy baoy 
buyer = buyerr buyor bbuyer buyeer buuyer buyyer buyar buyewr 
guy = gguy guuy guyy gruy dguy guny gey giy goy gaay 
zebra = zebrra sebra zebre zebri zebru zobra zebro 
zero = zerro sero zoro zeero zeroo zzero zeroe zaro 
decimal = desimal dessimal descimal decimall decimel decimil decimul docimal 
pencil = pensil penssil penscil pencill poncil pecil penccil peencil penciil 
deficit = defisit defissit defiscit deficitt doficit deficcit ddeficit deeficit defficit defiicit 
frigate = frrigate frigatte frigete frigite frigute frigato frigote 
tribute = trribute ttribute tributte tributo tribbute tributee triibute 
talk = tallk ttalk telk tilk tulk tolk taalk 
walk = wallk welk wilk wulk wolk waalk waelk 
chalk = shalk sshalk schalk challk chelk chilk chulk cholk 
four = fuor fourr ffour foour fouur foeur fouwr forur veour 
court = cuort cort sourt ssourt scourt courrt courtt ccourt coourt 
your = yuor yor yourr yoour youur yyour yoeur youwr yorur 
yourself = yuorself yorself yourrself yoursellf yoursolf yourseelf yourselff yoourself 
beware = bewere bewore bewarre bewire bewure boware bewaro 
compare = compore sompare ssompare scompare comparre comare compire compure comparo 
subject = subjest subjesst subjesct subjectt subjoct subbject subjecct subjeect subjject ssubject 
secure = sesure sessure sescure securre socure securo seccure seecure securee 
malicious = maliciaus maliciuos malicios malisious malissious maliscious mallicious melicious milicious mulicious 
capricious = capriciaus capriciuos capricios sapricious caprisious ssapricious caprissious scapricious capriscious caprricious 
homogenize = homogenise homogonize homogenizo homogeize homogeenize homogenizee homoggenize hhomogenize homogeniize hommogenize 
comedy = somedy ssomedy scomedy comody ccomedy comeddy comeedy commedy coomedy comedyy 
mature = maturre matture meture miture muture maturo moture 
that = tthat thatt thet thit thut thot thaat 
warranty = waranty werranty worranty warrranty warrantty warrenty wirranty warrinty 
want = wantt wint wunt wat waant waent waint waont 
bachelor = bashelor basshelor baschelor bachelorr bachellor bechelor bichelor buchelor bacholor 
tailor = tailorr taillor ttailor teilor tiilor tuilor toilor 
money = monoy moey moneey mmoney monney mooney moneyy moeney nmoney mponey 
honey = honoy hoey honeey hhoney honney hooney honeyy hoeney honay honiy 
sarcasm = sercasm sorcasm sarsasm sarssasm sarscasm sarrcasm sarcesm sircasm sarcism 
arguing = erguing orguing arrguing irguing urguing arguig 
car = cer sar ssar carr caar caer cair caor 
scar = scer scor ssar sssar sscar scarr scir scur 
bought = buoght boght boughtt bbought bougght boughht boought bouught boeught 
sought = suoght soght soughtt sougght soughht soought ssought souught soeught 
significance = signifisance significanse signifissance significansse signifiscance significansce significence significince significunce significanco 
abusive = abusif ebusive ibusive ubusive abusivo obusive aabusive 
marigold = merigold morigold marrigold marigolld mirigold murigold 
mariner = meriner moriner marriner marinerr miriner muriner marinor marier 
attorney = atorney attorrney atttorney ettorney ittorney uttorney attornoy 
attorneys = atorneys attorrneys atttorneys ettorneys ittorneys uttorneys attornoys 
continuum = continum sontinuum ssontinuum scontinuum conttinuum contiuum cotinuum ccontinuum contiinuum continuumm 
prospectus = prospestus prospesstus prospesctus prrospectus prospecttus prospoctus prospecctus prospeectus proospectus pprospectus 
manual = manuall menual manuel minual manuil munual manuul maual 
mental = mentall menttal mentel mentil mentul montal mentol 
metal = metall mettal metel metil metul motal metol 
procure = prosure prossure proscure prrocure procurre procuro proccure procuree proocure pprocure 
cure = ssure scure curre curo ccure curee cuure cuwre crure 
climate = slimate sslimate sclimate cllimate climatte climete climite climute climato 
private = prrivate privatte privete privite privute privato privote 
sponge = spongo spoge spongee spongge sponnge spoonge spponge ssponge spoenge cponge 
none = nono noe nonee nnone nonne noone noene nona noni nene 
done = dono ddone donee donne doone doene doni dene donen 
around = aruond arond eround oround arround iround uround aroud 
cellar = celar celler cellor sellar ssellar scellar cellarr celllar 
move = mof movo movee mmove moove movve moeve nmove mpove mova 
prove = prrove provo provee proove pprove provve proeve pwrove prova 
unmoved = umoved unmofd unmovod unmovedd unmoveed unmmoved unnmoved unmooved uunmoved 
straw = strraw sttraw striw struw strow straaw straew straiw 
lawyer = lawyerr llawyer lewyer liwyer luwyer lawyor lowyer 
distance = distanse distansse distansce disttance distence distince distunce distanco distace 
solace = solase solasse solasce sollace solece solice soluce solaco 
climax = slimax sslimax sclimax cllimax climex climix climux climox 
extract = extrast extrasst extrasct extrract exttract extractt estract extrect extrict extruct 
text = ttext textt toxt teext texxt taxt tixt tenxt 
next = nextt noxt neext nnext nexxt naxt nixt nenxt 
affair = afair affairr effair affeir iffair affiir uffair affuir 
hair = hairr hiir huir hoir haair haeir haiir haoir 
chair = shair sshair schair chairr cheir chiir chuir 
embezzle = embezle embezzel embezzlle embeszle embezsle ombezzle embozzle embezzlo embbezzle eembezzle 
muzzle = muzle muzzel muzzlle muszle muzsle muzzlo muzzlee mmuzzle muuzzle 
assume = asume essume issume ussume assumo ossume aassume 
plume = pllume plumo plumee plumme pplume pluume plunme plumpe plrume 
flume = fllume flumo flumee fflume flumme fluume flunme flumpe flrume 
accessory = acessory accesory ascessory acsessory asscessory acssessory asccessory acscessory accessorry eccessory 
memory = memorry momory meemory mmemory memmory memoory memoryy memoery memowry 
anywhere = anywherre enywhere inywhere unywhere anywhore anywhero aywhere onywhere 
any = eny iny uny ay ony aany aeny 
many = meny miny muny mony maany maeny mainy 
expedite = expeditte espedite oxpedite expodite expedito expeddite eexpedite expeedite expeditee expediite 
unite = unitte unito uite unitee uniite unnite uunite uneite runite 
noel = nol noell nool noeel nnoel nooel nole noal 
poetic = potic poetis poetiss poetisc poettic pootic poeticc poeetic poetiic pooetic 
rotund = rrotund rottund rotud rotundd rotunnd rootund rotuund roetund 
halo = hallo helo hilo hulo holo haalo haelo 
until = untill unttil util untiil unntil uuntil unteil runtil 
unload = unlload unloed unloid unloud uload unlood unloaad 
unseen = unsen unsoen unseon unsee useen unseeen unnseen unseenn unsseen 
create = sreate ssreate screate crreate creatte creete creite creute croate creato 
creator = crator sreator ssreator screator crreator creatorr creattor creetor creitor creutor 
disinterested = disinterrested disintterested disinterestted disintorested disinterosted disinterestod disiterested ddisinterested disinterestedd disinteerested 
insinuate = insinuatte insinuete insinuite insinuute insinuato isinuate insiuate insinuote 
approval = aproval apprroval approvall epproval approvel ipproval approvil upproval approvul 
disapproval = disaproval disapprroval disapprovall disepproval disapprovel disipproval disapprovil disupproval disapprovul 
movingly = movinglly movigly movinggly moviingly mmovingly movinngly moovingly movvingly movinglyy 
immovable = imovable immovabel immovablle immoveble immovible immovuble immovablo immovoble 
obtain = obttain obtein obtiin obtuin obtai obtoin obtaain 
obscure = obssure obsssure obsscure obscurre obscuro obbscure obsccure obscuree oobscure 
hitherto = hitherrto hittherto hithertto hithorto hitheerto hhitherto hithherto hiitherto hithertoo 
to = tto te tou tuo tu taa tae tai 
hoping = hopig hopingg hhoping hopiing hopinng hoeping hopeing hopindg heping 
clothing = slothing sslothing sclothing cllothing clotthing clothig cclothing clothingg clothhing clothiing 
morbid = morrbid morbbid morbidd morbiid mmorbid moorbid moerbid morbeid mowrbid 
margin = mergin morgin marrgin mirgin murgin margi 
weevil = wevil weevill woevil weovil weeevil weeviil weevvil wweevil 
fleecy = flecy felecy fleesy fleessy fleescy flleecy floecy fleocy fleeccy fleeecy 
icy = isy issy iscy iccy iicy icyy eicy incy acy ecy 
address = adress addres addrress eddress iddress uddress addross oddress 
add = edd idd udd aadd aedd aidd aodd 
reflective = refelctive reflestive reflesstive reflesctive rreflective refllective reflecttive reflectif roflective refloctive 
executive = exesutive exessutive exescutive executtive esecutive executif oxecutive exocutive executivo execcutive 
terrible = terible terribel terrrible terriblle tterrible torrible terriblo terribble teerrible 
accessible = acessible accesible accessibel ascessible acsessible asscessible acssessible asccessible acscessible accessiblle 
thieves = theives tthieves thiefs thioves thievos thieeves thievees thhieves thiieves thievess 
fiend = feind fiond fied fiendd fieend ffiend fiiend fiennd feiend veiend 
field = feild fielld fiold fieldd fieeld ffield fiield feield veield 
shriek = shreik shrriek shriok shrieek shhriek shriiek shriekk sshriek shreiek 
guard = guerd guord guarrd guird guurd 
quantity = quanttity quantitty quentity quintity quuntity quatity quontity 
perforated = perrforated perforrated perforatted perforeted perforited perforuted porforated perforatod 
for = forr ffor foor foer fowr veor fonr fuor faar 
forbid = forrbid forbbid forbidd fforbid forbiid foorbid foerbid forbeid fowrbid 
usurp = usurrp usurpp ussurp uusurp usuurp ucurp uscurp usuwrp 
purple = purpel purrple purplle purplo purplee ppurple purpple puurple 
resolve = rresolve resollve resolf rosolve resolvo reesolve resolvee resoolve 
result = rresult resullt resultt rosult reesult ressult resuult 
cherub = sherub ssherub scherub cherrub cheub chorub cherubb ccherub cheerub chherub 
submit = submitt subbmit submiit submmit ssubmit suubmit submeit cubmit 
compose = sompose ssompose scompose comose composo ccompose composee commpose coompose compoose 
comprise = somprise ssomprise scomprise comprrise comrise compriso ccomprise comprisee compriise commprise 
passport = pasport passporrt passportt pessport pissport pussport possport 
dissect = disect dissest dissesst dissesct dissectt dissoct dissecct ddissect disseect diissect 
cinder = sinder ssinder scinder cinderr cindor ccinder cindder cindeer ciinder cinnder 
center = senter ssenter scenter centerr centter conter centor ceter ccenter ceenter 
cannot = canot sannot ssannot scannot cannott cennot cinnot cunnot 
banner = baner bannerr benner binner bunner bannor bonner 
alchemy = alshemy alsshemy alschemy allchemy elchemy ilchemy ulchemy alchomy 
metallic = metalic metallis metalliss metallisc metalllic mettallic metellic metillic metullic 
dishonest = dishonestt dishonost dishoest ddishonest dishoneest dishhonest diishonest dishonnest dishoonest disshonest 
currency = curency surrency currensy ssurrency currenssy scurrency currenscy currrency curroncy 
advantage = advanttage edvantage adventage advantege idvantage advintage advantige udvantage advuntage advantuge 
narrative = narative nerrative norrative narrrative narrattive narratif narretive nirrative 
attractive = atractive attrastive attrasstive attrasctive attrractive atttractive attracttive attractif ettractive 
orphanage = orrphanage orphenage orphanege orphinage orphanige orphunage orphanuge orphanago orphaage 
belief = beleif bellief bolief beliof bbelief beelief belieef belieff beliief 
relief = releif rrelief rellief rolief reliof reelief relieef relieff reliief 
believe = beleive bellieve bolieve beliove believo bbelieve beelieve belieeve believee beliieve 
relieve = releive rrelieve rellieve rolieve reliove relievo reelieve relieeve relievee reliieve 
unhappy = unhapy unheppy unhippy unhuppy uhappy unhoppy unhaappy 
unwilling = unwiling unwillling unwillig uwilling unwillingg unwiilling unwilliing 
opossum = oposum opossumm oopossum opoossum oppossum oposssum opossuum oepossum opoessum 
difficult = dificult diffisult diffissult diffiscult difficullt difficultt difficcult ddifficult diffficult 
difficulty = dificulty diffisulty diffissulty diffisculty difficullty difficultty difficculty ddifficulty diffficulty 
besiege = beseige bosiege besioge besiego bbesiege beesiege besieege besiegee besiegge besiiege 
besieged = beseiged bosieged besioged besiegod bbesieged besiegedd beesieged besieeged besiegeed besiegged 
cannibal = canibal sannibal ssannibal scannibal canniball cennibal cannibel cinnibal cannibil cunnibal 
animal = animall enimal animel inimal animil unimal animul aimal 
capital = sapital ssapital scapital capitall capittal cepital capitel cipital capitil cupital 
establish = establlish esttablish esteblish estiblish estublish ostablish estoblish 
recurring = recuring resurring ressurring rescurring rrecurring recurrring rocurring recurrig reccurring 
commuter = comuter sommuter ssommuter scommuter commuterr commutter commutor ccommuter commuteer commmuter 
community = comunity sommunity ssommunity scommunity communitty commuity ccommunity communiity commmunity 
grieve = greive grrieve griove grievo grieeve grievee ggrieve griieve grievve 
achieve = acheive ashieve asshieve aschieve achief echieve ichieve uchieve achiove achievo 
mackerel = maskerel masskerel masckerel mackerrel mackerell meckerel mickerel muckerel mackorel mackerol 
passenger = pasenger passengerr pessenger pissenger pussenger passonger passengor passeger 
caught = saught ssaught scaught caughtt ceught ciught cuught cought 
naughty = naughtty neughty niughty nuughty noughty naaughty naeughty 
daughter = daughterr daughtter deughter diughter duughter daughtor doughter 
retrieve = retreive rretrieve retrrieve rettrieve retrief rotrieve retriove retrievo reetrieve retrieeve 
relieve = releive rrelieve rellieve rolieve reliove relievo reelieve relieeve relievee reliieve 
believe = beleive bellieve bolieve beliove believo bbelieve beelieve belieeve believee beliieve 
unlucky = unlusky unlussky unluscky unllucky ulucky unluccky unluckky unnlucky uunlucky 
unhappy = unhapy unheppy unhippy unhuppy uhappy unhoppy unhaappy 
adjacent = adjasent adjassent adjascent adjacentt edjacent adjecent idjacent adjicent udjacent adjucent 
awaken = ewaken aweken iwaken awiken uwaken awuken awakon 
apparel = aparel apperel apporel apparrel apparell epparel ipparel appirel upparel 
tragedy = trragedy ttragedy tregedy trigedy trugedy tragody trogedy 
majesty = majestty mejesty mijesty mujesty majosty mojesty maajesty 
passable = pasable passabel passablle pessable passeble pissable passible pussable passuble passablo 
amass = amas emass amess imass umass amuss omass 
mass = maass maess maiss maoss mauss meass meess meiss meoss meuss 
brass = brrass bress briss bruss bross braass braess 
kangaroo = kangaro kangeroo kangoroo kangarroo kengaroo kingaroo kangiroo kungaroo kanguroo 
boundary = buondary bondary boundery boundory boundarry boundiry boundury boudary 
surgery = surrgery surgerry surgory surgeery surggery ssurgery suurgery surgeryy 
surly = surrly surlly ssurly suurly surlyy scurly suwrly 
immigrant = imigrant immigrrant immigrantt immigrent immigrint immigrunt immigrat immigront 
ministry = ministrry ministtry miistry miinistry miniistry mministry minnistry minisstry 
predecessor = predecesor predesessor predessessor predescessor prredecessor predecessorr prodecessor predocessor predecossor predeccessor 
decorator = desorator dessorator descorator decorrator decoratorr decorattor decoretor decoritor decorutor docorator 
memory = memorry momory meemory mmemory memmory memoory memoryy memoery memowry 
directory = direstory diresstory diresctory dirrectory directorry directtory diroctory direcctory ddirectory direectory 
civil = sivil ssivil scivil civill ccivil ciivil civiil civvil ceivil 
anvil = anvill envil invil unvil avil onvil aanvil 
disapprove = disaprove disapprrove disapprof disepprove disipprove disupprove disapprovo disopprove 
approval = aproval apprroval approvall epproval approvel ipproval approvil upproval approvul 
volcano = volsano volssano volscano vollcano volceno volcino volcuno volcao 
noel = nol noell nool noeel nnoel nooel nole noal 
cinnamon = cinamon sinnamon ssinnamon scinnamon cinnemon cinnimon cinnumon cinnamo 
collateral = colateral sollateral ssollateral scollateral collaterral colllateral collaterall collatteral colleteral 
intelligible = inteligible intelligibel intellligible intelligiblle inttelligible intolligible intelligiblo itelligible intelligibble 
eligible = eligibel elligible eligiblle oligible eligiblo eligibble eeligible eligiblee eliggible eliigible 
quandary = quandery quandory quandarry quendary quindary quandiry quundary quandury quadary 
quantity = quanttity quantitty quentity quintity quuntity quatity quontity 
classification = clasification classificatian slassification classifisation sslassification classifissation sclassification classifiscation cllassification classificattion 
recitation = recitatian resitation ressitation rescitation rrecitation recittation recitattion recitasion recitetion recitition 
destination = destinatian desttination destinattion destinasion destinetion destinition destinution dostination destiation destinatio 
bailiff = bailif bailliff beiliff biiliff builiff boiliff baailiff 
plaintiff = plaintif pllaintiff plainttiff pleintiff pliintiff pluintiff plaitiff plointiff 
laborer = laborrer laborerr llaborer leborer liborer luborer laboror loborer 
favor = favorr fevor fivor fuvor fovor faavor faevor 
flavor = flavorr fllavor flevor flivor fluvor flovor flaavor 
savor = savorr sevor sivor suvor sovor saavor saevor 
urge = urrge urgo urgee urgge uurge uwrge rurge urdge urga 
purse = purrse purso pursee ppurse pursse puurse purce pursce 
nurse = nurrse nurso nursee nnurse nursse nuurse nurce nursce 
spur = spurr sppur sspur spuur cpur scpur spuwr sprur 
satellite = satelite satelllite sattellite satellitte setellite sitellite sutellite satollite satellito 
anecdote = anesdote anessdote anescdote anecdotte enecdote inecdote unecdote anocdote anecdoto aecdote 
tragedy = trragedy ttragedy tregedy trigedy trugedy tragody trogedy 
majesty = majestty mejesty mijesty mujesty majosty mojesty maajesty 
priest = preist prriest priestt priost prieest priiest ppriest priesst 
fried = freid frried friod friedd frieed ffried friied freied fwried 
unlock = unlosk unlossk unlosck unllock ulock unlocck unlockk unnlock unloock 
unload = unlload unloed unloid unloud uload unlood unloaad 
product = produst produsst produsct prroduct productt producct prodduct prooduct pproduct 
callus = calus sallus ssallus scallus calllus cellus cillus cullus 
unfounded = unfuonded unfonded unfoundod ufounded unfouded unfoundded unfoundedd unfoundeed unffounded unnfounded 
narrate = narate nerrate norrate narrrate narratte narrete nirrate narrite 
narrow = narow nerrow norrow narrrow nirrow nurrow 
arrow = arow errow orrow arrrow irrow urrow 
marrow = marow merrow marrrow mirrow murrow 
tariff = tarif teriff toriff tarriff ttariff tiriff turiff 
mariner = meriner moriner marriner marinerr miriner muriner marinor marier 
capitalization = capitalizatian sapitalization ssapitalization scapitalization capitallization capittalization capitalizattion capitalizasion capitalisation cepitalization 
plantation = plantatian pllantation planttation plantattion plantasion plentation plantetion plintation plantition pluntation 
admissible = admisible admissibel admissiblle edmissible idmissible udmissible admissiblo odmissible 
possible = posible possibel possiblle possiblo possibble possiblee possiible poossible ppossible 
wrong = rong wrrong wrog wrongg wronng wroong wwrong wroeng 
wring = wrring wrig wringg wriing wrinng wwring wreing wrindg 
frostbitten = frostbiten frrostbitten frosttbitten frostbittten frostbitton frostbitte frostbbitten frostbitteen ffrostbitten 
fatten = faten fattten fetten fitten futten fatton fatte 
tweezers = twezers tweezerrs ttweezers tweesers twoezers tweozers tweezors tweeezers tweezeers 
weed = woed weod weedd weeed wweed waed wead wied weid 
weep = wep woep weop weeep weepp wweep waep weap wiep 
before = beforre bofore beforo bbefore beefore beforee beffore befoore befoere 
deplore = deplorre depllore doplore deploro ddeplore deeplore deploree deploore depplore 
explore = explorre expllore esplore oxplore exploro eexplore exploree exploore expplore 
attend = atend atttend ettend ittend uttend attond atted 
attack = atack attask attassk attasck atttack ettack atteck ittack attick 
profess = profes prrofess profoss profeess proffess proofess pprofess professs 
connect = conect sonnect connest ssonnect connesst sconnect connesct connectt connoct 
polite = pollite politte polito politee poliite poolite ppolite poelite 
scaffold = scafold ssaffold sssaffold sscaffold scaffolld sceffold sciffold scuffold 
egoism = ogoism eegoism eggoism egoiism egoismm egooism egoissm egoeism egoicm 
tuxedo = ttuxedo tuxodo tuxeddo tuxeedo tuxedoo tuuxedo tuxxedo tuxedoe truxedo 
knives = knifs knivos knivees kniives kknives knnives knivess knivves kneives knivec 
knee = kne knoe kneo kneee kknee knnee knae knea knie 
kneel = knel kneell knoel kneol kneeel kkneel knneel knele 
perusal = perrusal perusall peusal perusel perusil perusul porusal perusol 
frugal = frrugal frugall frugel frugil frugul frugol frugaal 
brutal = brrutal brutall bruttal butal brutel brutil brutul brutol 
truant = trruant ttruant truantt tuant truent truint truunt truat 
sweat = sweatt sweit sweut swoat sweot sweaat sweaet sweait 
sweater = swater sweaterr sweatter sweiter sweuter swoater sweator sweoter 
refuse = rrefuse rofuse refuso reefuse refusee reffuse refusse refuuse refuce 
infuse = infuso ifuse infusee inffuse iinfuse innfuse infusse infuuse einfuse infuce 
use = uso usee usse uuse uce usce uze usa usi 
used = usod usedd useed ussed uused uced usced rused uzed 
weasel = wasel weasell weesel weisel weusel woasel weasol weosel 
chisel = shisel sshisel schisel chisell chisol cchisel chiseel chhisel chiisel 
provide = prrovide provido providde providee proviide proovide pprovide provvide proevide 
produce = produse produsse produsce prroduce produco producce prodduce producee prooduce pproduce 
pronounce = pronuonce prononce pronounse pronounsse pronounsce prronounce pronounco proounce pronouce pronouncce 
show = shhow shoow sshow showw shoew schow zhow shonw shouw 
know = kknow knnow knoow knoww knoew knonw knouw knuow knaw kniw 
row = rrow roow roww roew wrow rew ronw rouw ruow 
tow = ttow toow toww toew tew tonw touw tuow taw 
knelt = knellt kneltt knolt kneelt kknelt knnelt knlet knalt 
knapsack = knapsask knapsassk knapsasck knepsack knapseck knipsack knapsick knupsack knapsuck 
knuckle = knuckel knuskle knusskle knusckle knucklle knucklo knucckle knucklee kknuckle knuckkle 
durable = durabel durrable durablle dureble durible duruble durablo duroble 
miracle = miracel mirasle mirassle mirascle mirracle miraclle mirecle miricle mirucle miraclo 
duchess = duches dushess dusshess duschess duchoss ducchess dduchess ducheess duchhess duchesss 
meanness = meaness meannes manness meenness meinness meunness moanness meannoss 
professor = profesor prrofessor professorr profossor profeessor proffessor proofessor professoor pprofessor 
profess = profes prrofess profoss profeess proffess proofess pprofess professs 
collate = colate sollate ssollate scollate colllate collatte collete collite collute 
commit = comit sommit ssommit scommit committ ccommit commiit commmit coommit 
commute = comute sommute ssommute scommute commutte commuto ccommute commutee commmute 
commune = comune sommune ssommune scommune communo commue ccommune communee commmune 
antiseptic = antiseptis antiseptiss antiseptisc anttiseptic antisepttic entiseptic intiseptic untiseptic antisoptic atiseptic 
solid = sollid solidd soliid soolid ssolid soelid soleid colid 
assist = asist assistt essist issist ussist ossist aassist 
canvass = sanvass ssanvass scanvass cenvass canvess cinvass canviss cunvass canvuss cavass 
merchandise = mershandise mersshandise merschandise merrchandise merchendise merchindise merchundise morchandise merchandiso merchadise 
merchant = mershant mersshant merschant merrchant merchantt merchent merchint merchunt morchant merchat 
leaven = laven elaven lleaven leafn leeven leiven leuven loaven leavon 
heavy = havy heevy heivy heuvy hoavy heovy heaavy 
junction = junctian junstion junsstion junsction juncttion juncsion junctio juction juncction junctiion 
action = actian astion asstion asction acttion acsion ection iction uction actio 
fraction = fractian frastion frasstion frasction frraction fracttion fracsion frection fruction fractio 
instrument = instrrument insttrument instrumentt instument instrumont instrumet istrument instrumeent iinstrument instrumment 
faculty = fasulty fassulty fasculty facullty facultty feculty ficulty fuculty 
blood = blod bllood bblood bloodd bloood bloeod blooed bleod 
flood = flod fllood floodd fflood floood floeod flooed velood 
bloodshed = blodshed blloodshed bloodshod bbloodshed blooddshed bloodshedd bloodsheed bloodshhed blooodshed 
birthright = birrthright birthrright birtthright birthrightt bbirthright birthrigght birthhright birthrighht biirthright birthriight 
circle = circel sircle cirsle ssircle cirssle scircle cirscle cirrcle circlle circlo 
coincident = soincident coinsident ssoincident coinssident scoincident coinscident coincidentt coincidont coincidet coicident 
accident = acident ascident acsident asscident acssident asccident acscident accidentt eccident iccident 
soundings = suondings sondings soundigs soudings sounddings soundinggs soundiings sounndings soundinngs sooundings 
is = iis iss eis ic isc iz os aas aes 
his = hhis hiis heis hic hisc hiz hins hus haas haes 
talkative = tallkative ttalkative talkattive talkatif telkative talketive tilkative talkitive tulkative talkutive 
talk = tallk ttalk telk tilk tulk tolk taalk 
commitment = comitment sommitment ssommitment scommitment committment commitmentt commitmont commitmet ccommitment commitmeent 
opponent = oponent opponentt opponont opponet oppoent opponeent opponnent opponennt oopponent oppoonent 
door = dor doorr ddoor dooor doeor dooer doowr deor 
doormat = dormat doorrmat doormatt doormet doormit doormut doormot 
floor = flor floorr flloor ffloor flooor floeor flooer 
cent = ssent centt cet ccent ceent cennt cint 
central = sentral ssentral scentral centrral centrall centtral centrel centril centrul contral 
niece = neice niese niesse niesce nioce nieco niecce nieece niecee niiece 
apiece = apeice apiese apiesse apiesce epiece ipiece upiece apioce apieco 
detrimental = detrrimental detrimentall dettrimental detrimenttal detrimentel detrimentil detrimentul dotrimental detrimontal detrimetal 
skeptical = skeptisal skeptissal skeptiscal skepticall skepttical skepticel skepticil skepticul skoptical 
coming = soming ssoming scoming comig ccoming comingg comiing comming cominng cooming 
discover = dissover disssover disscover discoverr discofr discovor disccover ddiscover discoveer diiscover 
conjugate = sonjugate ssonjugate sconjugate conjugatte conjugete conjugite conjugute conjugato cojugate 
modicum = modisum modissum modiscum modiccum moddicum modiicum mmodicum modicumm moodicum modicuum 
unacceptable = unaceptable unacceptabel unasceptable unacseptable unassceptable unacsseptable unascceptable unacsceptable unacceptablle unaccepttable 
miracle = miracel mirasle mirassle mirascle mirracle miraclle mirecle miricle mirucle miraclo 
discuss = dissuss disssuss disscuss disccuss ddiscuss diiscuss discusss discuuss 
distress = distres distrress disttress distross ddistress distreess diistress disstress distresss 
wilderness = wildernes wilderrness willderness wildorness wildernoss wildderness wildeerness wilderneess wiilderness 
witness = witnes wittness witeness witiness witnoss witneess wiitness witnness witnesss 
communicate = comunicate sommunicate communisate ssommunicate communissate scommunicate communiscate communicatte communicete communicite 
commune = comune sommune ssommune scommune communo commue ccommune communee commmune 
commute = comute sommute ssommute scommute commutte commuto ccommute commutee commmute 
hobby = hoby hobbby hhobby hoobby hobbyy hoebby hebby honbby houbby 
cobble = coble cobbel sobble ssobble scobble cobblle cobblo cobbble ccobble 
exotic = exotis exotiss exotisc exottic esotic oxotic exoticc eexotic exotiic exootic 
exactly = exastly exasstly exasctly exactlly exacttly esactly exectly exictly exuctly oxactly 
nourish = nuorish norish nourrish nourishh nouriish nnourish noourish nourissh nouurish 
flourish = fluorish florish flourrish fllourish fflourish flourishh flouriish floourish 
journal = juornal jornal jourrnal journall journel journil journul journol 
journey = juorney jorney jourrney journoy journeey jjourney journney joourney jouurney 
microcosm = misrocosm micrososm missrocosm microssosm miscrocosm microscosm micrrocosm miccrocosm microccosm miicrocosm 
democrat = demosrat demossrat demoscrat democrrat democratt democret democrit democrut domocrat 
demolish = demollish domolish ddemolish deemolish demolishh demoliish demmolish demoolish demolissh 
embody = ombody embbody emboddy eembody emmbody emboody embodyy emboedy enmbody empbody 
soup = suop sooup soupp ssoup souup soeup scoup sorup zoup 
group = gruop grop grroup ggroup grooup groupp grouup groeup gwroup 
grouping = gruoping grrouping groupig ggrouping groupingg groupiing groupinng groouping groupping 
acoustics = acuostics acostics asoustics acoustiss assoustics acoustisss ascoustics acoustiscs acousttics ecoustics 
seclude = seslude sesslude sesclude secllude soclude secludo secclude secludde seeclude secludee 
include = inslude insslude insclude incllude includo iclude incclude includde includee iinclude 
expansive = espansive expansif expinsive expunsive oxpansive expansivo expasive exponsive 
olive = ollive olif olivo olivee oliive oolive olivve oelive oleive 
involved = invollved involfd involvod ivolved involvedd involveed iinvolved innvolved invoolved 
solve = sollve solf solvo solvee soolve ssolve solvve soelve colve 
rule = ruel rrule rulle ule rulo rulee ruule wrule 
console = consoel sonsole ssonsole sconsole consolle consolo cosole cconsole consolee 
summary = sumary summory summarry summiry summury summaary summaery 
boundary = buondary bondary boundery boundory boundarry boundiry boundury boudary 
exude = esude oxude exudo exudde eexude exudee exuude exxude exrude axude 
recluse = resluse ressluse rescluse rrecluse reclluse rocluse recluso reccluse reecluse reclusee 
bustle = bustel bustlle busttle bustlo bbustle bustlee busstle buustle 
hustle = hustel hustlle husttle hustlo hustlee hhustle husstle huustle 
jostle = jostel jostlle josttle jostlo jostlee jjostle joostle josstle 
obsolete = obsoelte obsollete obsolette obsolote obsoleto obbsolete obsoleete obsoletee oobsolete 
absolute = absollute absolutte ebsolute ibsolute ubsolute absoluto obsolute 
dingy = digy ddingy dinggy diingy dinngy dingyy deingy dindgy dangy 
mangy = mengy mungy magy mongy maangy maengy maingy maongy 
you = yuo yoou youu yyou yoeu yoru yoa yeu yonu youn 
youth = yuoth yoth youtth youthh yoouth youuth yyouth yoeuth yoruth 
petulant = petullant pettulant petulantt petulent petulint petulunt potulant petulat 
asylum = asyllum esylum isylum usylum osylum aasylum aesylum 
journalist = juornalist jornalist jourrnalist journallist journalistt journelist journilist journulist 
journal = juornal jornal jourrnal journall journel journil journul journol 
wrestle = wrestel restle wrrestle wrestlle wresttle wrostle wrestlo wreestle wrestlee 
bustle = bustel bustlle busttle bustlo bbustle bustlee busstle buustle 
hustle = hustel hustlle husttle hustlo hustlee hhustle husstle huustle 
extricate = extrisate extrissate extriscate extrricate exttricate extricatte estricate extricete extricite extricute 
doctrine = dostrine dosstrine dosctrine doctrrine docttrine doctrino doctrie docctrine ddoctrine doctrinee 
heroic = herois heroiss heroisc herroic horoic heroicc heeroic hheroic heroiic herooic 
elastic = elastis elastiss elastisc ellastic elasttic elestic elistic elustic olastic 
speechless = spechless speechles speechelss speeshless speesshless speeschless speechlless spoechless speochless speechloss 
duchess = duches dushess dusshess duschess duchoss ducchess dduchess ducheess duchhess duchesss 
half = hallf helf hilf hulf holf haalf haelf 
calf = salf ssalf scalf callf celf cilf culf colf 
halfway = hallfway helfway halfwey hilfway halfwiy hulfway halfwuy 
written = writen ritten wrritten writtten writton writte writteen wriitten writtenn 
wring = wrring wrig wringg wriing wrinng wwring wreing wrindg 
concurrent = concurent soncurrent consurrent ssoncurrent conssurrent sconcurrent conscurrent concurrrent concurrentt 
contain = sontain ssontain scontain conttain contein contiin contuin contai cotain 
effigy = efigy offigy eeffigy efffigy effiggy effiigy effigyy effeigy evefigy 
affects = afects affests affessts affescts affectts iffects uffects affocts offects 
off = offf ooff oeff ovef ofve onff ouff uoff aff 
afford = aford afforrd efford ifford ufford offord aafford 
compensate = sompensate ssompensate scompensate compensatte comensate compensete compensite compensute componsate compensato 
ripen = rripen ripon ripeen riipen ripenn rippen reipen wripen ripan 
cedar = cedor sedar ssedar scedar cedarr cedir cedur codar 
boundary = buondary bondary boundery boundory boundarry boundiry boundury boudary 
unkind = unkid ukind unkindd unkiind unkkind unnkind unkinnd uunkind unkeind runkind 
unseen = unsen unsoen unseon unsee useen unseeen unnseen unseenn unsseen 
touch = tuoch toch toush toussh tousch ttouch toucch touchh toouch 
double = duoble doble doubel doublle doublo doubble ddouble doublee doouble 
trouble = truoble troble troubel trrouble troublle ttrouble troublo troubble troublee 
young = yuong yong youg youngg younng yooung youung yyoung yoeung yorung 
fruit = frruit fruitt fuit ffruit fruiit fruuit frueit fwruit 
suit = suitt suiit ssuit suuit sueit cuit scuit sruit 
recruit = resruit ressruit rescruit rrecruit recrruit recruitt recuit rocruit reccruit reecruit 
dynasty = dynastty dynesty dynisty dynusty dynosty dynaasty dynaesty 
cycle = cycel sycle cysle ssycle cyssle scycle cyscle cyclle cyclo ccycle 
seminary = seminery seminory seminarry seminiry seminury sominary semiary 
solitary = solitery solitory solitarry sollitary solittary solitiry solitury 
guest = guestt guost gueest gguest guesst guuest guect guesct 
quest = questt quost queest qquest quesst quuest quect quesct 
epitaph = epittaph epiteph epitiph epituph opitaph epitoph epitaaph 
deficit = defisit defissit defiscit deficitt doficit deficcit ddeficit deeficit defficit defiicit 
edify = odify eddify eedify ediffy ediify edifyy edeify edivey adify idify 
verify = verrify frify vorify veerify veriffy veriify vverify verifyy vereify 
fasten = fastten festen fisten fusten faston faste fosten 
glisten = gllisten glistten gliston gliste glisteen gglisten gliisten glistenn glissten 
imaginary = imaginery imaginory imaginarry imeginary imiginary imaginiry imuginary imaginury imagiary 
invalid = invallid invelid invilid invulid ivalid involid invaalid 
family = familly femily fimily fumily fomily faamily faemily 
gravity = grravity gravitty grevity grivity gruvity grovity graavity 
country = cuontry contry sountry ssountry scountry countrry counttry coutry ccountry counntry 
couple = cuople cople coupel souple ssouple scouple couplle couplo ccouple couplee 
request = rrequest requestt roquest requost reequest requeest reqquest requesst 
quest = questt quost queest qquest quesst quuest quect quesct 
guest = guestt guost gueest gguest guesst guuest guect guesct 
disposition = dispositian disposittion disposision dispositio ddisposition diisposition disposiition dispositiion dispositionn dispoosition 
customary = customery customory sustomary ssustomary scustomary customarry custtomary customiry customury 
custody = sustody ssustody scustody custtody ccustody custoddy custoody cusstody cuustody 
positive = posittive positif positivo positivee posiitive positiive poositive ppositive possitive 
nominate = nominatte nominete nominite nominute nominato nomiate nominote 
necessary = necesary necessery necessory nesessary nessessary nescessary necessarry necessiry necessury 
remedy = rremedy romedy remody remeddy reemedy remeedy remmedy remedyy wremedy 
unusual = unusuall unusuel unusuil unusuul uusual unusuol unusuaal 
petulant = petullant pettulant petulantt petulent petulint petulunt potulant petulat 
kindness = kindnes kindnoss kidness kinddness kindneess kiindness kkindness kinndness kindnness kindnesss 
meanness = meaness meannes manness meenness meinness meunness moanness meannoss 
education = educatian edusation edussation eduscation educattion educasion educetion educition educution oducation 
salvation = salvatian sallvation salvattion salvasion selvation salvetion silvation salvition sulvation salvution 
elephant = eelphant ellephant elephantt elephent elephint elephunt olephant elophant elephat 
relevant = reelvant rrelevant rellevant relevantt relevent relevint relevunt rolevant relovant relevat 
element = eelment ellement elementt olement eloment elemont elemet eelement eleement elemeent 
enemy = onemy enomy eemy eenemy eneemy enemmy ennemy enemyy enenmy enempy 
pantomime = panttomime pentomime pintomime puntomime pantomimo patomime pontomime 
atom = attom etom itom utom otom aatom aetom 
rough = ruogh rogh rrough rouggh roughh roough rouugh roeugh wrough 
tough = tuogh togh ttough touggh toughh toough touugh toeugh torugh 
enough = enuogh enogh onough eough eenough enouggh enoughh ennough enoough enouugh 
comfort = somfort ssomfort scomfort comforrt comfortt ccomfort comffort commfort coomfort comfoort 
coming = soming ssoming scoming comig ccoming comingg comiing comming cominng cooming 
bondage = bondege bondige bonduge bondago bodage bondoge bondaage 
hostage = hosttage hostege hostige hostuge hostago hostoge hostaage 
beverage = beverrage befrage beverege beverige beveruge boverage bevorage beverago 
pillage = pilage pilllage pillege pillige pilluge pillago pilloge 
heart = heert heort hearrt heartt heirt heurt hoart 
hearty = harty heerty heorty hearrty heartty heirty heurty hoarty 
judge = juge judgo juddge judgee judgge jjudge juudge jrudge judga 
brimstone = brrimstone brimsttone brimstono brimstoe bbrimstone brimstonee briimstone brimmstone brimstonne brimstoone 
pancake = pansake panssake panscake pencake panceke pincake pancike puncake pancuke pancako 
circus = sircus cirsus ssircus cirssus scircus cirscus cirrcus ccircus circcus ciircus 
focus = fosus fossus foscus foccus ffocus foocus focuss focuus foecus focuc 
locust = losust lossust loscust llocust locustt loccust loocust locusst 
insoluble = insolubel insolluble insolublle insolublo isoluble insolubble insolublee iinsoluble 
bramble = brambel brramble bramblle bremble brimble brumble bramblo bromble 
cousin = cuosin cosin sousin ssousin scousin cousi ccousin cousiin cousinn coousin 
country = cuontry contry sountry ssountry scountry countrry counttry coutry ccountry counntry 
practice = prastice practise prasstice practisse prasctice practisce prractice practtice prectice prictice 
gratitude = grratitude grattitude gratittude gretitude grititude grutitude gratitudo grotitude 
mountain = muontain montain mounttain mountein mountiin mountuin mountai moutain 
fountain = fuontain fontain founttain fountein fountiin fountuin fountai foutain 
because = besause bessause bescause beceuse beciuse becuuse bocause becauso 
claus = slaus sslaus sclaus cllaus cleus clius cluus clous 
institution = institutian insttitution instittution instituttion institusion istitution institutio iinstitution instiitution institutiion 
salvation = salvatian sallvation salvattion salvasion selvation salvetion silvation salvition sulvation salvution 
kerosene = kerrosene korosene kerosone keroseno kerosee keerosene keroseene kerosenee kkerosene kerosenne 
desolate = desollate desolatte desolete desolite desolute dosolate desolato desolote 
boycott = boycot boysott boyssott boyscott boycottt bboycott boyccott booycott boycoott 
mitt = mit mittt miitt mmitt meitt nmitt 
bitter = bitterr bittter bittor bbitter bitteer biitter 
fritter = friter frritter fritterr frittter frittor fritteer ffritter friitter 
violence = vialence vioelnce violense violensse violensce viollence violonce violenco violece violencce 
polite = pollite politte polito politee poliite poolite ppolite poelite 
reptile = reptiel rreptile reptille repttile roptile reptilo reeptile reptilee reptiile 
cajole = cajoel sajole ssajole scajole cajolle cejole cijole cujole cajolo 
injury = injurry ijury iinjury injjury innjury injuury injuryy einjury injuwry 
century = sentury ssentury scentury centurry centtury contury cetury ccentury ceentury cenntury 
chimney = shimney sshimney schimney chimnoy cchimney chimneey chhimney chiimney chimmney chimnney 
kidney = kidnoy kiddney kidneey kiidney kkidney kidnney kidneyy keidney kidnay kidniy 
occasion = ocasion occasian oscasion ocsasion osscasion ocssasion osccasion ocscasion occesion occision 
pollution = polution pollutian polllution polluttion pollusion pollutio pollutiion 
portrait = porrtrait portrrait porttrait portraitt portreit portriit portruit portroit 
curtain = surtain ssurtain scurtain currtain curttain curtein curtiin curtuin curtai 
devour = devuor devor devourr dovour ddevour deevour devoour devouur devvour 
our = uor ourr oour ouur oeur ouwr orur eur onur 
sour = suor sor sourr soour ssour souur soeur cour 
flour = fluor flor flourr fllour fflour floour flouur floeur 
forage = forrage forege forige foruge forago foroge foraage 
orange = orrange orenge oringe orunge orango orage oronge 
storage = storrage sttorage storege storige storuge storago storoge 
domesticate = domestisate domestissate domestiscate domestticate domesticatte domesticete domesticite domesticute domosticate domesticato 
desolate = desollate desolatte desolete desolite desolute dosolate desolato desolote 
nature = naturre natture neture niture nuture naturo noture 
picture = pisture pissture piscture picturre pictture picturo piccture picturee piicture ppicture 
creature = crature sreature ssreature screature crreature creaturre creatture creeture creiture creuture 
feature = fature featurre featture feeture feiture feuture foature featuro 
novice = novise novisse novisce novico novicce novicee noviice nnovice noovice novvice 
lattice = latice lattise lattisse lattisce llattice latttice lettice littice luttice 
athlete = athelte athllete atthlete athlette ethlete ithlete uthlete athlote athleto 
vote = votte voto votee voote vvote voete vota voti vete 
note = notte noto notee nnote noote noete nota noti nete 
notes = nottes notos notees nnotes nootes notess noetes notec 
cancellation = cancelation cancellatian sancellation cansellation ssancellation canssellation scancellation canscellation cancelllation 
plantation = plantatian pllantation planttation plantattion plantasion plentation plantetion plintation plantition pluntation 
adventure = adventurre adventture adfnture edventure idventure udventure advonture adventuro adveture 
century = sentury ssentury scentury centurry centtury contury cetury ccentury ceentury cenntury 
horrid = horid horrrid horridd hhorrid horriid hoorrid hoerrid 
humid = humidd hhumid humiid hummid huumid humeid hunmid humpid hrumid hamid 
begrudge = begrrudge begudge begruge bogrudge begrudgo bbegrudge begruddge beegrudge begrudgee beggrudge 
badge = bage bedge bidge badgo baadge baedge baidge baodge 
bridge = brridge brige bridgo bbridge briddge bridgee bridgge briidge breidge 
otherwise = otherrwise ottherwise othorwise otherwiso otheerwise otherwisee othherwise otherwiise ootherwise 
another = anotherr anotther enother inother unother anothor aother onother 
nucleus = nucelus nusleus nussleus nuscleus nuclleus nuclous nuccleus nucleeus nnucleus 
cactus = sactus castus ssactus casstus scactus casctus cacttus cectus cictus cuctus 
locust = losust lossust loscust llocust locustt loccust loocust locusst 
focus = fosus fossus foscus foccus ffocus foocus focuss focuus foecus focuc 
unable = unabel unablle uneble unible unuble unablo uable unoble 
modicum = modisum modissum modiscum modiccum moddicum modiicum mmodicum modicumm moodicum modicuum 
oneself = onesellf onoself onesolf oeself oneeself oneseelf oneselff onneself ooneself 
line = lline linee liine linne leine lina lini 
fine = fino finee ffine fiine finne feine veine fina fini finen 
nine = nino nie ninee niine nnine ninne neine nina nini ninen 
clearance = clarance celarance cleerance cleorance slearance clearanse sslearance clearansse sclearance clearansce 
clear = clar celar cleer cleor slear sslear sclear clearr cllear 
torture = torrture torturre ttorture tortture torturo torturee toorture 
saturate = saturrate satturate saturatte seturate saturete siturate saturite suturate saturute saturato 
gesture = gesturre gestture gosture gesturo geesture gesturee ggesture gessture 
lecture = elcture lesture lessture lescture lecturre llecture lectture locture lecturo leccture 
villain = vilain villlain villiin villuin villai villoin villaain 
certain = sertain ssertain scertain cerrtain certtain certein certiin certuin cortain certai 
mountain = muontain montain mounttain mountein mountiin mountuin mountai moutain 
fountain = fuontain fontain founttain fountein fountiin fountuin fountai foutain 
presage = prresage presege presige presuge prosage presago presoge 
cottage = cotage sottage ssottage scottage cotttage cottege cottige cottuge cottago 
crevice = srevice crevise ssrevice crevisse screvice crevisce crrevice crovice crevico ccrevice 
practice = prastice practise prasstice practisse prasctice practisce prractice practtice prectice prictice 
precipice = presipice precipise pressipice precipisse prescipice precipisce prrecipice procipice precipico preccipice 
possessive = posessive possesive possessif possossive possessivo posseessive possessivee possessiive poossessive ppossessive 
community = comunity sommunity ssommunity scommunity communitty commuity ccommunity communiity commmunity 
recover = resover ressover rescover rrecover recoverr recofr rocover recovor reccover reecover 
among = emong imong umong amog omong aamong aemong 
blossom = blosom bllossom bblossom blossomm bloossom blossoom blosssom bloessom 
fathom = fatthom fethom fithom futhom fothom faathom faethom 
myth = mytth mythh mmyth myyth nmyth mpyth 
mythical = mythisal mythissal mythiscal mythicall mytthical mythicel mythicil mythicul 
lyric = lyris lyriss lyrisc lyrric llyric lyricc lyriic lyyric 
cylinder = sylinder ssylinder scylinder cylinderr cyllinder cylindor cylider ccylinder cylindder cylindeer 
brotherhood = brotherhod brrotherhood brotherrhood brottherhood brothorhood bbrotherhood brotherhoodd brotheerhood brothherhood brotherhhood 
other = otherr otther othor otheer othher oother oether othar 
brother = brrother brotherr brotther brothor bbrother brotheer brothher broother 
buffalo = bufalo buffallo buffelo buffilo buffulo buffolo buffaalo 
ruffle = rufle ruffel rruffle rufflle uffle rufflo rufflee rufffle 
shuffle = shufle shuffel shufflle shufflo shufflee shufffle shhuffle sshuffle 
fulcrum = fulsrum fulssrum fulscrum fulcrrum fullcrum fulcum fulccrum ffulcrum fulcrumm 
cherub = sherub ssherub scherub cherrub cheub chorub cherubb ccherub cheerub chherub 
indicate = indisate indissate indiscate indicatte indicete indicite indicute indicato idicate 
fabricate = fabrisate fabrissate fabriscate fabrricate fabricatte febricate fabricete fibricate fabricite fubricate 
preceding = preseding presseding presceding prreceding proceding precoding precedig precceding precedding preeceding 
prepay = prrepay prepey prepiy prepuy propay prepoy prepaay 
organize = orrganize organise orgenize orginize orgunize organizo orgaize orgonize 
breeze = breze brreeze breese broeze breoze breezo bbreeze breeeze breezee 
freeze = freze frreeze freese froeze freoze freezo freeeze freezee ffreeze 
crowd = srowd ssrowd scrowd crrowd ccrowd crowdd croowd crowwd croewd 
powder = powderr powdor powdder powdeer poowder ppowder powwder poewder powdar 
appear = apear appar appeer appeor appearr eppear ippear appeir uppear 
disappear = disapear disappar disappeer disappeor disappearr diseppear disippear disappeir disuppear 
supper = supperr suppor suppeer suppper ssupper suupper suppar 
slippery = slipery slipperry sllippery slippory slippeery sliippery slipppery 
copper = coper sopper ssopper scopper copperr coppor ccopper coppeer coopper coppper 
agile = agiel agille egile igile ugile agilo ogile 
fragile = fragiel frragile fragille fregile frigile frugile fragilo frogile 
mystery = mysterry mysttery mystory mysteery mmystery mysstery myystery mysteryy 
gypsy = ggypsy gyppsy gypssy gyypsy gypsyy gypcy gypscy dgypsy gypzy 
syntax = synttax syntex syntix syntux syntox syntaax syntaex 
syrup = syrrup syup syrupp ssyrup syruup syyrup cyrup scyrup 
cyst = syst ssyst scyst cystt ccyst cysst cyyst cyct 
system = systtem systom systeem systemm ssystem sysstem syystem cystem syctem 
angle = anglle engle ingle ungle anglo agle ongle 
uncle = uncel unsle unssle unscle unclle unclo ucle unccle unclee 
distinct = distinst distinsst distinsct disttinct distinctt distict distincct ddistinct diistinct distiinct 
angry = angrry engry ingry ungry agry ongry aangry 
remove = rremove remof romove removo reemove removee remmove remoove removve 
approve = aprove apprrove approf epprove ipprove upprove approvo opprove 
surrender = surender surrrender surrenderr surronder surrendor surreder surrendder surreender surrendeer 
century = sentury ssentury scentury centurry centtury contury cetury ccentury ceentury cenntury 
nothing = notthing nothig nothingg nothhing nothiing nnothing nothinng noothing noething 
dozen = dosen dozon ddozen dozeen dozenn doozen dozzen doezen dozan dozin 
covet = sovet ssovet scovet covett coft covot ccovet coveet coovet 
typify = ttypify typiffy typiify typpify tyypify typifyy typeify typivey typinfy 
cylinder = sylinder ssylinder scylinder cylinderr cyllinder cylindor cylider ccylinder cylindder cylindeer 
nymph = nymh nymphh nymmph nnymph nympph nyymph nynmph 
lymph = llymph lymh lymphh lymmph lympph lyymph lynmph 
disappeared = disapeared disappared disappeered disappeored disappearred diseppeared disippeared disappeired disuppeared 
disappear = disapear disappar disappeer disappeor disappearr diseppear disippear disappeir disuppear 
apply = aply applly epply ipply upply opply aapply 
fly = flly ffly flyy vely 
occasionally = ocasionally occasionaly occasianally oscasionally ocsasionally osscasionally ocssasionally osccasionally ocscasionally occasionallly 
occasion = ocasion occasian oscasion ocsasion osscasion ocssasion osccasion ocscasion occesion occision 
contemporary = contemporery contemporory sontemporary ssontemporary scontemporary contemporrary contemporarry conttemporary contemorary 
ebony = obony eboy ebbony eebony ebonny eboony ebonyy eboeny abony ibony 
felony = fellony folony feloy feelony ffelony felonny feloony felonyy feloeny 
movement = movementt mofment movoment movemont movemet moveement movemeent mmovement movemment movemennt 
move = mof movo movee mmove moove movve moeve nmove mpove mova 
prove = prrove provo provee proove pprove provve proeve pwrove prova 
summon = sumon summo summmon summonn summoon ssummon suummon summoen cummon 
siphon = sipho siphhon siiphon siphonn siphoon sipphon ssiphon siphoen seiphon ciphon 
quail = quaill queil quiil quuil quoil quaail quaeil 
quaint = quaintt queint quiint quuint quait quoint quaaint 
symphony = symhony symphoy symphhony symmphony symphonny symphoony sympphony ssymphony syymphony symphonyy 
nymph = nymh nymphh nymmph nnymph nympph nyymph nynmph 
fearless = fearles farless fearelss feerless feorless fearrless fearlless feirless feurless 
clear = clar celar cleer cleor slear sslear sclear clearr cllear 
dear = dar deor dearr deir deur doar deaar 
beard = beerd beord bearrd beird beurd 
sterile = steriel sterrile sterille stterile storile sterilo steerile sterilee steriile 
agile = agiel agille egile igile ugile agilo ogile 
fragile = fragiel frragile fragille fregile frigile frugile fragilo frogile 
physical = physisal physissal physiscal physicall physicel physicil physicul physicol 
cylinder = sylinder ssylinder scylinder cylinderr cyllinder cylindor cylider ccylinder cylindder cylindeer 
equipping = equiping oquipping equippig eequipping equippingg equiipping equippiing equippinng equippping 
quit = quitt quiit qquit quuit queit qruit qait qunit quat 
quilt = quillt quiltt quiilt qquilt quuilt queilt qruilt qailt 
annual = anual annuall ennual annuel innual annuil unnual annuul 
banner = baner bannerr benner binner bunner bannor bonner 
typhus = ttyphus typhhus typphus typhuss typhuus tyyphus typhuc typhusc 
cactus = sactus castus ssactus casstus scactus casctus cacttus cectus cictus cuctus 
service = servise servisse servisce serrvice sorvice servico servicce seervice servicee serviice 
novice = novise novisse novisce novico novicce novicee noviice nnovice noovice novvice 
diagnosis = diegnosis diignosis diugnosis diognosis diaagnosis diaegnosis diaignosis 
emphasis = emhasis emphesis emphisis emphusis omphasis emphosis emphaasis 
hyphen = hyphon hyphe hypheen hhyphen hyphhen hyphenn hypphen hyyphen hyphan hyphin 
hybrid = hybrrid hybbrid hybridd hhybrid hybriid hyybrid hybreid hybwrid hybrind 
motley = motely motlley mottley motloy motleey mmotley mootley motleyy 
chimney = shimney sshimney schimney chimnoy cchimney chimneey chhimney chiimney chimmney chimnney 
squirm = squirrm squiirm squirmm sqquirm ssquirm squuirm squeirm cquirm 
squirt = squirrt squirtt squiirt sqquirt ssquirt squuirt squeirt cquirt 
menthol = mentholl mentthol monthol methol meenthol menthhol mmenthol mennthol menthool 
forget = forrget forgett forgeet fforget forgget foorget foerget fowrget 
mercury = mersury merssury merscury merrcury mercurry morcury merccury meercury mmercury 
term = terrm tterm torm teerm termm tarm tewrm 
her = herr hor heer hher har hewr hir 
herb = herrb horb herbb heerb hherb harb hewrb 
supreme = suprreme suprome supreeme supremee supremme suppreme ssupreme suupreme cupreme 
upon = upo uponn upoon uppon uupon upoen rupon apon upen 
lozenge = llozenge losenge lozonge lozengo lozege lozeenge lozengee lozengge lozennge 
brazen = brrazen brasen brezen brizen bruzen brazon brozen 
tour = tuor tourr ttour toour touur toeur touwr torur 
tourist = tuorist torist tourrist ttourist touristt touriist toourist tourisst 
terrific = terific terrifis terrifiss terrifisc terrrific tterrific torrific terrificc teerrific 
horrific = horific horrifis horrifiss horrifisc horrrific horrificc horriffic hhorrific horriific 
galley = galey galely gallley gelley gilley gulley galloy 
pulley = puley pulely pullley pulloy pulleey ppulley puulley 
do = ddo doo de dou da di du daa dae 
to = tto te tou tuo tu taa tae tai 
furniture = furrniture furniturre furnitture furnituro furnituree ffurniture furniiture furnniture 
saturate = saturrate satturate saturatte seturate saturete siturate saturite suturate saturute saturato 
debt = debtt dobt debbt ddebt deebt dabt dibt denbt 
debtor = debtorr debttor dobtor debbtor ddebtor deebtor debtoor debtoer 
common = comon sommon ssommon scommon commo ccommon commmon commonn coommon 
summon = sumon summo summmon summonn summoon ssummon suummon summoen cummon 
mispronounce = mispronuonce misprononce mispronounse mispronounsse mispronounsce misprronounce mispronounco misproounce mispronouce mispronouncce 
pronounce = pronuonce prononce pronounse pronounsse pronounsce prronounce pronounco proounce pronouce pronouncce 
should = shuold shold shoulld shouldd shhould shoould sshould shouuld shoeuld 
could = cuold sould ssould scould coulld ccould couldd coould couuld 
would = wuold woulld wouldd woould wouuld wwould woeuld woruld woald 
insecure = insesure insessure insescure insecurre insocure insecuro isecure inseccure inseecure insecuree 
eclipse = eslipse esslipse esclipse ecllipse oclipse eclipso ecclipse eeclipse eclipsee ecliipse 
inaugural = inaugurral inaugurall ineugural inaugurel iniugural inauguril inuugural inaugurul iaugural 
audit = auditt eudit iudit uudit oudit aaudit aeudit 
aunt = auntt eunt iunt uunt aut ount aaunt 
taunt = ttaunt tauntt teunt tiunt tuunt tount taaunt 
there = therre tthere thore thero theere theree thhere thare 
where = wherre whero wheere wheree whhere wwhere whare whewre 
connive = conive sonnive ssonnive sconnive connif connivo cconnive connivee conniive 
compute = sompute ssompute scompute computte comute computo ccompute computee commpute coompute 
extinct = extinst extinsst extinsct exttinct extinctt estinct oxtinct extict extincct eextinct 
uncle = uncel unsle unssle unscle unclle unclo ucle unccle unclee 
annoy = anoy ennoy innoy unnoy onnoy aannoy 
inner = iner innerr innor inneer iinner innner einner 
dinner = dinnerr dinnor ddinner dinneer diinner dinnner deinner dinnar 
famous = famuos famos femous fimous fumous fomous faamous 
fibrous = fibruos fibros fibrrous fibbrous ffibrous fiibrous fibroous fibrouss fibrouus 
raucous = raucuos raucos rausous raussous rauscous rraucous reucous riucous ruucous 
jealous = jalous jealuos jealos jeallous jeelous jeilous jeulous joalous 
parent = perent porent parrent parentt pirent purent paront paret 
transparent = transperent transporent trransparent transparrent ttransparent transparentt trensparent trinsparent transpirent 
pollute = polute polllute pollutte polluto pollutee poollute ppollute 
collate = colate sollate ssollate scollate colllate collatte collete collite collute 
employment = emplloyment employmentt emloyment omployment employmont employmet eemployment employmeent emmployment 
element = eelment ellement elementt olement eloment elemont elemet eelement eleement elemeent 
resident = rresident residentt rosident residont residet residdent reesident resideent resiident residennt 
decrepit = desrepit dessrepit descrepit decrrepit decrepitt docrepit decropit deccrepit ddecrepit deecrepit 
oblige = obllige obligo obblige obligee obligge obliige ooblige oeblige obleige 
obtain = obttain obtein obtiin obtuin obtai obtoin obtaain 
cabbage = cabage sabbage ssabbage scabbage cebbage cabbege cibbage cabbige cubbage cabbuge 
rabble = rable rabbel rrabble rabblle rebble ribble rabblo robble 
scrabble = scrable scrabbel ssrabble sssrabble sscrabble scrrabble scrabblle screbble scrubble scrabblo 
schism = sshism ssshism sschism scchism schhism schiism schismm schissm scheism 
school = schol sshool ssshool sschool schooll scchool schhool schoool 
schooner = schoner sshooner ssshooner sschooner schoonerr schoonor schooer scchooner schooneer schhooner 
amorous = amoruos amoros amorrous emorous imorous umorous omorous 
rigorous = rigoruos rigoros rrigorous rigorrous riggorous riigorous rigoorous rigoroous 
quench = quensh quenssh quensch quonch quech quencch queench quenchh quennch qquench 
quest = questt quost queest qquest quesst quuest quect quesct 
garbage = gerbage gorbage garrbage garbege girbage garbige gurbage garbuge garbago 
mileage = milage mielage milleage mileege mileige mileuge miloage mileago 
pompous = pompuos pompos pomous pommpous poompous pompoous ppompous pomppous pompouss pompouus 
zealous = zalous zealuos zealos zeallous sealous zeelous zeilous zeulous zoalous 
chaos = shaos sshaos schaos cheos chios chuos choos 
chemist = shemist sshemist schemist chemistt chomist cchemist cheemist chhemist chemiist chemmist 
texture = texturre ttexture textture testure toxture texturo teexture texturee 
adventure = adventurre adventture adfnture edventure idventure udventure advonture adventuro adveture 
illiterate = iliterate illiterrate illliterate illitterate illiteratte illiterete illiterite illiterute illitorate 
frigate = frrigate frigatte frigete frigite frigute frigato frigote 
source = suorce sorce sourse soursse soursce sourrce sourco sourcce sourcee soource 
four = fuor fourr ffour foour fouur foeur fouwr forur veour 
therefore = therrefore thereforre ttherefore thorefore therofore thereforo theerefore thereefore thereforee thereffore 
there = therre tthere thore thero theere theree thhere thare 
paragraph = peragraph poragraph parragraph paragrraph paregraph paragreph piragraph parigraph paragriph 
embarrass = embarass embarras emberrass emborrass embarrrass embarress embirrass embarriss 
yearn = yeern yeorn yearrn yeirn yeurn yoarn 
earnest = arnest eernest eornest earrnest earnestt eirnest eurnest oarnest earnost 
earn = arn eern eorn earrn eirn eurn oarn 
learn = larn elarn leern leorn learrn llearn leirn leurn loarn 
whole = whoel wholle wholo wholee whhole whoole wwhole whoele whola 
wholesale = whoelsale wholesael whollesale wholesalle wholesele wholesile wholesule wholosale wholesalo 
dolphin = dollphin dolphi ddolphin dolphhin dolphiin dolphinn doolphin dolpphin doelphin 
bulletin = buletin buleltin bullletin bullettin bullotin bulleti bbulletin bulleetin bulletiin 
maintenance = maintenanse maintenansse maintenansce mainttenance meintenance maintenence miintenance maintenince muintenance maintenunce 
delegate = deelgate dellegate delegatte delegete delegite delegute dolegate delogate delegato 
relevant = reelvant rrelevant rellevant relevantt relevent relevint relevunt rolevant relovant relevat 
wondrous = wondruos wondros wondrrous wodrous wonddrous wonndrous woondrous wondroous wondrouss 
fibrous = fibruos fibros fibrrous fibbrous ffibrous fiibrous fibroous fibrouss fibrouus 
egg = eg ogg eegg eggg edgg egdg agg igg engg 
foggy = ffoggy fogggy fooggy foggyy foeggy veoggy fodggy fogdgy feggy 
craggy = cragy sraggy ssraggy crraggy creggy criggy cruggy croggy 
enormous = enormuos enormos enorrmous onormous eormous eenormous enormmous ennormous enoormous enormoous 
famous = famuos famos femous fimous fumous fomous faamous 
governor = goverrnor governorr gofrnor govornor goveernor ggovernor governnor goovernor governoor 
monk = mok monkk mmonk monnk moonk moenk nmonk mponk menk 
wholesome = whoelsome whollesome wholosome wholesomo wholeesome wholesomee whholesome wholesomme whoolesome 
whole = whoel wholle wholo wholee whhole whoole wwhole whoele whola 
wholesale = whoelsale wholesael whollesale wholesalle wholesele wholesile wholesule wholosale wholesalo 
hoarse = hoerse hoorse hoarrse hoirse hourse hoarso 
coarse = coerse coorse soarse ssoarse scoarse coarrse coirse coarso 
recently = resently ressently rescently rrecently recentlly recenttly rocently recontly recetly reccently 
eleven = eelven elleven elefn oleven eloven elevon eleve eeleven eleeven eleveen 
recess = reces resess ressess rescess rrecess rocess recoss reccess reecess receess 
december = desember dessember descember decemberr docember decomber decembor decembber deccember ddecember 
understood = understod underrstood understtood undorstood uderstood undderstood understoodd undeerstood unnderstood understoood 
roof = rof rroof rooff rooof roeof rooef wroof roove 
foot = fot foott ffoot fooot foeot fooet veoot feot 
good = goodd ggood goood goeod gooed dgood geod goed gonod 
southern = suothern sothern southerrn soutthern southorn southeern southhern southernn soouthern 
double = duoble doble doubel doublle doublo doubble ddouble doublee doouble 
portion = portian porrtion porttion porsion portio portiion portionn poortion portioon pportion 
operation = operatian operration operattion operasion operetion operition operution oporation operatio 
vegetable = vegetabel vegetablle vegettable fgetable vegeteble vegetible vegetuble vogetable vegotable vegetablo 
ninety = ninetty ninoty niety nineety niinety nninety ninnety ninetyy neinety 
scarecrow = scerecrow scorecrow ssarecrow scaresrow sssarecrow scaressrow sscarecrow scarescrow scarrecrow scarecrrow 
tallow = talow talllow ttallow tellow tillow tullow tollow 
shallow = shalow shalllow shellow shillow shullow shollow 
billow = bilow billlow bbillow biillow billoow billoww billoew 
coed = soed ssoed scoed cood ccoed coedd coeed coad coid 
cobweb = sobweb ssobweb scobweb cobwob cobbweb cobwebb ccobweb cobweeb coobweb cobwweb 
convent = sonvent ssonvent sconvent conventt confnt convont convet covent cconvent conveent 
elliptical = eliptical elliptisal elliptissal elliptiscal ellliptical ellipticall ellipttical ellipticel ellipticil 
distill = distil distilll disttill ddistill diistill distiill disstill 
ill = il illl iill eill inll oll 
still = stil stilll sttill stiill sstill steill 
folklore = folklorre follklore folkllore folkloro folkloree ffolklore folkklore foolklore 
talk = tallk ttalk telk tilk tulk tolk taalk 
chalk = shalk sshalk schalk challk chelk chilk chulk cholk 
walk = wallk welk wilk wulk wolk waalk waelk 
appointment = apointment appointtment appointmentt eppointment ippointment uppointment appointmont appointmet appoitment 
allotment = alotment alllotment allottment allotmentt ellotment illotment ullotment allotmont allotmet 
sublime = subllime sublimo subblime sublimee subliime sublimme ssublime suublime subleime 
submit = submitt subbmit submiit submmit ssubmit suubmit submeit cubmit 
chorus = shorus sshorus schorus chorrus chous cchorus chhorus choorus choruss 
schism = sshism ssshism sschism scchism schhism schiism schismm schissm scheism 
beggar = begar begger beggor beggarr beggir beggur boggar 
haggard = hagard haggerd haggord haggarrd heggard higgard haggird huggard haggurd 
accept = acept ascept acsept asscept acssept asccept acscept acceptt eccept iccept 
cent = ssent centt cet ccent ceent cennt cint 
ragged = rragged regged raggod rogged raagged raegged raigged raogged raugged 
happen = hapen heppen hippen huppen happon happe hoppen 
eggnog = egnog oggnog eeggnog egggnog eggnogg eggnnog eggnoog eggnoeg edggnog 
egg = eg ogg eegg eggg edgg egdg agg igg engg 
dagger = dager daggerr degger dugger daggor dogger daagger daegger 
craggy = cragy sraggy ssraggy crraggy creggy criggy cruggy croggy 
maggot = magot maggott meggot miggot muggot moggot maaggot 
ballot = balot balllot ballott bellot billot bullot bollot 
government = goverrnment governmentt goverment gofrnment govornment governmont governmet goveernment governmeent ggovernment 
covet = sovet ssovet scovet covett coft covot ccovet coveet coovet 
recreation = recreatian recration resreation ressreation rescreation rrecreation recrreation recreattion recreasion recreetion 
creation = creatian cration sreation ssreation screation crreation creattion creasion creetion creition 
monotonous = monotonuos monotonos monottonous mootonous monotoous mmonotonous monnotonous monotonnous moonotonous monootonous 
pompous = pompuos pompos pomous pommpous poompous pompoous ppompous pomppous pompouss pompouus 
advertisement = adverrtisement adverttisement advertisementt adfrtisement edvertisement idvertisement udvertisement advortisement advertisoment advertisemont 
omen = omon ome omeen ommen omenn oomen oemen onmen ompen oman 
moment = momentt momont momet momeent mmoment momment momennt mooment moement 
desecration = desecratian desesration desessration desescration desecrration desecrattion desecrasion desecretion desecrition desecrution 
reduction = reductian redustion redusstion redusction rreduction reducttion reducsion roduction reductio reducction 
female = femael femalle femele femile femule fomale femalo femole 
wholesale = whoelsale wholesael whollesale wholesalle wholesele wholesile wholesule wholosale wholesalo 
literature = literrature literaturre lliterature litterature literatture litereture literiture literuture litorature literaturo 
picture = pisture pissture piscture picturre pictture picturo piccture picturee piicture ppicture 
tire = tirre ttire tiro tiree tiire teire tiwre tira 
conspire = sonspire ssonspire sconspire conspirre conspiro cospire cconspire conspiree conspiire connspire 
entire = entirre enttire ontire entiro etire eentire entiree entiire enntire 
desire = desirre dosire desiro ddesire deesire desiree desiire dessire deseire 
addition = adition additian addittion addision eddition iddition uddition additio 
sedition = seditian sedittion sedision sodition seditio seddition seedition sediition seditiion seditionn 
paraphrase = peraphrase poraphrase parraphrase paraphrrase parephrase paraphrese piraphrase pariphrase paraphrise 
paragraph = peragraph poragraph parragraph paragrraph paregraph paragreph piragraph parigraph paragriph 
birthday = birrthday birtthday birthdey birthdiy birthduy birthdoy birthdaay 
birth = birrth birtth bbirth birthh biirth beirth biwrth binrth 
firth = firrth firtth ffirth firthh fiirth feirth fiwrth veirth 
technical = teshnical technisal tesshnical technissal teschnical techniscal technicall ttechnical technicel technicil 
chemist = shemist sshemist schemist chemistt chomist cchemist cheemist chhemist chemiist chemmist 
accede = acede ascede acsede asscede acssede asccede acscede eccede iccede uccede 
accept = acept ascept acsept asscept acssept asccept acscept acceptt eccept iccept 
nuisance = nuisanse nuisansse nuisansce nuisence nuisince nuisunce nuisanco nuisace 
suit = suitt suiit ssuit suuit sueit cuit scuit sruit 
fruit = frruit fruitt fuit ffruit fruiit fruuit frueit fwruit 
artichoke = ertichoke ortichoke artishoke artisshoke artischoke arrtichoke arttichoke irtichoke urtichoke 
arbitrate = erbitrate orbitrate arrbitrate arbitrrate arbittrate arbitratte arbitrete irbitrate arbitrite 
drowsy = drrowsy ddrowsy droowsy drowssy drowwsy drowsyy droewsy drowcy 
drown = drrown ddrown drownn droown drowwn droewn dwrown drewn dronwn 
supporter = suporter supporrter supporterr supportter supportor supporteer suppoorter suppporter 
bankruptcy = bankruptsy bankruptssy bankruptscy bankrruptcy bankrupttcy bankuptcy benkruptcy binkruptcy bunkruptcy bakruptcy 
innocent = inocent innosent innossent innoscent innocentt innocont innocet innoccent innoceent 
proceed = proced proseed prosseed prosceed prroceed procoed proceod procceed proceedd proceeed 
square = squere squore squarre squure squaro squaare 
spare = spere sparre spure sparo spaare spaere spaire 
snare = snere snarre snire snure snaro snaare 
rare = rere rore rrare rarre rire rure raro 
stretch = stretsh stretssh stretsch strretch sttretch strettch strotch stretcch streetch stretchh 
butcher = butsher butssher butscher butcherr buttcher butchor bbutcher butccher butcheer butchher 
match = matsh matssh matsch mattch metch mitch mutch motch 
patch = patsh patssh patsch pattch petch putch potch paatch 
already = alrady alrready allready elready alreedy ilready alreidy ulready alreudy alroady 
ready = rady rready reidy reudy roady reody reaady reaedy 
read = rread reid reud reod reaad reaed reaid reaod 
dread = drad drread dreed dreid dreud droad dreod 
evanescent = evanessent evanesssent evanesscent evanescentt evenescent evinescent evunescent ovanescent evanoscent evanescont 
incandescent = insandescent incandessent inssandescent incandesssent inscandescent incandesscent incandescentt incendescent incindescent incundescent 
amendment = amendmentt emendment imendment umendment amondment amendmont amedment amendmet 
element = eelment ellement elementt olement eloment elemont elemet eelement eleement elemeent 
revile = reviel rrevile reville rovile revilo reevile revilee reviile 
awhile = awhiel awhille ewhile iwhile uwhile awhilo owhile 
while = whiel whille whilo whilee whhile whiile wwhile wheile whila 
mile = miel mille milo milee miile mmile meile nmile mpile 
midnight = midnightt middnight midnigght midnighht miidnight midniight mmidnight midnnight meidnight 
delight = dellight delightt dolight ddelight deelight deligght delighht deliight 
syndicate = syndisate syndissate syndiscate syndicatte syndicete syndicite syndicute syndicato 
syntax = synttax syntex syntix syntux syntox syntaax syntaex 
stepped = steped sttepped steppod steppedd steepped steppeed steppped sstepped 
stopped = stoped sttopped stoppod stoppedd stoppeed stoopped stoppped sstopped 
lightning = llightning lighttning lightining lightnig ligghtning lightningg lighhtning liightning lightniing 
light = llight lightt ligght lighht liight leight lidght linght 
plight = pllight plightt pligght plighht pliight pplight pleight plidght 
flight = fllight flightt fflight fligght flighht fliight fleight velight 
arithmetic = erithmetic orithmetic arithmetis arithmetiss arithmetisc arrithmetic aritthmetic arithmettic irithmetic 
vinegar = vineger vinegor vinegarr vinegir vinegur vinogar viegar 
rebuke = rrebuke robuke rebuko rebbuke reebuke rebukee rebukke rebuuke wrebuke 
bike = biko bbike bikee biike bikke beike bika biki biken binke 
bake = beke buke bako boke baake baeke baike baoke 
rake = rrake reke rike ruke rako roke raake 
irksome = irrksome irksomo irksomee iirksome irkksome irksomme irksoome irkssome irksoeme 
stir = stirr sttir stiir sstir steir ctir sctir 
skirt = skirrt skirtt skiirt skkirt sskirt skeirt ckirt 
first = firrst firstt ffirst fiirst firsst feirst firct 
attire = atire attirre atttire ettire ittire uttire attiro 
mire = mirre miro miree miire mmire meire miwre nmire mpire 
fire = firre firo firee ffire fiire feire fiwre veire fira 
wire = wirre wiro wiree wiire wwire weire wiwre wira wiri 
incessant = incesant insessant inssessant inscessant incessantt incessent incessint incessunt incossant incessat 
cent = ssent centt cet ccent ceent cennt cint 
scent = ssent sssent sscent scentt scont scet sccent sceent scennt 
ascend = assend asssend asscend escend iscend uscend ascond asced 
unknown = uknown unkknown unnknown unknnown unknownn unknoown uunknown unknowwn unknoewn runknown 
until = untill unttil util untiil unntil uuntil unteil runtil 
bankrupt = bankrrupt bankruptt bankupt benkrupt binkrupt bunkrupt bakrupt bonkrupt 
cherub = sherub ssherub scherub cherrub cheub chorub cherubb ccherub cheerub chherub 
overrule = overule overruel overrrule overrulle ofrrule ovorrule overrulo oveerrule 
meanwhile = manwhile meanwhiel meanwhille meenwhile meinwhile meunwhile moanwhile meanwhilo meawhile 
allotted = alotted alloted alllotted allottted ellotted illotted ullotted allottod 
bottle = botle bottel bottlle botttle bottlo bbottle bottlee boottle 
meadow = madow meedow meidow meudow moadow meodow meaadow 
dead = deid deud doad deod deaad deaed deaid deaod 
read = rread reid reud reod reaad reaed reaid reaod 
dread = drad drread dreed dreid dreud droad dreod 
existence = existense existensse existensce existtence esistence oxistence existonce existenco existece existencce 
sentence = sentense sentensse sentensce senttence sontence sentonce sentenco setence sentece sentencce 
mystify = mysttify mystiffy mystiify mmystify mysstify myystify mystifyy mysteify myctify 
mystery = mysterry mysttery mystory mysteery mmystery mysstery myystery mysteryy 
awe = iwe uwe awo aawe aewe aiwe aowe auwe 
gnawing = gnewing gniwing gnuwing gnawig gnowing gnaawing gnaewing 
paw = piw puw paaw paew paiw paow pauw peaw 
draw = drraw driw druw drow draaw draew draiw draow 
irrevocable = irevocable irrevocabel irrevosable irrevossable irrevoscable irrrevocable irrevocablle irrevoceble irrevocible 
havoc = havos havoss havosc hevoc hivoc huvoc hovoc 
recede = resede ressede rescede rrecede rocede recode recedo reccede recedde reecede 
accede = acede ascede acsede asscede acssede asccede acscede eccede iccede uccede 
tongue = ttongue tonguo togue tonguee tonggue tonngue toongue tonguue toengue 
ton = tton tonn toon toen toun tuon taan taen 
appliance = apliance applianse appliansse appliansce applliance eppliance applience ippliance appliince uppliance 
ambulance = ambulanse ambulansse ambulansce ambullance embulance ambulence imbulance ambulince umbulance ambulunce 
commerce = comerce sommerce commerse ssommerce commersse scommerce commersce commerrce commorce commerco 
exercise = exersise exerssise exerscise exerrcise esercise oxercise exerciso exerccise eexercise exeercise 
abolish = abollish ebolish ibolish ubolish obolish aabolish aebolish 
magazine = magasine megazine magezine migazine magizine mugazine maguzine magazino magazie 
descent = dessent desssent desscent descentt doscent descont descet desccent ddescent deescent 
scent = ssent sssent sscent scentt scont scet sccent sceent scennt 
tyranny = tyrany tyrranny ttyranny tyrenny tyrinny tyrunny tyronny 
syllable = sylable syllabel sylllable syllablle sylleble syllible sylluble syllablo 
celebration = celebratian ceelbration selebration sselebration scelebration celebrration cellebration celebrattion celebrasion celebretion 
education = educatian edusation edussation eduscation educattion educasion educetion educition educution oducation 
reign = rign rreign roign reeign reiggn reiign reignn riegn 
freight = frreight freightt froight freeight ffreight freigght freighht freiight 
plaque = pllaque pleque plique pluque plaquo ploque plaaque 
torque = torrque ttorque torquo torquee toorque torqque torquue toerque 
mosque = mosquo mosquee mmosque moosque mosqque mossque mosquue moesque mocque 
icicle = icicel isicle icisle issicle icissle iscicle iciscle iciclle iciclo iccicle 
icy = isy issy iscy iccy iicy icyy eicy incy acy ecy 
scholastic = ssholastic scholastis sssholastic scholastiss sscholastic scholastisc schollastic scholasttic scholestic scholistic 
chemist = shemist sshemist schemist chemistt chomist cchemist cheemist chhemist chemiist chemmist 
hazardous = hazarduos hazardos hazerdous hazordous hazarrdous hasardous hezardous hizardous hazirdous 
fibrous = fibruos fibros fibrrous fibbrous ffibrous fiibrous fibroous fibrouss fibrouus 
desirable = desirabel desirrable desirablle desireble desirible desiruble dosirable desirablo 
about = abuot abot aboutt ebout ibout ubout obout 
harangue = herangue horangue harrangue harengue hirangue haringue hurangue harungue haranguo 
submarine = submerine submorine submarrine submirine submurine submarino submarie 
submission = submision submissian submissio subbmission submiission submissiion submmission submissionn submissioon ssubmission 
unfounded = unfuonded unfonded unfoundod ufounded unfouded unfoundded unfoundedd unfoundeed unffounded unnfounded 
bravely = brravely bravelly brafly brevely brively bruvely bravoly brovely 
homely = homelly homoly homeely hhomely hommely hoomely homelyy hoemely homley 
crystal = srystal ssrystal scrystal crrystal crystall crysttal crystel crystil crystul 
mystery = mysterry mysttery mystory mysteery mmystery mysstery myystery mysteryy 
appease = apease appase eppease appeese ippease appeise uppease appeuse appoase appeaso 
disappeared = disapeared disappared disappeered disappeored disappearred diseppeared disippeared disappeired disuppeared 
irritate = iritate irrritate irrittate irritatte irritete irritite irritute irritato 
accumulate = acumulate ascumulate acsumulate asscumulate acssumulate asccumulate acscumulate accumullate accumulatte eccumulate 
recite = resite ressite rescite rrecite recitte rocite recito reccite reecite recitee 
incite = insite inssite inscite incitte incito icite inccite incitee iincite inciite 
who = whho whoo wwho whoe whe whon whou whuo wha 
whom = whhom whomm whoom wwhom whoem whonm whomp whem whoum 
stammer = stamer stammerr sttammer stemmer stimmer stummer stammor stommer 
summer = sumer summerr summor summeer summmer ssummer suummer summar 
gem = gom geem ggem gemm genm gemp dgem gam gim 
digest = digestt digost ddigest digeest diggest diigest digesst deigest digect 
lovely = llovely lovelly lofly lovoly loveely loovely lovvely lovelyy 
bravely = brravely bravelly brafly brevely brively bruvely bravoly brovely 
crescent = srescent cressent ssrescent cresssent screscent cresscent crrescent crescentt croscent crescont 
scent = ssent sssent sscent scentt scont scet sccent sceent scennt 
excessive = excesive exsessive exssessive exscessive escessive excessif oxcessive excossive excessivo exccessive 
college = colege colelge sollege ssollege scollege colllege colloge collego ccollege 
arrest = arest errest orrest arrrest arrestt irrest urrest arrost 
arrival = arival errival orrival arrrival arrivall arrivel irrival arrivil 
credence = sredence credense ssredence credensse scredence credensce crredence crodence credonce credenco 
tendency = tendensy tendenssy tendenscy ttendency tondency tendoncy tedency tendecy tendenccy tenddency 
justifiable = justifiabel justifiablle justtifiable justifieble justifiible justifiuble justifiablo justifioble 
obstacle = obstacel obstasle obstassle obstascle obstaclle obsttacle obstecle obsticle obstucle obstaclo 
siege = seige sioge siego sieege siegee siegge siiege ssiege seiege ciege 
besiege = beseige bosiege besioge besiego bbesiege beesiege besieege besiegee besiegge besiiege 
besieged = beseiged bosieged besioged besiegod bbesieged besiegedd beesieged besieeged besiegeed besiegged 
ensue = onsue ensuo esue eensue ensuee ennsue enssue ensuue encue 
tuesday = ttuesday tuesdey tuesdiy tuesduy tuosday tuesdoy tuesdaay 
adjourn = adjuorn adjorn adjourrn edjourn idjourn udjourn odjourn 
nourish = nuorish norish nourrish nourishh nouriish nnourish noourish nourissh nouurish 
eighth = ighth eightth oighth eeighth eigghth eighhth eighthh eiighth ieghth 
eight = ight eightt oight eeight eigght eighht eiight ieght 
freight = frreight freightt froight freeight ffreight freigght freighht freiight 
guardian = guerdian guordian guarrdian guardien guirdian guardiin guurdian guardiun guardia 
guard = guerd guord guarrd guird guurd 
essence = esence essense essensse essensce ossence essonce essenco essece essencce eessence 
influence = influense influensse influensce inflluence influonce influenco influece ifluence influencce influeence 
succumb = sucumb suscumb sucsumb susscumb sucssumb susccumb sucscumb succumbb succcumb 
dumb = dumbb ddumb dummb duumb dunmb dumpb drumb damb 
numb = numbb nummb nnumb nuumb nunmb numpb nrumb namb 
thumb = tthumb thumbb thhumb thummb thuumb thunmb thumpb thrumb thamb 
aluminum = alluminum eluminum iluminum uluminum alumium oluminum aaluminum 
deceitful = decitful deseitful desseitful desceitful deceitfull deceittful doceitful decoitful decceitful ddeceitful 
cement = sement ssement scement cementt coment cemont cemet ccement ceement cemeent 
faucet = fauset fausset fauscet faucett feucet fiucet fuucet faucot 
emphasize = emhasize emphasise emphesize emphisize emphusize omphasize emphasizo emphosize 
organize = orrganize organise orgenize orginize orgunize organizo orgaize orgonize 
orphanage = orrphanage orphenage orphanege orphinage orphanige orphunage orphanuge orphanago orphaage 
pursue = purrsue pursuo pursuee ppursue purssue puursue pursuue purcue 
sue = suo suee ssue suue scue srue zue sua sui 
whose = whosee whhose whoose whosse wwhose whoese whoce whosce whoze 
who = whho whoo wwho whoe whe whon whou whuo wha 
whom = whhom whomm whoom wwhom whoem whonm whomp whem whoum 
myriad = myrriad myried myriid myriud myriod myriaad myriaed 
myth = mytth mythh mmyth myyth nmyth mpyth 
subterfuge = subterrfuge subtterfuge subtorfuge subterfugo subbterfuge subteerfuge subterfugee subterffuge subterfugge 
strange = strrange sttrange strenge stringe strunge strango strage stronge 
stage = sttage stege stige stuge stago stoge staage 
range = rrange renge ringe runge rango ronge raange 
triangle = triangel trriangle trianglle ttriangle triengle triingle triungle trianglo triagle 
angle = anglle engle ingle ungle anglo agle ongle 
mammal = mamal mammall memmal mammel mimmal mammil mummal mammul 
stammer = stamer stammerr sttammer stemmer stimmer stummer stammor stommer 
innocence = inocence innosence innocense innossence innocensse innoscence innocensce innoconce innocenco innocece 
innocent = inocent innosent innossent innoscent innocentt innocont innocet innoccent innoceent 
knack = knask knassk knasck kneck knick knuck knaack 
knapsack = knapsask knapsassk knapsasck knepsack knapseck knipsack knapsick knupsack knapsuck 
supply = suply supplly suppply ssupply suupply supplyy cupply 
supporter = suporter supporrter supporterr supportter supportor supporteer suppoorter suppporter 
announcement = anouncement annuoncement annoncement announsement announssement announscement announcementt ennouncement innouncement unnouncement 
mince = minse minsse minsce minco mincce mincee miince mmince minnce meince 
receiver = reciver reseiver resseiver resceiver rreceiver receiverr receifr roceiver recoiver receivor 
reduction = reductian redustion redusstion redusction rreduction reducttion reducsion roduction reductio reducction 
achieving = acheiving ashieving asshieving aschieving echieving ichieving uchieving achioving achievig 
thieves = theives tthieves thiefs thioves thievos thieeves thievees thhieves thiieves thievess 
fried = freid frried friod friedd frieed ffried friied freied fwried 
fiend = feind fiond fied fiendd fieend ffiend fiiend fiennd feiend veiend 
office = ofice offise offisse offisce offico officce officee offfice offiice 
lattice = latice lattise lattisse lattisce llattice latttice lettice littice luttice 
interior = interiar interrior interiorr intterior intorior iterior inteerior iinterior interiior innterior 
inferior = inferiar inferrior inferiorr inforior iferior infeerior infferior iinferior inferiior innferior 
reconcile = reconciel resoncile reconsile ressoncile reconssile resconcile reconscile rreconcile reconcille roconcile 
meanwhile = manwhile meanwhiel meanwhille meenwhile meinwhile meunwhile moanwhile meanwhilo meawhile 
barbaric = berbaric barberic borbaric barboric barbaris barbariss barbarisc barrbaric barbarric 
charity = cherity chority sharity ssharity scharity charrity charitty chirity churity 
symmetry = symetry symmetrry symmettry symmotry symmeetry symmmetry ssymmetry 
mystery = mysterry mysttery mystory mysteery mmystery mysstery myystery mysteryy 
accidentally = acidentally accidentaly ascidentally acsidentally asscidentally acssidentally asccidentally acscidentally accidentallly 
detrimental = detrrimental detrimentall dettrimental detrimenttal detrimentel detrimentil detrimentul dotrimental detrimontal detrimetal 
encourage = encuorage encorage ensourage enssourage enscourage encourrage encourege encourige encouruge oncourage 
encouragement = encuoragement encoragement ensouragement enssouragement enscouragement encourragement encouragementt encouregement encourigement encourugement 
faithful = faithfull faitthful feithful fiithful fuithful foithful faaithful 
doubtful = duobtful dobtful doubtfull doubttful doubbtful ddoubtful doubtfful dooubtful 
mummy = mumy mmummy mummmy muummy mummyy nmummy munmmy mumnmy mpummy 
summer = sumer summerr summor summeer summmer ssummer suummer summar 
opposite = oposite oppositte opposito oppositee opposiite oopposite oppoosite oppposite oppossite 
colony = solony ssolony scolony collony coloy ccolony colonny coolony coloony 
agony = egony igony ugony agoy ogony aagony aegony 
canopy = sanopy ssanopy scanopy cenopy cinopy cunopy caopy conopy 
subdue = subduo subbdue subddue subduee ssubdue suubdue subduue cubdue scubdue 
sue = suo suee ssue suue scue srue zue sua sui 
true = trrue ttrue tue truo truee truue twrue 
blue = bllue bluo bblue bluee bluue blrue blua blui blae 
plausible = plausibel pllausible plausiblle pleusible pliusible pluusible plausiblo plousible 
feasible = fasible feasibel feasiblle feesible feisible feusible foasible feasiblo 
receive = recive reseive resseive resceive rreceive receif roceive recoive receivo recceive 
retrace = retrase retrasse retrasce rretrace retrrace rettrace retrece retrice retruce rotrace 
revere = rrevere reverre refre rovere revore revero reevere reveere reveree 
materialism = materrialism materiallism matterialism meterialism materielism miterialism materiilism muterialism materiulism matorialism 
parcel = percel porcel parsel parssel parscel parrcel parcell pircel purcel 
faucet = fauset fausset fauscet faucett feucet fiucet fuucet faucot 
frivolous = frivoluos frivolos frrivolous frivollous ffrivolous friivolous frivoolous frivoloous 
jealous = jalous jealuos jealos jeallous jeelous jeilous jeulous joalous 
ancestry = ansestry anssestry anscestry ancestrry ancesttry encestry incestry uncestry ancostry acestry 
criticism = sriticism critisism ssriticism critissism scriticism critiscism crriticism critticism ccriticism criticcism 
kindergarten = kindergerten kindergorten kinderrgarten kindergarrten kindergartten kindergirten kindergurten kindorgarten kindergarton 
broken = brroken brokon bbroken brokeen brokken brokenn brooken broeken bwroken 
token = ttoken tokon tokeen tokken tokenn tooken toeken tokan tokin 
spoken = spokon spokeen spokken spokenn spooken sppoken sspoken spoeken cpoken 
cypress = cypres sypress ssypress scypress cyprress cypross ccypress cypreess cyppress 
cycle = cycel sycle cysle ssycle cyssle scycle cyscle cyclle cyclo ccycle 
bomb = bbomb bombb bommb boomb boemb bonmb bompb bemb boumb 
tomb = ttomb tombb tommb toomb toemb tonmb tompb temb 
dumb = dumbb ddumb dummb duumb dunmb dumpb drumb damb 
numb = numbb nummb nnumb nuumb nunmb numpb nrumb namb 
extraordinary = extraordinery extraordinory extrraordinary extraorrdinary extraordinarry exttraordinary estraordinary extreordinary extriordinary 
destiny = desttiny dostiny destiy ddestiny deestiny destiiny destinny desstiny destinyy 
skeptical = skeptisal skeptissal skeptiscal skepticall skepttical skepticel skepticil skepticul skoptical 
detrimental = detrrimental detrimentall dettrimental detrimenttal detrimentel detrimentil detrimentul dotrimental detrimontal detrimetal 
language = llanguage lenguage languege linguage languige lunguage languuge languago laguage 
adage = edage adege idage adige udage aduge adago 
damage = demage damege dimage damige dumage damuge damago 
mopped = moppod moppedd moppeed mmopped moopped moppped moepped nmopped mpopped 
clapped = claped sslapped sclapped cllapped clepped clupped clappod claapped 
zipped = ziped zippod zippedd zippeed ziipped zippped zzipped zeipped zippad 
one = ono oe onee onne oone oene ona oni ene onen 
once = onse onsse onsce onco oce oncce oncee onnce oonce oence 
bracelet = braceelt braselet brasselet brascelet brracelet bracellet bracelett brecelet bricelet brucelet 
bravely = brravely bravelly brafly brevely brively bruvely bravoly brovely 
architect = erchitect orchitect arshitect architest arsshitect architesst arschitect architesct arrchitect archittect 
mutiny = muttiny mutiy mutiiny mmutiny mutinny muutiny mutinyy muteiny nmutiny 
knead = knad kneid kneud knoad kneod kneaad kneaed kneaid 
knives = knifs knivos knivees kniives kknives knnives knivess knivves kneives knivec 
necessarily = necesarily necesserily necessorily nesessarily nessessarily nescessarily necessarrily necessarilly necessirily 
marigold = merigold morigold marrigold marigolld mirigold murigold 
grateful = grrateful gratefull gratteful greteful griteful gruteful gratoful groteful 
conjugate = sonjugate ssonjugate sconjugate conjugatte conjugete conjugite conjugute conjugato cojugate 
compensation = compensatian sompensation ssompensation scompensation compensattion comensation compensasion compensetion compensition compensution 
desecration = desecratian desesration desessration desescration desecrration desecrattion desecrasion desecretion desecrition desecrution 
arrangement = arangement errangement orrangement arrrangement arrangementt arrengement irrangement arringement 
vinegar = vineger vinegor vinegarr vinegir vinegur vinogar viegar 
singular = singuler singulor singularr singullar singulir singulur sigular 
particular = perticular particuler porticular particulor partisular partissular partiscular parrticular particularr particullar 
rhyme = rrhyme rhymo rhymee rhhyme rhymme rhyyme wrhyme rhynme rhympe 
type = ttype typee typpe tyype typa typi typen 
my = mmy myy nmy mpy 
by = bby byy 
mischievous = mischeivous mischievuos mischievos misshievous missshievous misschievous mischiovous miscchievous mischieevous mischhievous 
famous = famuos famos femous fimous fumous fomous faamous 
clique = slique sslique sclique cllique cliquo cclique cliquee cliique cliqque 
critique = sritique ssritique scritique crritique crittique critiquo ccritique critiquee criitique critiique 
facsimile = facsimiel fassimile fasssimile fascsimile facsimille fecsimile ficsimile fucsimile facsimilo 
meteor = metear meteorr metteor moteor metoor meeteor meteeor mmeteor meteoor 
preoccupy = preocupy preaccupy preoscupy preocsupy preosscupy preocssupy preosccupy preocscupy prreoccupy prooccupy 
preceding = preseding presseding presceding prreceding proceding precoding precedig precceding precedding preeceding 
schedule = scheduel sshedule ssshedule sschedule schedulle schodule schedulo scchedule scheddule scheedule 
schism = sshism ssshism sschism scchism schhism schiism schismm schissm scheism 
murmur = murrmur murmurr mmurmur murmmur muurmur murmuur muwrmur murmuwr 
luxury = luxurry lluxury luuxury luxuury luxxury luxuryy luxuwry lruxury 
allay = alay alllay ellay illay alliy ullay alluy 
daylight = dayllight daylightt deylight diylight duylight doylight daaylight 
loophole = lophole loophoel lloophole loopholle loopholo loopholee loophhole looophole 
clientele = cleintele clienteel slientele sslientele sclientele cllientele clientelle clienttele cliontele clientole 
tale = tael talle ttale tele tule talo taale taele 
pale = pael palle pele palo paale paele paile paole paule 
heifer = hifer heiferr hoifer heifor heeifer heifeer heiffer hheifer heiifer 
heighten = highten heightten hoighten heighton heighte heeighten heighteen heigghten hheighten heighhten 
secret = sesret sessret sescret secrret secrett socret secrot seccret seecret secreet 
vehicle = vehicel vehisle vehissle vehiscle vehiclle fhicle vohicle vehiclo vehiccle veehicle 
he = hee hhe hu haa hae hai hao hau hea 
be = bo bbe ba ben bae bai bao bau 
manufacturer = manufasturer manufassturer manufascturer manufacturrer manufacturerr manufactturer menufacturer manufecturer minufacturer manuficturer 
century = sentury ssentury scentury centurry centtury contury cetury ccentury ceentury cenntury 
zest = zestt sest zost zeest zesst zzest zect zesct 
topaz = ttopaz topas topez topiz topuz topoz topaaz 
turkey = turrkey tturkey turkoy turkeey turkkey tuurkey turkeyy tuwrkey 
donkey = donkoy dokey ddonkey donkeey donkkey donnkey doonkey donkeyy doenkey donkay 
daytime = dayttime deytime diytime duytime daytimo doytime daaytime 
day = dey diy duy doy daay daey daiy 
appeal = apeal appal appeall eppeal appeel ippeal appeil uppeal appeul appoal 
disappear = disapear disappar disappeer disappeor disappearr diseppear disippear disappeir disuppear 
altercation = altercatian altersation alterssation alterscation alterrcation alltercation alttercation altercattion altercasion eltercation 
foundation = foundatian fuondation fondation foundattion foundasion foundetion foundition foundution foundatio foudation 
callous = calous calluos callos sallous ssallous scallous calllous cellous cillous 
fibrous = fibruos fibros fibrrous fibbrous ffibrous fiibrous fibroous fibrouss fibrouus 
pursuant = purrsuant pursuantt pursuent pursuint pursuunt pursuat pursuont 
sour = suor sor sourr soour ssour souur soeur cour 
our = uor ourr oour ouur oeur ouwr orur eur onur 
flour = fluor flor flourr fllour fflour floour flouur floeur 
yield = yeild yielld yiold yieldd yieeld yiield yyield yeield yiled 
yard = yerd yord yarrd yird yurd 
yarn = yern yorn yarrn yirn yurn 
access = acess acces ascess acsess asscess acssess asccess acscess eccess iccess 
icy = isy issy iscy iccy iicy icyy eicy incy acy ecy 
misunderstood = misunderstod misunderrstood misundersttood misundorstood misuderstood misundderstood misunderstoodd misundeerstood miisunderstood mmisunderstood 
faculty = fasulty fassulty fasculty facullty facultty feculty ficulty fuculty 
perseverance = perseveranse perseveransse perseveransce perrseverance perseverrance persefrance perseverence perseverince perseverunce porseverance 
get = gett geet gget dget gat gaat gaet gaot 
when = whon whe wheen whhen whenn wwhen whan whin 
geology = gealogy geollogy goology geeology ggeology geologgy geoology geoloogy geologyy 
preoccupy = preocupy preaccupy preoscupy preocsupy preosscupy preocssupy preosccupy preocscupy prreoccupy prooccupy 
unique = uniquo uique uniquee uniique unnique uniqque uunique uniquue uneique runique 
intrigue = intrrigue inttrigue intriguo itrigue intriguee intriggue iintrigue intriigue inntrigue 
worship = worrship worshhip worshiip woorship worshipp worsship wworship woership worsheip 
worry = wory worrry woorry wworry worryy woerry wowrry 
someone = someane somoone someono someoe someeone someonee sommeone someonne soomeone someoone 
somewhere = somewherre somowhere somewhore somewhero someewhere somewheere somewheree somewhhere sommewhere soomewhere 
some = somo somee somme soome ssome soeme scome sonme sompe 
chasm = shasm sshasm schasm chesm chism chusm chosm 
echo = esho essho escho ocho eccho eecho echho echoo echoe acho 
echoing = eshoing esshoing eschoing ochoing echoig ecchoing eechoing echoingg echhoing echoiing 
worse = worrse worso worsee woorse worsse wworse woerse worce 
word = worrd wordd woord wword woerd wowrd werd wonrd wourd 
worm = worrm wormm woorm wworm woerm wowrm wornm wormp werm 
worth = worrth wortth worthh woorth wworth woerth wowrth werth 
congress = congres songress ssongress scongress congrress congross cogress ccongress congreess conggress 
mattress = mattres matress mattrress matttress mettress mittress muttress mattross 
neither = nither neitherr neitther noither neithor neeither neitheer neithher neiither nneither 
heifer = hifer heiferr hoifer heifor heeifer heifeer heiffer hheifer heiifer 
sluggish = slugish slluggish slugggish sluggishh sluggiish ssluggish sluggissh sluuggish 
egg = eg ogg eegg eggg edgg egdg agg igg engg 
they = tthey thoy theey thhey theyy thay thiy theny 
obey = oboy obbey obeey oobey obeyy oebey obay obiy ebey obeny 
survey = surrvey surfy survoy surveey ssurvey suurvey survvey surveyy curvey 
catastrophe = satastrophe ssatastrophe scatastrophe catastrrophe cattastrophe catasttrophe cetastrophe catestrophe citastrophe catistrophe 
establish = establlish esttablish esteblish estiblish estublish ostablish estoblish 
honorary = honorery honorory honorrary honorarry honoriry honorury hoorary 
him = hhim hiim himm heim hinm himp hom haam haem 
humid = humidd hhumid humiid hummid huumid humeid hunmid humpid hrumid hamid 
writer = riter wrriter writerr writter writor writeer wriiter 
write = wrrite writte writo writee wriite wwrite wreite 
acquittal = acquital asquittal assquittal ascquittal acquittall acquitttal ecquittal acquittel icquittal 
guillotine = guilotine guilllotine guillottine guillotino guillotie guillotinee gguillotine guiillotine guillotiine 
everywhere = everrywhere everywherre efrywhere overywhere evorywhere everywhore everywhero eeverywhere eveerywhere everywheere 
everyone = everryone efryone overyone evoryone everyono everyoe eeveryone eveeryone everyonee everyonne 
every = everry efry overy evory eevery eveery evvery everyy evary 
afternoon = afternon afterrnoon aftternoon efternoon ifternoon ufternoon aftornoon afternoo 
choose = shoose sshoose schoose chooso cchoose choosee chhoose chooose choosse 
noon = noo nnoon noonn nooon noeon nooen noen nonon 
boon = bon bboon boonn booon boeon booen beon boen bonon 
puny = puy punny ppuny puuny punyy pruny pany peny 
discernible = discernibel dissernible disssernible disscernible discerrnible discerniblle discornible discerniblo discernibble disccernible 
irresistible = iresistible irresistibel irrresistible irresistiblle irresisttible irrosistible irresistiblo irresistibble irreesistible 
visible = visibel visiblle visiblo visibble visiblee viisible visiible vissible vvisible 
tangible = tangibel tangiblle ttangible tengible tingible tungible tangiblo tagible 
efficient = eficient efficeint effisient effissient effiscient efficientt officient efficiont efficiet efficcient 
chili = shili sshili schili chilli cchili chhili chiili chilii cheili 
amphibian = amhibian emphibian amphibien imphibian amphibiin umphibian amphibiun amphibia 
useful = usefull usoful useeful usefful usseful uuseful usefuul uceful 
grateful = grrateful gratefull gratteful greteful griteful gruteful gratoful groteful 
flippant = flipant fllippant flippantt flippent flippint flippunt flippat flippont 
slippery = slipery slipperry sllippery slippory slippeery sliippery slipppery 
scholar = scholer scholor ssholar sssholar sscholar scholarr schollar scholir scholur 
schism = sshism ssshism sschism scchism schhism schiism schismm schissm scheism 
misfortune = misforrtune misforttune misfortuno misfortue misfortunee misffortune miisfortune mmisfortune misfortunne misfoortune 
faculty = fasulty fassulty fasculty facullty facultty feculty ficulty fuculty 
elsewhere = elsewherre ellsewhere olsewhere elsowhere elsewhore elsewhero eelsewhere elseewhere elsewheere elsewheree 
whine = whino whie whinee whhine whiine whinne wwhine wheine whina whini 
white = whitte whito whitee whhite whiite wwhite wheite whita whiti 
when = whon whe wheen whhen whenn wwhen whan whin 
expenditure = expenditurre expenditture espenditure oxpenditure exponditure expendituro expediture expendditure eexpenditure expeenditure 
century = sentury ssentury scentury centurry centtury contury cetury ccentury ceentury cenntury 
camouflage = camuoflage camoflage samouflage ssamouflage scamouflage camoufllage cemouflage camouflege cimouflage camouflige 
fibrous = fibruos fibros fibrrous fibbrous ffibrous fiibrous fibroous fibrouss fibrouus 
sincerely = sinserely sinsserely sinscerely sincerrely sincerelly sincorely sinceroly sicerely sinccerely sinceerely 
hero = herro horo heero hhero heroo heroe haro hewro 
cafeteria = safeteria ssafeteria scafeteria cafeterria cafetteria cefeteria cafeterie cifeteria cafeterii cufeteria 
interior = interiar interrior interiorr intterior intorior iterior inteerior iinterior interiior innterior 
idiosyncrasy = idiasyncrasy idiosynsrasy idiosynssrasy idiosynscrasy idiosyncrrasy idiosyncresy idiosyncrisy idiosyncrusy 
crystal = srystal ssrystal scrystal crrystal crystall crysttal crystel crystil crystul 
failure = failurre faillure feilure fiilure fuilure failuro foilure 
fire = firre firo firee ffire fiire feire fiwre veire fira 
mire = mirre miro miree miire mmire meire miwre nmire mpire 
tire = tirre ttire tiro tiree tiire teire tiwre tira 
willful = wilful willlful willfull willfful wiillful willfuul 
powerful = powerrful powerfull poworful poweerful powerfful poowerful ppowerful powerfuul 
fiftieth = fifteith fifttieth fiftietth fiftioth fiftieeth ffiftieth fifftieth fiftiethh fiiftieth fiftiieth 
chili = shili sshili schili chilli cchili chhili chiili chilii cheili 
newspaper = newspaperr newspeper newspiper newspuper nowspaper newspapor newspoper 
jewelry = jewelrry jewellry jowelry jewolry jeewelry jeweelry jjewelry jewwelry 
solo = sollo soolo soloo ssolo soelo soloe colo scolo 
oppress = opress oppres opprress oppross oppreess ooppress opppress oppresss 
tomorrow = tomorow tomorrrow ttomorrow tommorrow toomorrow tomoorrow tomorroow 
does = doos ddoes doees dooes doess doec doesc doex 
shoes = shos shoees shhoes shooes sshoes shoess choes shoec 
maneuver = maneuverr maneufr meneuver mineuver muneuver manouver maneuvor maeuver 
usual = usuall usuel usuil usuul usuol usuaal usuael 
befriend = befreind befrriend bofriend befriond befried bbefriend befriendd beefriend befrieend beffriend 
studies = studeis sttudies studdies studiees studiies sstudies studiess stuudies studeies 
cough = cuogh cogh ssough scough ccough couggh coughh coough couugh coeugh 
requirement = rrequirement requirrement requirementt roquirement requiroment requiremont requiremet reequirement requireement requiremeent 
hopeless = hopeles hopeelss hopelless hopoless hopeloss hopeeless hopeleess hhopeless hoopeless 
careless = careles careelss cereless coreless sareless ssareless scareless carreless carelless 
deceive = decive deseive desseive desceive deceif doceive decoive deceivo decceive ddeceive 
receive = recive reseive resseive resceive rreceive receif roceive recoive receivo recceive 
offense = ofense offonse offenso offese offeense offensee offfense offennse ooffense 
consent = sonsent ssonsent sconsent consentt consont conset cosent cconsent conseent connsent 
content = sontent ssontent scontent conttent contentt contont contet cotent ccontent conteent 
contend = sontend ssontend scontend conttend contond conted cotend ccontend contendd conteend 
irrefutable = irefutable irrefutabel irrrefutable irrefutablle irrefuttable irrefuteble irrefutible irrefutuble irrofutable 
teachable = tachable teachabel teashable teasshable teaschable teachablle tteachable teechable teacheble teichable 
cocoa = socoa cosoa ssocoa cossoa scocoa coscoa cocoe cocoi cocou 
cocoanuts = socoanuts cosoanuts ssocoanuts cossoanuts scocoanuts coscoanuts cocoanutts cocoenuts cocoinuts cocounuts 
excel = exsel exssel exscel excell escel oxcel excol exccel eexcel exceel 
except = exsept exssept exscept exceptt escept oxcept excopt exccept eexcept exceept 
graduate = grraduate graduatte greduate graduete griduate graduite gruduate graduute graduato 
usual = usuall usuel usuil usuul usuol usuaal usuael 
appoint = apoint appointt eppoint ippoint uppoint appoit oppoint 
appendix = apendix eppendix ippendix uppendix appondix appedix oppendix 
crystallize = crystalize srystallize ssrystallize scrystallize crrystallize crystalllize crysttallize crystallise crystellize 
myth = mytth mythh mmyth myyth nmyth mpyth 
borrow = borow borrrow bborrow boorrow borroow borroww boerrow 
tomorrow = tomorow tomorrrow ttomorrow tommorrow toomorrow tomoorrow tomorroow 
unnecessary = unecessary unnecesary unnecessery unnecessory unnesessary unnessessary unnescessary unnecessarry unnecessiry 
unfounded = unfuonded unfonded unfoundod ufounded unfouded unfoundded unfoundedd unfoundeed unffounded unnfounded 
character = cheracter choracter sharacter charaster ssharacter charasster scharacter charascter charracter characterr 
characteristic = cheracteristic choracteristic sharacteristic charasteristic characteristis ssharacteristic charassteristic characteristiss scharacteristic charascteristic 
duet = duett duot dduet dueet duuet druet duat duit daet 
budgeting = budgetting bugeting budgoting budgetig bbudgeting buddgeting budgeeting budggeting budgetingg budgetiing 
bye = byo bbye byee byye bya byi byen 
dye = dyo ddye dyee dyye dya dyi dyen 
unlikely = unllikely unlikelly unlikoly ulikely unlikeely unliikely unlikkely unnlikely 
bravely = brravely bravelly brafly brevely brively bruvely bravoly brovely 
lettuce = letuce elttuce lettuse lettusse lettusce llettuce letttuce lottuce lettuco 
prejudice = prejudise prejudisse prejudisce prrejudice projudice prejudico prejudicce prejuddice preejudice prejudicee 
knowledge = knoweldge knowlledge knowlege knowlodge knowledgo knowleddge knowleedge knowledgee knowledgge kknowledge 
knives = knifs knivos knivees kniives kknives knnives knivess knivves kneives knivec 
ladybug = lladybug ledybug lidybug ludybug lodybug laadybug laedybug 
impatience = impateince impatiense impatiensse impatiensce impattience imatience impetience impitience imputience impationce 
inquire = inquirre inquiro iquire inquiree iinquire inquiire innquire inqquire inquuire 
sure = surre suro suree ssure suure scure suwre srure 
chrome = shrome sshrome schrome chrrome chromo cchrome chromee chhrome chromme chroome 
chasm = shasm sshasm schasm chesm chism chusm chosm 
scarcely = scercely scorcely ssarcely scarsely sssarcely scarssely sscarcely scarscely scarrcely scarcelly 
homely = homelly homoly homeely hhomely hommely hoomely homelyy hoemely homley 
height = hight heightt hoight heeight heigght hheight heighht heiight hieght 
heifer = hifer heiferr hoifer heifor heeifer heifeer heiffer hheifer heiifer 
invariable = invariabel inveriable invoriable invarriable invariablle invarieble inviriable invariible invuriable 
as = os aas aes ais aos aus eas ees eis eos 
voluntary = voluntery voluntory voluntarry volluntary volunttary voluntiry voluntury volutary 
contrary = contrery controry sontrary ssontrary scontrary contrrary contrarry conttrary contriry 
winnow = winow wiinnow winnnow winnoow wwinnow winnoww winnoew weinnow 
borrow = borow borrrow bborrow boorrow borroow borroww boerrow 
humidor = humidorr humiddor hhumidor humiidor hummidor humidoor huumidor humidoer humeidor 
exceptional = exceptianal exseptional exsseptional exsceptional exceptionall excepttional esceptional excepsional exceptionel exceptionil 
election = electian eelction elestion elesstion elesction ellection electtion elecsion olection eloction 
juice = juise juisse juisce juico juicce juicee juiice jjuice juuice jueice 
fruit = frruit fruitt fuit ffruit fruiit fruuit frueit fwruit 
laboratory = laborratory laboratorry llaboratory laborattory leboratory laboretory liboratory laboritory luboratory laborutory 
ivory = ivorry iivory ivoory ivvory ivoryy ivoery eivory ivowry ivery 
exterior = exteriar exterrior exteriorr extterior esterior oxterior extorior eexterior exteerior exteriior 
cafeteria = safeteria ssafeteria scafeteria cafeterria cafetteria cefeteria cafeterie cifeteria cafeterii cufeteria 
popcorn = popsorn popssorn popscorn popcorrn popccorn popcornn poopcorn popcoorn ppopcorn poppcorn 
pretty = prety prretty prettty protty preetty ppretty 
surmount = surmuont surmont surrmount surmountt surmout surmmount surmounnt surmoount ssurmount 
injury = injurry ijury iinjury injjury innjury injuury injuryy einjury injuwry 
juggle = jugle juggel jugglle jugglo jugglee jugggle jjuggle juuggle 
foggy = ffoggy fogggy fooggy foggyy foeggy veoggy fodggy fogdgy feggy 
few = fow feew ffew feww veew faw fiw fenw 
new = neew nnew neww naw niw nenw nuw naaw 
underdog = underrdog undordog uderdog undderdog underddog undeerdog underdogg unnderdog underdoog 
apple = aple appel applle epple ipple upple applo opple 
happy = hapy heppy huppy hoppy haappy haeppy haippy haoppy 
leisure = lisure elisure leisurre lleisure loisure leisuro leeisure leisuree leiisure 
pleasure = plasure pelasure pleasurre plleasure pleesure pleisure pleusure ploasure pleasuro 
illustration = ilustration illustratian illustrration illlustration illusttration illustrattion illustrasion illustretion illustrition 
education = educatian edusation edussation eduscation educattion educasion educetion educition educution oducation 
jockey = joskey josskey josckey jockoy jocckey jockeey jjockey jockkey joockey jockeyy 
motley = motely motlley mottley motloy motleey mmotley mootley motleyy 
dogged = doged doggod ddogged doggedd doggeed doggged doogged doegged dodgged 
craggy = cragy sraggy ssraggy crraggy creggy criggy cruggy croggy 
ambush = embush imbush umbush ombush aambush aembush aimbush 
dungeon = dungean dungoon dungeo dugeon ddungeon dungeeon dunggeon dunngeon dungeonn dungeoon 
luncheon = lunchean lunsheon lunssheon lunscheon lluncheon lunchoon luncheo lucheon lunccheon luncheeon 
budget = budgett buget budgot bbudget buddget budgeet budgget buudget brudget 
budgeting = budgetting bugeting budgoting budgetig bbudgeting buddgeting budgeeting budggeting budgetingg budgetiing 
serious = seriaus seriuos serios serrious sorious seerious seriious serioous sserious 
get = gett geet gget dget gat gaat gaet gaot 
when = whon whe wheen whhen whenn wwhen whan whin 
crusade = srusade ssrusade scrusade crrusade cusade crusede cruside crusude crusado 
survive = surrvive survif survivo survivee surviive ssurvive suurvive survvive survivve 
surmount = surmuont surmont surrmount surmountt surmout surmmount surmounnt surmoount ssurmount 
nigh = niggh nighh niigh nnigh nidgh ningh nagh negh 
thigh = tthigh thiggh thhigh thighh thiigh theigh thidgh thingh thagh 
innumerable = inumerable innumerabel innumerrable innumerablle innumereble innumerible innumeruble innumorable innumerablo 
teachable = tachable teachabel teashable teasshable teaschable teachablle tteachable teechable teacheble teichable 
sanctuary = sanctuery sanctuory sanstuary sansstuary sansctuary sanctuarry sancttuary senctuary sinctuary 
bedroom = bedrom bedrroom bodroom bbedroom beddroom beedroom bedroomm bedrooom 
lunchroom = lunchrom lunshroom lunsshroom lunschroom lunchrroom llunchroom luchroom luncchroom lunchhroom 
secretarial = secreterial secretorial sesretarial sessretarial sescretarial secrretarial secretarrial secretariall secrettarial 
parent = perent porent parrent parentt pirent purent paront paret 
doubt = duobt dobt doubtt doubbt ddoubt dooubt douubt doeubt dorubt 
debt = debtt dobt debbt ddebt deebt dabt dibt denbt 
subtle = subtel subtlle subttle subtlo subbtle subtlee ssubtle suubtle 
debt = debtt dobt debbt ddebt deebt dabt dibt denbt 
disguise = disguiso ddisguise disguisee disgguise diisguise disguiise dissguise disguisse disguuise deisguise 
inquire = inquirre inquiro iquire inquiree iinquire inquiire innquire inqquire inquuire 
adjust = adjustt edjust idjust udjust odjust aadjust aedjust 
handkerchief = handkercheif handkershief handkersshief handkerschief handkerrchief hendkerchief hindkerchief hundkerchief handkorchief handkerchiof 
studies = studeis sttudies studdies studiees studiies sstudies studiess stuudies studeies 
adjunct = adjunst adjunsst adjunsct adjunctt edjunct idjunct udjunct adjuct 
wholly = wholy whollly whholly whoolly wwholly whollyy whoelly 
who = whho whoo wwho whoe whe whon whou whuo wha 
whom = whhom whomm whoom wwhom whoem whonm whomp whem whoum 
whoever = whover whoeverr whoefr whoover whoevor whoeever whoeveer whhoever whooever 
who = whho whoo wwho whoe whe whon whou whuo wha 
whom = whhom whomm whoom wwhom whoem whonm whomp whem whoum 
sheik = shik shoik sheeik shheik sheiik sheikk ssheik shiek cheik 
receiver = reciver reseiver resseiver resceiver rreceiver receiverr receifr roceiver recoiver receivor 
ceiling = ciling seiling sseiling sceiling ceilling ceilig cceiling ceeiling ceilingg ceiiling 
receiver = reciver reseiver resseiver resceiver rreceiver receiverr receifr roceiver recoiver receivor 
metaphor = metaphorr mettaphor metephor metiphor metuphor motaphor metophor 
spherical = spherisal spherissal spheriscal spherrical sphericall sphericel sphericil sphericul sphorical 
conceit = concit sonceit conseit ssonceit consseit sconceit consceit conceitt concoit coceit 
receiver = reciver reseiver resseiver resceiver rreceiver receiverr receifr roceiver recoiver receivor 
synopsis = synopsiis synnopsis synoopsis synoppsis ssynopsis synopssis synopsiss syynopsis synoepsis synopseis 
analysis = anallysis enalysis anelysis inalysis anilysis unalysis anulysis aalysis 
policeman = poliseman polisseman polisceman polliceman policemin policemun policoman policema policemon 
unique = uniquo uique uniquee uniique unnique uniqque uunique uniquue uneique runique 
conceive = concive sonceive conseive ssonceive consseive sconceive consceive conceif concoive conceivo 
deceive = decive deseive desseive desceive deceif doceive decoive deceivo decceive ddeceive 
receive = recive reseive resseive resceive rreceive receif roceive recoive receivo recceive 
orchid = orshid orsshid orschid orrchid orcchid orchidd orchhid orchiid oorchid 
chasm = shasm sshasm schasm chesm chism chusm chosm 
myself = mysellf mysolf myseelf myselff mmyself mysself myyself myslef mycelf 
prairie = prairei prrairie prairrie preirie priirie pruirie prairio proirie 
treaties = treateis traties trreaties ttreaties treatties treeties treities treuties troaties treatios 
handicapped = handicaped handisapped handissapped handiscapped hendicapped handicepped hindicapped handicipped hundicapped handicupped 
clapped = claped sslapped sclapped cllapped clepped clupped clappod claapped 
eye = oye eyo eeye eyee eyye eya iye eyi enye eyen 
hobbies = hobies hobbeis hobbios hobbbies hobbiees hhobbies hobbiies hoobbies hobbiess 
treaties = treateis traties trreaties ttreaties treatties treeties treities treuties troaties treatios 
preschool = preschol presshool pressshool presschool prreschool preschooll proschool prescchool preeschool preschhool 
schism = sshism ssshism sschism scchism schhism schiism schismm schissm scheism 
personal = perrsonal personall personel personil personul porsonal persoal personol 
thirtieth = thirteith thirrtieth tthirtieth thirttieth thirtietth thirtioth thirtieeth thhirtieth thirtiethh thiirtieth 
fiftieth = fifteith fifttieth fiftietth fiftioth fiftieeth ffiftieth fifftieth fiftiethh fiiftieth fiftiieth 
fortunately = forrtunately fortunatelly forttunately fortunattely fortunetely fortunitely fortunutely fortunatoly fortuately 
towel = towell ttowel towol toweel toowel towwel toewel towle 
grows = grrows ggrows groows growss growws groews growc growsc 
understand = underrstand understtand understend understind understund undorstand understad uderstand 
can't = san't ssan't scan't can'tt cen't cin't cun't ca't 
won't = won'tt wo't wonn't woon't wwon't woen't wen't woun't 
excite = exsite exssite exscite excitte escite oxcite excito exccite eexcite excitee 
except = exsept exssept exscept exceptt escept oxcept excopt exccept eexcept exceept 
excel = exsel exssel exscel excell escel oxcel excol exccel eexcel exceel 
miniature = miniaturre miniatture minieture miniiture miniuture miniaturo miiature minioture 
chili = shili sshili schili chilli cchili chhili chiili chilii cheili 
salmon = sallmon selmon silmon sulmon salmo solmon saalmon 
palm = pallm pelm pilm pulm polm paalm paelm 
calm = salm ssalm scalm callm celm cilm culm colm 
aversion = aversian averrsion afrsion eversion iversion uversion avorsion aversio 
cushion = cushian sushion ssushion scushion cushio ccushion cushhion cushiion cushionn cushioon 
library = librery librory librrary librarry llibrary libriry librury 
paradoxical = peradoxical poradoxical paradoxisal paradoxissal paradoxiscal parradoxical paradoxicall paredoxical paradoxicel 
comma = somma ssomma scomma comme commi commu commo 
summer = sumer summerr summor summeer summmer ssummer suummer summar 
immune = imune immuno immue immunee iimmune immmune immunne immuune eimmune 
commune = comune sommune ssommune scommune communo commue ccommune communee commmune 
serviceable = servicable serviceabel serviseable servisseable servisceable serrviceable serviceablle serviceeble serviceible serviceuble 
poignant = poignantt poignent poignint poignunt poignat poignont poignaant 
poignancy = poignansy poignanssy poignanscy poignency poignincy poignuncy poignacy poignoncy 
dilemma = dilema dielmma dillemma dilemme dilemmi dilemmu dilomma dilemmo 
mammal = mamal mammall memmal mammel mimmal mammil mummal mammul 
chivalry = shivalry sshivalry schivalry chivalrry chivallry chivelry chivilry chivulry 
roommate = roomate rommate rroommate roommatte roommete roommite roommute roommato 
mummy = mumy mmummy mummmy muummy mummyy nmummy munmmy mumnmy mpummy 
deficient = deficeint defisient defissient defiscient deficientt doficient deficiont deficiet deficcient ddeficient 
efficient = eficient efficeint effisient effissient effiscient efficientt officient efficiont efficiet efficcient 
counterfeit = cuonterfeit conterfeit counterfit sounterfeit ssounterfeit scounterfeit counterrfeit countterfeit counterfeitt countorfeit 
county = cuonty conty sounty ssounty scounty countty couty ccounty counnty coounty 
sanctify = sanstify sansstify sansctify sancttify senctify sinctify sunctify sactify 
squirrel = squirel squirrrel squirrell squirrol squirreel squiirrel sqquirrel 
squirm = squirrm squiirm squirmm sqquirm ssquirm squuirm squeirm cquirm 
squirt = squirrt squirtt squiirt sqquirt ssquirt squuirt squeirt cquirt 
mercurial = mersurial merssurial merscurial merrcurial mercurrial mercuriall mercuriel mercuriil mercuriul morcurial 
chili = shili sshili schili chilli cchili chhili chiili chilii cheili 
hyena = hyene hyeni hyenu hyona hyea hyeno hyenaa 
dehydration = dehydratian dehydrration dehydrattion dehydrasion dehydretion dehydrition dehydrution dohydration dehydratio 
visual = visuall visuel visuil visuul visuol visuaal visuael 
usual = usuall usuel usuil usuul usuol usuaal usuael 
harmonic = hermonic hormonic harmonis harmoniss harmonisc harrmonic hirmonic hurmonic harmoic 
barbaric = berbaric barberic borbaric barboric barbaris barbariss barbarisc barrbaric barbarric 
partake = pertake portake parrtake parttake parteke pirtake partike purtake partuke 
barbaric = berbaric barberic borbaric barboric barbaris barbariss barbarisc barrbaric barbarric 
shoe = sho shoee shhoe shooe sshoe choe schoe zhoe 
shoes = shos shoees shhoes shooes sshoes shoess choes shoec 
anachronism = anashronism anasshronism anaschronism anachrronism enachronism anechronism inachronism anichronism unachronism anuchronism 
chasm = shasm sshasm schasm chesm chism chusm chosm 
boyhood = boyhod bboyhood boyhoodd boyhhood booyhood boyhoood boyyhood boeyhood boyhoeod 
acquit = asquit assquit ascquit acquitt ecquit icquit ucquit ocquit 
acquaint = asquaint assquaint ascquaint acquaintt ecquaint acqueint icquaint acquiint ucquaint acquuint 
notebook = notebok nottebook notobook notebbook noteebook notebookk nnotebook nootebook noteboook 
pamphlet = pamphelt pamphllet pamphlett pamhlet pemphlet pimphlet pumphlet pamphlot 
elephant = eelphant ellephant elephantt elephent elephint elephunt olephant elophant elephat 
calligraphy = caligraphy salligraphy ssalligraphy scalligraphy calligrraphy callligraphy celligraphy calligrephy cilligraphy 
metaphor = metaphorr mettaphor metephor metiphor metuphor motaphor metophor 
require = rrequire requirre roquire requiro reequire requiree requiire reqquire 
inquire = inquirre inquiro iquire inquiree iinquire inquiire innquire inqquire inquuire 
cue = ssue scue cuo ccue cuee cuue crue cua cui cae 
two = ttwo twoo twwo twoe twe twon twou twuo twa 
of = oof oef ove ef onf ouf uof af uf 
sixth = sixtth sixthh siixth ssixth sixxth seixth cixth scixth 
chef = shef sshef schef chof cchef cheef cheff chhef cheve chaf 
chivalry = shivalry sshivalry schivalry chivalrry chivallry chivelry chivilry chivulry 
chute = shute sshute schute chutte chuto cchute chutee chhute chuute 
chivalry = shivalry sshivalry schivalry chivalrry chivallry chivelry chivilry chivulry 
chaise = shaise sshaise schaise cheise chiise chuise chaiso choise 
chivalry = shivalry sshivalry schivalry chivalrry chivallry chivelry chivilry chivulry 
sideways = sideweys sidewiys sidewuys sidoways sidewoys sidewaays sidewaeys 
friday = frriday fridey fridiy friduy fridoy fridaay fridaey 
yesterday = yesterrday yestterday yesterdey yesterdiy yesterduy yosterday yestorday yesterdoy 
brochure = broshure brosshure broschure brrochure brochurre brochuro bbrochure brocchure brochuree brochhure 
chivalry = shivalry sshivalry schivalry chivalrry chivallry chivelry chivilry chivulry 
machine = mashine masshine maschine mechine michine muchine machino machie 
chivalry = shivalry sshivalry schivalry chivalrry chivallry chivelry chivilry chivulry 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
accumulate = acumulate ascumulate acsumulate asscumulate acssumulate asccumulate acscumulate accumullate accumulatte eccumulate 
thirty = thirrty tthirty thirtty thhirty thiirty thirtyy theirty 
wolf = wollf wolff woolf wwolf woelf wolve welf wonlf woulf 
woman = womin womun woma womon womaan womaen womain womaon 
lieu = leiu llieu liou lieeu liieu lieuu leieu lieru liau 
valiant = valliant valiantt veliant valient viliant valiint vuliant valiunt valiat 
civilian = sivilian ssivilian scivilian civillian civilien civiliin civiliun civilia 
pavilion = pavilian pavillion pevilion pivilion puvilion pavilio povilion 
familiar = familier familior familiarr familliar femiliar fimiliar familiir fumiliar familiur 
alien = alein allien elien ilien ulien alion alie olien 
roominess = rominess roomines rroominess roominoss roomiess roomineess roomiiness roomminess roominness rooominess 
behavior = behaviar behaviorr behevior behivior behuvior bohavior behovior 
copier = copeir sopier ssopier scopier copierr copior ccopier copieer copiier coopier 
mercurial = mersurial merssurial merscurial merrcurial mercurrial mercuriall mercuriel mercuriil mercuriul morcurial 
junior = juniar juniorr juior juniior jjunior junnior junioor juunior junioer 
appreciate = apreciate appresiate appressiate appresciate apprreciate appreciatte eppreciate appreciete ippreciate appreciite 
easier = easeir asier easierr eesier eisier eusier oasier easior 
copier = copeir sopier ssopier scopier copierr copior ccopier copieer copiier coopier 
christmas = shristmas sshristmas schristmas chrristmas christtmas christmes christmis christmus 
bustle = bustel bustlle busttle bustlo bbustle bustlee busstle buustle 
medallion = medalion medallian medalllion medellion medillion medullion modallion medallio 
always = allways elways alweys ilways alwiys ulways alwuys 
genius = gonius geius geenius ggenius geniius gennius geniuss geniuus geneius geniuc 
seashore = sashore seashorre seeshore seishore seushore soashore seashoro seoshore 
assignment = asignment assignmentt assigment essignment issignment ussignment assignmont assignmet 
utopia = uttopia utopie utopii utopiu utopio utopiaa utopiae 
easier = easeir asier easierr eesier eisier eusier oasier easior 
aviator = aviatorr aviattor eviator avietor iviator aviitor uviator aviutor 
alien = alein allien elien ilien ulien alion alie olien 
liaison = lliaison lieison liiison liuison liaiso lioison liaaison 
easier = easeir asier easierr eesier eisier eusier oasier easior 
radioactive = radiaactive radioastive radioasstive radioasctive rradioactive radioacttive radioactif redioactive radioective ridioactive 
chili = shili sshili schili chilli cchili chhili chiili chilii cheili 
dissociate = disociate dissosiate dissossiate dissosciate dissociatte dissociete dissociite dissociute dissociato 
chili = shili sshili schili chilli cchili chhili chiili chilii cheili 
testimonial = testimoniall ttestimonial testtimonial testimoniel testimoniil testimoniul tostimonial testimoial 
mercurial = mersurial merssurial merscurial merrcurial mercurrial mercuriall mercuriel mercuriil mercuriul morcurial 
audience = audeince audiense audiensse audiensce eudience iudience uudience audionce audienco audiece 
roominess = rominess roomines rroominess roominoss roomiess roomineess roomiiness roomminess roominness rooominess 
depreciation = depreciatian depresiation depressiation depresciation deprreciation depreciattion depreciasion deprecietion depreciition depreciution 
fiftieth = fifteith fifttieth fiftietth fiftioth fiftieeth ffiftieth fifftieth fiftiethh fiiftieth fiftiieth 
associate = asociate assosiate assossiate assosciate associatte essociate associete issociate associite ussociate 
miniature = miniaturre miniatture minieture miniiture miniuture miniaturo miiature minioture 
abbreviate = abreviate abbrreviate abbreviatte ebbreviate abbreviete ibbreviate abbreviite ubbreviate abbreviute abbroviate 
aviator = aviatorr aviattor eviator avietor iviator aviitor uviator aviutor 
cruise = sruise ssruise scruise crruise cuise cruiso ccruise cruisee cruiise 
fruit = frruit fruitt fuit ffruit fruiit fruuit frueit fwruit 
obedience = obedeince obediense obediensse obediensce obodience obedionce obedienco obediece obbedience obediencce 
alien = alein allien elien ilien ulien alion alie olien 
encyclopedia = ensyclopedia encyslopedia enssyclopedia encysslopedia enscyclopedia encysclopedia encycllopedia encyclopedie encyclopedii encyclopediu 
mercurial = mersurial merssurial merscurial merrcurial mercurrial mercuriall mercuriel mercuriil mercuriul morcurial 
expediency = expedeincy expediensy expedienssy expedienscy espediency oxpediency expodiency expedioncy expediecy expedienccy 
alien = alein allien elien ilien ulien alion alie olien 
juicy = juisy juissy juiscy juiccy juiicy jjuicy juuicy juicyy jueicy jruicy 
fruit = frruit fruitt fuit ffruit fruiit fruuit frueit fwruit 
poultry = puoltry poltry poultrry poulltry poulttry pooultry ppoultry 
shoulder = shuolder sholder shoulderr shoullder shouldor shouldder shouldeer shhoulder shooulder 
what = whatt whut whot whaat whaet whait whaot whaut wheet 
jeopardize = jeapardize jeoperdize jeopordize jeoparrdize jeopardise jeopirdize jeopurdize joopardize jeopardizo 
holiday = holliday holidey holidiy holiduy holidoy holidaay holidaey 
yesterday = yesterrday yestterday yesterdey yesterdiy yesterduy yosterday yestorday yesterdoy 
railway = rrailway raillway reilway railwey riilway railwiy ruilway railwuy 
yesterday = yesterrday yestterday yesterdey yesterdiy yesterduy yosterday yestorday yesterdoy 
cookie = cokie cookei sookie ssookie scookie cookio ccookie cookiee cookiie cookkie 
prairie = prairei prrairie prairrie preirie priirie pruirie prairio proirie 
doesn't = dosn't doesn'tt doosn't ddoesn't doeesn't doesnn't dooesn't doessn't 
does = doos ddoes doees dooes doess doec doesc doex 
questionnaire = questionaire questiannaire questionnairre questtionnaire quessionnaire questionneire questionniire questionnuire quostionnaire questionnairo 
hair = hairr hiir huir hoir haair haeir haiir haoir 
fluorescent = fluoressent fluoresssent fluoresscent fluorrescent flluorescent fluorescentt fluoroscent fluorescont fluorescet fluoresccent 
scent = ssent sssent sscent scentt scont scet sccent sceent scennt 
audible = audibel audiblle eudible iudible uudible audiblo oudible 
shadow = shedow shidow shudow shodow shaadow shaedow shaidow 
winnow = winow wiinnow winnnow winnoow wwinnow winnoww winnoew weinnow 
elbow = ellbow olbow elbbow eelbow elboow elboww elboew lebow albow 
winnow = winow wiinnow winnnow winnoow wwinnow winnoww winnoew weinnow 
fallow = falow falllow fillow fullow faallow faellow faillow 
winnow = winow wiinnow winnnow winnoow wwinnow winnoww winnoew weinnow 
grandfather = grrandfather grandfatherr grandfatther grendfather grandfether grindfather grandfither grundfather grandfuther grandfathor 
sleight = selight slleight sleightt sloight sleeight sleigght sleighht sleiight ssleight 
height = hight heightt hoight heeight heigght hheight heighht heiight hieght 
employ = emplloy emloy omploy eemploy emmploy emplooy empploy employy emploey 
employment = emplloyment employmentt emloyment omployment employmont employmet eemployment employmeent emmployment 
goes = gos goos goees ggoes gooes goess goec goesc 
sleuth = seluth slleuth sleutth slouth sleeuth sleuthh ssleuth sleuuth 
maneuver = maneuverr maneufr meneuver mineuver muneuver manouver maneuvor maeuver 
neutral = neutrral neutrall neuttral neutrel neutril neutrul noutral neutrol 
maneuver = maneuverr maneufr meneuver mineuver muneuver manouver maneuvor maeuver 
manageable = managable manageabel manageablle menageable manegeable manageeble minageable manigeable manageible munageable 
extravagant = extrravagant exttravagant extravagantt estravagant extrevagant extravegant extravagent extrivagant extravigant extravagint 
their = thir theirr ttheir thoir theeir thheir theiir thier 
surgeon = surgean surrgeon surgoon surgeo surgeeon surggeon surgeonn surgeoon ssurgeon 
dungeon = dungean dungoon dungeo dugeon ddungeon dungeeon dunggeon dunngeon dungeonn dungeoon 
police = polise polisse polisce pollice polico policce policee poliice poolice 
unique = uniquo uique uniquee uniique unnique uniqque uunique uniquue uneique runique 
heiress = heires hiress heirress hoiress heiross heeiress heireess hheiress heiiress 
accompanied = acompanied accompaneid ascompanied acsompanied asscompanied acssompanied asccompanied acscompanied accomanied eccompanied 
prairie = prairei prrairie prairrie preirie priirie pruirie prairio proirie 
czar = czer czor szar sszar sczar czarr csar czir czur 
yacht = yasht yassht yascht yachtt yecht yicht yucht yocht 
it's = itt's iit's it'ss eit's it'c it'sc it'z int's 
raccoon = racoon raccon rascoon racsoon rasscoon racssoon rasccoon racscoon rraccoon reccoon 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
stucco = stuco stusco stucso stussco stucsso stuscco stucsco sttucco stuccco 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
account = acount accuont accont ascount acsount asscount acssount asccount acscount accountt 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
soccer = socer soscer socser sosscer socsser sosccer socscer soccerr soccor socccer 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
occur = ocur oscur ocsur osscur ocssur osccur ocscur occurr occcur 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
accuse = acuse ascuse acsuse asscuse acssuse asccuse acscuse eccuse iccuse uccuse 
accost = acost ascost acsost asscost acssost asccost acscost accostt eccost iccost 
psalm = psallm pselm psilm psulm psolm psaalm psaelm 
don't = don'tt do't ddon't donn't doon't doen't den't doun't 
laugh = llaugh leugh liugh luugh laaugh laeugh laiugh 
campaign = sampaign ssampaign scampaign camaign cempaign campeign cimpaign campiign cumpaign campuign 
assignment = asignment assignmentt assigment essignment issignment ussignment assignmont assignmet 
assign = asign essign issign ussign ossign aassign aessign 
assignment = asignment assignmentt assigment essignment issignment ussignment assignmont assignmet 
cologne = sologne ssologne scologne collogne cologno ccologne colognee cologgne colognne 
scene = ssene sssene sscene sceno scee sccene sceene scenee scenne 
scent = ssent sssent sscent scentt scont scet sccent sceent scennt 
science = sceince ssience sciense sssience sciensse sscience sciensce scionce scienco sciece 
scent = ssent sssent sscent scentt scont scet sccent sceent scennt 
treatment = tratment trreatment ttreatment treattment treatmentt treetment treitment treutment troatment treatmont 
erroneous = eroneous erroneuos erroneos erroneaus errroneous orroneous erronoous erroeous eerroneous 
transcript = transsript transssript transscript trranscript transcrript ttranscript transcriptt trenscript trinscript trunscript 
street = stret strreet sttreet streett stroet streot streeet sstreet 
destroy = destrroy desttroy dostroy ddestroy deestroy destrooy desstroy destroyy 
mistreat = mistrat mistrreat misttreat mistreatt mistreet mistreit mistreut mistroat 
pageant = pagant pageantt pegeant pageent pigeant pageint pugeant pageunt pagoant pageat 
manageable = managable manageabel manageablle menageable manegeable manageeble minageable manigeable manageible munageable 
stranger = strranger strangerr sttranger strenger strunger strangor strager straanger 
strenuous = strenuuos strenuos strrenuous sttrenuous stronuous streuous streenuous strennuous strenuoous 
sequel = sequell soquel sequol seequel sequeel seqquel ssequel sequuel sequle 
sequence = sequense sequensse sequensce soquence sequonce sequenco sequece sequencce seequence sequeence 
sequel = sequell soquel sequol seequel sequeel seqquel ssequel sequuel sequle 
strength = strrength sttrength strengtth strongth stregth streength strenggth strengthh strenngth 
avenue = afnue evenue ivenue uvenue avonue avenuo aveue ovenue 
statue = sttatue stattue stetue stitue stutue statuo stotue 
artificial = ertificial ortificial artifisial artifissial artifiscial arrtificial artificiall arttificial artificiel 
though = thuogh thogh tthough thouggh thhough thoughh thoough thouugh thoeugh 
quote = quotte quoto quotee quoote qquote quuote qoute qote quoete 
vengeance = vengance vengeanse vengeansse vengeansce fngeance vengeence vengeince vengeunce vongeance vengoance 
pageant = pagant pageantt pegeant pageent pigeant pageint pugeant pageunt pagoant pageat 
adequate = adequatte edequate adequete idequate adequite udequate adequute adoquate adequato 
shrewd = shrrewd shrowd shrewdd shreewd shhrewd sshrewd shrewwd chrewd 
newspaper = newspaperr newspeper newspiper newspuper nowspaper newspapor newspoper 
jewelry = jewelrry jewellry jowelry jewolry jeewelry jeweelry jjewelry jewwelry 
quarantine = querantine quorantine quarrantine quaranttine quarentine quirantine quarintine quurantine quaruntine 
imbue = imbuo imbbue imbuee iimbue immbue imbuue eimbue inmbue impbue imbrue 
shrewd = shrrewd shrowd shrewdd shreewd shhrewd sshrewd shrewwd chrewd 
sugar = suger sugor sugarr sugir sugur 
sure = surre suro suree ssure suure scure suwre srure 
surely = surrely surelly suroly sureely ssurely suurely surelyy surley 
sure = surre suro suree ssure suure scure suwre srure 
extension = extensian exttension estension oxtension extonsion extesion extensio eextension exteension extensiion 
sure = surre suro suree ssure suure scure suwre srure 
value = vallue velue vilue vulue valuo volue vaalue 
antique = anttique entique intique untique antiquo atique ontique 
oblique = obllique obliquo obblique obliquee obliique ooblique obliqque obliquue oeblique 
argue = ergue orgue arrgue irgue urgue arguo 
guess = gues guoss gueess gguess guesss guuess guecs guesc 
quench = quensh quenssh quensch quonch quech quencch queench quenchh quennch qquench 
oatmeal = oatmal oatmeall oattmeal oetmeal oatmeel oitmeal oatmeil outmeal oatmeul oatmoal 
factual = fastual fasstual fasctual factuall facttual fectual factuel fictual factuil fuctual 
queen = quen quoen queon quee queeen queenn qqueen quueen qrueen 
they're = they'rre tthey're thoy're they'ro theey're they'ree thhey're theyy're 
quack = quask quassk quasck queck quuck quock quaack quaeck 
lieutenant = leiutenant llieutenant lieuttenant lieutenantt lieutenent lieutenint lieutenunt lioutenant lieutonant lieutenat 
handsome = hendsome hindsome hundsome handsomo hadsome hondsome haandsome 
landslide = llandslide landsllide lendslide lindslide lundslide landslido ladslide londslide 
feud = foud feudd feeud ffeud feuud ferud veeud faud fiud fead 
session = sesion sessian sossion sessio seession sessiion sessionn sessioon ssession sesssion 
submission = submision submissian submissio subbmission submiission submissiion submmission submissionn submissioon ssubmission 
issuing = isuing issuig issuingg iissuing issuiing issuinng isssuing issuuing eissuing 
submission = submision submissian submissio subbmission submiission submissiion submmission submissionn submissioon ssubmission 
expression = expresion expressian exprression espression oxpression exprossion expressio eexpression expreession expressiion 
issue = isue issuo issuee iissue isssue issuue eissue icsue iscue 
submission = submision submissian submissio subbmission submiission submissiion submmission submissionn submissioon ssubmission 
busy = bbusy bussy buusy busyy bucy buscy brusy buzy basy 
income = insome inssome inscome incomo icome inccome incomee iincome incomme inncome 
grandmother = grrandmother grandmotherr grandmotther grendmother grindmother grundmother grandmothor gradmother 
instruct = instrust instrusst instrusct instrruct insttruct instructt instuct istruct instrucct iinstruct 
disbursement = disburrsement disbursementt disbursoment disbursemont disbursemet disbbursement ddisbursement disburseement disbursemeent diisbursement 
basketball = basketbal basketballl baskettball besketball basketbell bisketball basketbill busketball basketbull 
construct = sonstruct construst ssonstruct construsst sconstruct construsct constrruct consttruct constructt constuct 
receipt = recipt reseipt resseipt resceipt rreceipt receiptt roceipt recoipt recceipt reeceipt 
playground = playgruond playgrond playgrround pllayground pleyground pliyground pluyground playgroud 
grandfather = grrandfather grandfatherr grandfatther grendfather grandfether grindfather grandfither grundfather grandfuther grandfathor 
ghost = ghostt gghost ghhost ghoost ghosst ghoest ghoct ghosct 
ghetto = gheto ghettto ghotto gheetto gghetto ghhetto ghettoo 
acknowledgment = acknoweldgment asknowledgment assknowledgment ascknowledgment acknowlledgment acknowledgmentt acknowlegment ecknowledgment icknowledgment ucknowledgment 
bondage = bondege bondige bonduge bondago bodage bondoge bondaage 
image = imege imige imuge imoge imaage imaege imaige 
naive = neive niive nuive naivo noive naaive naeive 
quite = quitte quito quitee quiite qquite quuite queite qruite quita 
inquire = inquirre inquiro iquire inquiree iinquire inquiire innquire inqquire inquuire 
quiet = queit quiett quiot quieet quiiet qquiet quuiet queiet qruiet 
beguile = beguiel beguille boguile beguilo bbeguile beeguile beguilee begguile beguiile 
petite = pettite petitte potite petito peetite petitee petiite ppetite 
antique = anttique entique intique untique antiquo atique ontique 
fatigue = fattigue fetigue fitigue futigue fatiguo fotigue faatigue 
clique = slique sslique sclique cllique cliquo cclique cliquee cliique cliqque 
grotesque = grrotesque grottesque grotosque grotesquo groteesque grotesquee ggrotesque grootesque grotesqque 
plaque = pllaque pleque plique pluque plaquo ploque plaaque 
judicious = judiciaus judiciuos judicios judisious judissious judiscious judiccious juddicious judiicious judiciious 
malicious = maliciaus maliciuos malicios malisious malissious maliscious mallicious melicious milicious mulicious 
capricious = capriciaus capriciuos capricios sapricious caprisious ssapricious caprissious scapricious capriscious caprricious 
cherries = cheries cherreis ssherries scherries cherrries chorries cherrios ccherries cheerries 
studies = studeis sttudies studdies studiees studiies sstudies studiess stuudies studeies 
apogee = apoge epogee ipogee upogee apogoe apogeo opogee 
virtue = virrtue virttue virtuo virtuee viirtue virtuue vvirtue veirtue 
silhouette = silhouete silhuoette silhoette sillhouette silhouettte silhouotte silhouetto silhoueette silhouettee 
ivory = ivorry iivory ivoory ivvory ivoryy ivoery eivory ivowry ivery 
biscuit = bissuit bisssuit bisscuit biscuitt bbiscuit bisccuit biiscuit biscuiit 
piece = peice piese piesse piesce pioce pieco piecce pieece piecee piiece 
noticeable = noticable noticeabel notiseable notisseable notisceable noticeablle notticeable noticeeble noticeible noticeuble 
pageant = pagant pageantt pegeant pageent pigeant pageint pugeant pageunt pagoant pageat 
hygiene = hygeine hygione hygieno hygiee hygieene hygienee hyggiene hhygiene hygiiene hygienne 
especially = especialy espesially espessially espescially especiallly especielly especiilly especiully ospecially 
banquet = banquett benquet binquet bunquet banquot baquet bonquet 
sequel = sequell soquel sequol seequel sequeel seqquel ssequel sequuel sequle 
subsequent = subsequentt subsoquent subsequont subsequet subbsequent subseequent subsequeent subsequennt subseqquent ssubsequent 
sequel = sequell soquel sequol seequel sequeel seqquel ssequel sequuel sequle 
delinquent = dellinquent delinquentt dolinquent delinquont delinquet deliquent ddelinquent deelinquent delinqueent deliinquent 
sequel = sequell soquel sequol seequel sequeel seqquel ssequel sequuel sequle 
board = boerd boord boarrd boird bourd 
hoarse = hoerse hoorse hoarrse hoirse hourse hoarso 
coarse = coerse coorse soarse ssoarse scoarse coarrse coirse coarso 
equal = equall equel equil equul oqual equol equaal 
piquant = piquantt piquent piquint piquunt piquat piquont piquaant 
manuscript = manussript manusssript manusscript manuscrript manuscriptt menuscript minuscript munuscript mauscript 
bury = burry bbury buury buryy buwry brury bary bunry 
nondescript = nondessript nondesssript nondesscript nondescrript nondescriptt nondoscript nodescript nondesccript nonddescript nondeescript 
grandfather = grrandfather grandfatherr grandfatther grendfather grandfether grindfather grandfither grundfather grandfuther grandfathor 
liquid = lliquid liquidd liiquid liquiid liqquid liquuid leiquid liqueid liqruid 
guitar = guiter guitor guitarr guittar guitir guitur 
quixotic = quixotis quixotiss quixotisc quixottic quixoticc quiixotic quixotiic quixootic qquixotic 
equilibrium = equilibrrium equillibrium oquilibrium equilibbrium eequilibrium equiilibrium equiliibrium equilibriium equilibriumm 
biscuit = bissuit bisssuit bisscuit biscuitt bbiscuit bisccuit biiscuit biscuiit 
surfeit = surfit surrfeit surfeitt surfoit surfeeit surffeit surfeiit ssurfeit 
foreign = forign forreign foroign foreeign fforeign foreiggn foreiign foreignn fooreign 
ocean = ocan osean ossean oscean oceen ocein oceun ocoan ocea 
pageant = pagant pageantt pegeant pageent pigeant pageint pugeant pageunt pagoant pageat 
impatient = impateint impattient impatientt imatient impetient impitient imputient impationt impatiet 
impatience = impateince impatiense impatiensse impatiensce impattience imatience impetience impitience imputience impationce 
says = seys siys suys soys saays saeys saiys 
goldfish = golldfish golddfish goldffish ggoldfish goldfishh goldfiish gooldfish goldfissh goeldfish 
splendid = spelndid spllendid splondid spledid splenddid splendidd spleendid splendiid splenndid 
splinter = splinterr spllinter splintter splintor spliter splinteer spliinter splinnter spplinter 
awful = awfull ewful iwful uwful owful aawful aewful 
waltz = walltz walttz walts weltz wiltz wultz woltz 
answer = answerr enswer inswer unswer answor aswer onswer 
island = islland islend islind islund islad islond islaand 
routine = ruotine rotine rroutine routtine routino routie routinee routiine routinne rooutine 
roulette = roulete ruolette rolette roueltte rroulette roullette roulettte roulotte rouletto 
asphalt = asphallt asphaltt esphalt asphelt isphalt asphilt usphalt asphult 
basketball = basketbal basketballl baskettball besketball basketbell bisketball basketbill busketball basketbull 
volleyball = voleyball volleybal volelyball vollleyball volleyballl volleybell volleybill volleybull 
basketball = basketbal basketballl baskettball besketball basketbell bisketball basketbill busketball basketbull 
sidewalk = sidewallk sidewelk sidewilk sidewulk sidowalk sidewolk sidewaalk 
basketball = basketbal basketballl baskettball besketball basketbell bisketball basketbill busketball basketbull 
friend = freind frriend friond friendd frieend ffriend friiend friennd freiend 
befriend = befreind befrriend bofriend befriond befried bbefriend befriendd beefriend befrieend beffriend 
precious = preciaus preciuos precios presious pressious prescious prrecious procious preccious preecious 
judicious = judiciaus judiciuos judicios judisious judissious judiscious judiccious juddicious judiicious judiciious 
forked = forrked forkod forkedd forkeed fforked forkked foorked foerked fowrked 
zipped = ziped zippod zippedd zippeed ziipped zippped zzipped zeipped zippad 
pieced = peiced piesed piessed piesced pioced piecod piecced piecedd pieeced pieceed 
mopped = moppod moppedd moppeed mmopped moopped moppped moepped nmopped mpopped 
guide = guido guidde guidee gguide guiide guuide gueide gruide dguide guida 
acquire = asquire assquire ascquire acquirre ecquire icquire ucquire acquiro 
women = womon wome womeen wommen womenn woomen wwomen woemen wonmen wompen 
headquarters = hadquarters headquerters headquorters headquarrters headquarterrs headquartters heedquarters heidquarters headquirters 
rhythm = rrhythm rhytthm rhhythm rhythhm rhythmm rhyythm wrhythm rhythnm 
monologue = monollogue monologuo moologue monologuee monologgue mmonologue monnologue moonologue monoologue 
bicycle = bicycel bisycle bicysle bissycle bicyssle biscycle bicyscle bicyclle bicyclo bbicycle 
synopsis = synopsiis synnopsis synoopsis synoppsis ssynopsis synopssis synopsiss syynopsis synoepsis synopseis 
larynx = lerynx lorynx larrynx llarynx lirynx lurynx 
synopsis = synopsiis synnopsis synoopsis synoppsis ssynopsis synopssis synopsiss syynopsis synoepsis synopseis 
gymnasium = gymnesium gymnisium gymnusium gymnosium gymnaasium gymnaesium gymnaisium 
synopsis = synopsiis synnopsis synoopsis synoppsis ssynopsis synopssis synopsiss syynopsis synoepsis synopseis 
hosiery = hoseiry hosierry hosiory hosieery hhosiery hosiiery hoosiery hossiery hosieryy 
glacier = glaceir glasier glascier glacierr gllacier glecier glicier glucier glacior 
aerial = aerrial aeriall eerial aeriel ierial aeriil uerial aeriul aorial 
autumn = auttumn eutumn iutumn uutumn outumn aautumn aeutumn 
joyous = joyuos joyos jjoyous jooyous joyoous joyouss joyouus joyyous joeyous joyoeus 
throughout = thruoghout throughuot throghout throughot thrroughout tthroughout throughoutt througghout thhroughout throughhout 
quorum = quorrum quoum quorumm quoorum qquorum quuorum quoruum qourum qorum 
liquor = liquorr lliquor liiquor liquoor liqquor liquuor liqour liqor 
measles = masles measels measlles meesles meisles meusles moasles measlos 
retail = rretail retaill rettail reteil retiil retuil rotail retoil 
beauty = bauty beautty beeuty beiuty beuuty boauty beouty 
weird = wird weirrd woird weirdd weeird weiird wweird wierd 
ancient = anceint ansient anssient anscient ancientt encient incient uncient anciont acient 
impatient = impateint impattient impatientt imatient impetient impitient imputient impationt impatiet 
query = querry quory queery qquery quuery queryy quary quewry 
lacquer = lasquer lassquer lascquer lacquerr llacquer lecquer licquer lucquer lacquor 
cashier = casheir sashier ssashier scashier cashierr ceshier cishier cashior 
plaid = pllaid pleid pliid pluid ploid plaaid plaeid 
continue = sontinue ssontinue scontinue conttinue continuo contiue cotinue ccontinue continuee contiinue 
discrepancy = dissrepancy discrepansy disssrepancy discrepanssy disscrepancy discrepanscy discrrepancy discrepency discrepincy discrepuncy 
persuade = perrsuade persuede persuide persuude porsuade persuado persuode 
assuage = asuage essuage assuege issuage assuige ussuage assuuge assuago 
financial = finansial finanssial finanscial financiall finencial financiel finincial financiil finuncial financiul 
potential = potentiall pottential potenttial potentiel potentiil potentiul potontial potetial 
parliament = perliament porliament parrliament parlliament parliamentt parliement pirliament parliiment purliament 
commercial = comercial sommercial commersial ssommercial commerssial scommercial commerscial commerrcial commerciall commerciel 
coffee = coffe cofee soffee ssoffee scoffee coffoe coffeo ccoffee coffeee 
committee = committe comittee commitee sommittee ssommittee scommittee committtee committoe committeo 
employee = employe emplloyee emloyee omployee employoe employeo eemployee employeee 
gaseous = gaseuos gaseos gaseaus geseous giseous guseous gasoous goseous 
erroneous = eroneous erroneuos erroneos erroneaus errroneous orroneous erronoous erroeous eerroneous 
extraneous = extraneuos extraneos extraneaus extrraneous exttraneous estraneous extreneous extrineous extruneous oxtraneous 
erroneous = eroneous erroneuos erroneos erroneaus errroneous orroneous erronoous erroeous eerroneous 
decide = deside desside descide docide decido deccide ddecide decidde deecide decidee 
periodical = periadical periodisal periodissal periodiscal perriodical periodicall periodicel periodicil periodicul poriodical 
basement = basementt besement bisement busement basoment basemont basemet bosement 
disbursement = disburrsement disbursementt disbursoment disbursemont disbursemet disbbursement ddisbursement disburseement disbursemeent diisbursement 
cachet = cashet ssachet casshet scachet caschet cachett cechet cichet cuchet cachot 
mildew = milldew mildow milddew mildeew miildew mmildew mildeww meildew nmildew 
debris = debrris dobris debbris ddebris deebris debriis debriss debreis debric 
fired = firred firod firedd fireed ffired fiired feired fiwred veired 
people = peaple peopel peoplle poople peoplo peeople peoplee peoople ppeople 
whatever = whateverr whattever whatefr whetever whitever whutever whatover whatevor 
transient = transeint trransient ttransient transientt trensient trinsient trunsient transiont trasient transiet 
ancient = anceint ansient anssient anscient ancientt encient incient uncient anciont acient 
somersault = somerrsault somersaullt somersaultt somerseult somersiult somersuult somorsault somersoult 
rapport = raport rrapport rapporrt rapportt repport ripport rupport ropport 
mortgage = morrtgage morttgage mortgege mortgige mortguge mortgago mortgoge 
afterthought = afterthuoght afterthoght afterrthought aftterthought aftertthought afterthoughtt efterthought ifterthought ufterthought aftorthought 
jeopardy = jeapardy jeoperdy jeopordy jeoparrdy jeopirdy jeopurdy joopardy 
jeopardize = jeapardize jeoperdize jeopordize jeoparrdize jeopardise jeopirdize jeopurdize joopardize jeopardizo 
chocolate = shocolate chosolate sshocolate chossolate schocolate choscolate chocollate chocolatte chocolete chocolite 
admiral = admirral admirall edmiral admirel idmiral admiril udmiral admirul 
directory = direstory diresstory diresctory dirrectory directorry directtory diroctory direcctory ddirectory direectory 
direction = directian direstion diresstion diresction dirrection directtion direcsion diroction directio direcction 
directory = direstory diresstory diresctory dirrectory directorry directtory diroctory direcctory ddirectory direectory 
giraffe = girafe girraffe gireffe giriffe giruffe giraffo giroffe 
directory = direstory diresstory diresctory dirrectory directorry directtory diroctory direcctory ddirectory direectory 
toothbrush = tothbrush toothbrrush ttoothbrush tootthbrush toothbush toothbbrush toothhbrush toothbrushh tooothbrush 
business = busines businoss busiess bbusiness busineess busiiness businness bussiness businesss 
applebee = applebe aplebee appelbee appllebee epplebee ipplebee upplebee applobee appleboe applebeo 
chauffeur = chaufeur shauffeur sshauffeur schauffeur chauffeurr cheuffeur chiuffeur chuuffeur chauffour 
fillet = filelt filllet fillett fillot filleet ffillet fiillet 
squall = squal squalll squell squill squull squoll 
colleague = coleague collague colelague solleague ssolleague scolleague collleague colleegue colleigue 
moreover = moreaver morreover moreoverr moreofr moroover moreovor moreeover moreoveer mmoreover mooreover 
conscious = consciaus consciuos conscios sonscious conssious ssonscious consssious sconscious consscious coscious 
conscience = consceince sonscience conssience consciense ssonscience consssience consciensse sconscience consscience consciensce 
underwear = underwar underweer underweor underrwear underwearr underweir underweur undorwear underwoar 
hawaii = hawai hewaii haweii hiwaii hawiii huwaii hawuii 
gauge = geuge giuge guuge gaugo gaauge gaeuge gaiuge 
furious = furiaus furiuos furios furrious ffurious furiious furioous furiouss fuurious 
laborious = laboriaus laboriuos laborios laborrious llaborious leborious liborious luborious 
fastidious = fastidiaus fastidiuos fastidios fasttidious festidious fistidious fustidious fostidious 
highland = highlland highlend highlind highlund highlad highlond highlaand 
sculptor = ssulptor sssulptor ssculptor sculptorr scullptor sculpttor scculptor sculptoor sculpptor 
shambles = shambels shamblles shembles shimbles shumbles shamblos shombles 
lengthen = elngthen llengthen lengtthen longthen lengthon legthen lengthe leengthen lengtheen lenggthen 
quotation = quotatian quottation quotattion quotasion quotetion quotition quotution quotatio 
khaki = kheki khiki khuki khoki khaaki khaeki khaiki 
vacuum = vacum vasuum vassuum vascuum vecuum vicuum vucuum vocuum 
contiguous = contiguuos contiguos sontiguous ssontiguous scontiguous conttiguous cotiguous ccontiguous contigguous contiiguous 
barbecue = berbecue borbecue barbesue barbessue barbescue barrbecue birbecue burbecue barbocue 
rapacious = rapaciaus rapaciuos rapacios rapasious rapassious rapascious rrapacious repacious rapecious ripacious 
poetically = poeticaly potically poetisally poetissally poetiscally poeticallly poettically poeticelly poeticilly 
evening = efning ovening evoning eveing evenig eevening eveening eveningg eveniing evenning 
epicure = episure epissure episcure epicurre opicure epicuro epiccure eepicure epicuree epiicure 
intrinsic = intrinsis intrinsiss intrinsisc intrrinsic inttrinsic itrinsic intrisic intrinsicc iintrinsic intriinsic 
nineteenth = ninetenth ninetteenth nineteentth ninoteenth ninetoenth nineteonth nineteeth nieteenth nineeteenth nineteeenth 
synonym = synoym synonymm synnonym synonnym synoonym ssynonym syynonym synonyym synoenym cynonym 
turmoil = turrmoil turmoill tturmoil turmoiil turmmoil turmooil tuurmoil 
courtship = cuortship cortship sourtship ssourtship scourtship courrtship courttship ccourtship courtshhip courtshiip 
thoroughbred = thoruoghbred thoroghbred thorroughbred thoroughbrred tthoroughbred thoroughbrod thoroughbbred thoroughbredd thoroughbreed thorougghbred 
quartet = quertet quortet quarrtet quarttet quartett quirtet quurtet quartot 
sailboat = saillboat sailboatt seilboat sailboet siilboat sailboit suilboat sailbout 
squander = squanderr squender squinder squunder squandor squader squonder 
daybreak = daybrak daybrreak deybreak daybreek diybreak daybreik duybreak daybreuk daybroak 
forfeit = forfit forrfeit forfeitt forfoit forfeeit fforfeit forffeit forfeiit foorfeit 
genuine = gonuine genuino geuine genuie geenuine genuinee ggenuine genuiine gennuine genuinne 
austere = austerre austtere eustere iustere uustere austore austero oustere 
exchange = exshange exsshange exschange eschange exchenge exchinge exchunge oxchange exchango exchage 
dessert = desserrt dessertt dossert dessort ddessert deessert desseert desssert 
dissolve = disolve dissollve dissolf dissolvo ddissolve dissolvee diissolve dissoolve disssolve 
scissors = scisors ssissors sssissors sscissors scissorrs sccissors sciissors scissoors 
carburetor = cerburetor corburetor sarburetor ssarburetor scarburetor carrburetor carburretor carburetorr carburettor 
mosquito = mosquitto mosquiito mmosquito moosquito mosquitoo mosqquito mossquito mosquuito moesquito 
wednesday = wednesdey wednesdiy wednesduy wodnesday wednosday wednesdoy wednesdaay 
tipped = tiped ttipped tippod tippedd tippeed tiipped tippped teipped 
anonymous = anonymuos anonymos enonymous inonymous unonymous aonymous anoymous ononymous 
beautiful = bautiful beautifull beauttiful beeutiful beiutiful beuutiful boautiful beoutiful 
withhold = withold withholld witthhold withholdd withhhold wiithhold withhoold 
newsstand = newstand newssttand newsstend newsstind newsstund nowsstand newsstad newsstond 
indoors = indors indoorrs idoors inddoors iindoors inndoors indooors indoorss 
invoice = invoise invoisse invoisce invoico ivoice invoicce invoicee iinvoice invoiice innvoice 
awkward = awkwerd awkword awkwarrd ewkward iwkward awkwird uwkward awkwurd 
obnoxious = obnoxiaus obnoxiuos obnoxios obbnoxious obnoxiious obnnoxious oobnoxious obnooxious obnoxioous obnoxiouss 
brilliance = briliance brillianse brilliansse brilliansce brrilliance brillliance brillience brilliince brilliunce 
flamboyant = fllamboyant flamboyantt flemboyant flamboyent flimboyant flamboyint flumboyant flamboyunt flamboyat 
gorgeous = gorgeuos gorgeos gorgeaus gorrgeous gorgoous gorgeeous ggorgeous gorggeous goorgeous gorgeoous 
shepherd = shepherrd shopherd shephord shepherdd sheepherd shepheerd shhepherd shephherd sheppherd 
resource = resuorce resorce resourse resoursse resoursce rresource resourrce rosource resourco resourcce 
earthquake = arthquake eerthquake eorthquake earrthquake eartthquake earthqueke eirthquake earthquike eurthquake 
`;

const wordGroupsDoc = `
an ban and band 
end bend den men 
pump bump dump lump 
test best rest pest 
rap trap tramp rat 
rib rid rim drip 
dust rust trust must 
gag bag brag nag 
did dim dip din 
rub shrub brush rush 
dot rot trot pot 
bet met pet net 
tent bent rent sent 
tint mint lint hint 
it bit fit hit 
vast mast past fast 
clad clam clap clamp 
lap flap lamp plan 
dug drug rug mug 
belt felt melt pelt 
inch chin finch pinch 
bound round pound mound 
crab cram cramp scrap 
bunch munch lunch punch 
lot blot clot plot 
lag flag glad gland 
stab stand stamp last 
cap camp can cat 
sped spend spent pets 
van ran man pan 
led bled fled sled 
trump plump hump stump 
in fin pin tin 
rig grin grit trim 
drift gift lift thrift 
nip lip tip trip 
mount count county bounty 
rob throb rod drop 
get let fret set 
vest nest test best 
bun fun fund gun 
gust thrust rust trust 
not got hot shot 
land plant plan gland 
map nap tap rap 
found hound sound ground 
ten tenth tent 
blast last mast past 
tan fan brand an 
plum lump plump 
ring bring spring string 
wit twig twist swift 
send blend end bend 
east beast feast least 
print tint mint lint 
dandy handy 
hunch bunch munch lunch 
eat beat treat meat 
stint midst strip list 
each reach peach preach 
bang rang fang hang 
dream cream scream stream 
pop mop hop chop 
big dig fig pig 
sad sap sand sat 
wed wet went west 
had hand ham hag 
ranch branch blanch 
lid limp blimp lip 
run drum rut thrush 
bed red fed led 
romp frog frond rod 
clan clasp clap clad 
bean dean mean 
cot spot slot lot 
pug tug shrug rug 
old mold sold gold 
rain brain grain train 
sit its spit 
gush blush plush flush 
hum hut hug hush 
saint stain strain 
at pat rat 
tub stunt study tug 
bolt molt hold old 
ever never sever every 
oil boil foil broil 
tactic antic frantic tactics 
aunt taunt haunt flaunt 
heat cheat pleat eat 
brandy sandy dandy 
pod pond pop 
river liver silver shiver 
flinch inch finch 
thin in din fin 
or for form forth 
bud but bun bump 
born thorn corn north 
out pout shout flout 
with width wind windy 
sister master blister bolster 
intent intend inept integrity 
tamper hamper perhaps persist 
broth froth throng prong 
sing sling wing swing 
fort forty short 
under thunder blunder 
nod god sod cod 
toil soil spoil coil 
lost frost frosty 
grab grand graft 
hid him hilt hit 
slab slam slant 
top stop shop flop 
am bad drab raft 
sort sport snort 
beam team seam steam 
roster foster monster bluster 
cash crash clash 
horn corner scorn corn 
after banter printer 
vanity gravity 
beg peg leg 
gasp grasp spin spit 
ample sample simple dimple 
over clover adverb 
wound bound round pound 
read real dream reach 
banana malady cavalry capital 
bramble rumble crumble tumble 
enter ferment tender fender 
number lumber slumber limber 
fanatic dramatic banana 
up pulp mud gum 
craft crab cram cramp 
vial dial rival tidal 
hub hunt hut hum 
loft lofty 
teach bleach each reach 
neat neatly eat beat 
pen hen then when 
rail trail 
room broom groom roof 
fifth filth fin fig 
on bond cob plod 
porch torch 
noon boon moon soon 
lung flung clung 
pail nail flail sail 
order border orderly 
butler tumbler cutler 
member elder temper clever 
us plus sum sun 
manila malignant 
droop troop proof roof 
snap span pants slip 
mad pad bad 
slug slush 
step slept smelt help 
vain gain chain 
density subsidy vanity gravity 
tag gag bag brag 
oral moral 
finish diminish 
former form for forth 
pacific invalid whimsical facility 
oval vocal local focal 
pool spool tool stool 
hung sung stung lung 
dash trash flash 
long song strong prong 
deal meal seal real 
loud cloud 
chat chant 
able table fable gable 
paid staid tail snail 
club clump 
whip dip nip lip 
moth cloth broth froth 
gang bang rang fang 
damp tramp 
cast cat cap camp 
prism drip rid rib 
flat flap 
dog fog cog log 
ninth find blind grind 
bloom gloom gloomy 
pain paint painter 
amber filbert pilfer tinder 
smash slash dash flash 
crib script crept crush 
flog clog 
sable stable cable 
too tooth poor spoon 
later cater 
rill drill frill grill 
curb curd curl curly 
bead leap gleam wean 
thimble grumble rumble bramble 
holy hold 
ill bill fill hill 
bell tell fell sell 
dull mull gull hull 
burn turn churn spurn 
paper taper viper property 
lean glean clean 
mimic critic district fabric 
whorl glory gory story 
well dwell 
modern ponder 
thrill rill drill frill 
maid laid daily slain 
hurl surly curl curly 
clip clinch 
thing cling ring bring 
western minister sister master 
ministry activity 
chill will spill still 
bib if isn't did 
abstain stain staid 
church churn 
cull gully gull dull 
her hither usher chamber 
fantastic ecstatic 
shut but rut 
see seed seem seep 
slid slip 
flour flout 
much mud mug 
inspect inept intent intend 
contact content contest 
temple ample sample simple 
bull pull full fully 
ate date rate mate 
nine dine mine fine 
soft loft lofty 
scorch scorn corn 
itself its 
arm farm harm charm 
rave brave pave gave 
rove drove throve grove 
five drive thrive live 
car card cart scar 
taste baste paste haste 
gate late plate hate 
name tame fame frame 
dime lime time prime 
pine tine brine line 
ride bride hide side 
made fade trade grade 
part chart party partner 
star start starch tardy 
rope mope hope cope 
bone hone cone tone 
wad wand want waft 
deed feed freed heed 
barb barber barn far 
weed weep sweep sweet 
beet beetle meet feet 
tree greet green free 
mire fire wire spire 
lame blame flame inflame 
save slave grave shave 
march parch larch 
tape grape shape cape 
peep deep sheep creep 
speed speech speedy 
bleed fleet sleet sleep 
chide wide glide slide 
state slate crate chaste 
whine shine shrine ninety 
game shame came 
lard larder hard card 
blade glade shade 
robe probe 
pipe spine spite tribe 
fee feel feeble feed 
farmer farther father 
pity fifty 
drone throne 
dish fish ship shrimp 
garb marble army marsh 
three reel creed greedy 
gather lather 
cave crave 
page stage range strange 
stove rove drove throve 
bee beef beet 
swan swamp 
steep steeple 
smart artist 
pose prose nose those 
enlist list stint midst 
divide inside outside abide 
seen see seed seem 
twine swine nineteen 
enable able table fable 
again against gain 
winter aftermath after banter 
comic topic frolic logic 
use used abuse amuse 
adage damage manage 
total metal mental 
spar snarl scarf sharp 
barge large charge 
rabid acrid distract credit 
whenever celery 
aim maim 
poise noise 
tinge fringe 
embers member amber 
purse nurse 
give sieve 
invent robin in intent 
trial giant vial dial 
such snug us sun 
emery every 
gender tender tinder under 
vase chase 
harsh hard 
apart part party 
sin insert stint spin 
very entry belfry pantry 
vagrant fragrant flagrant 
danger manger wager 
timid livid putrid humid 
aloud vital final spiral 
emanate escapade devastate 
tiger spider sober loiter 
infant distant 
cub cut 
rife crime strive private 
deem glee sheet needle 
pickle tickle trickle fickle 
toast boast roast coast 
cubic magic plastic hectic 
right bright fright brightly 
ask bask mask flask 
back pack lack black 
stone tone 
them then 
sack smack snack slack 
bark dark shark mark 
pick brick trick sick 
might night fight light 
duck truck luck pluck 
dock rock frock lock 
boat goat oats float 
bake shake rake make 
deck neck speck speckle 
bike like spike strike 
banish vanish lavish 
vote note notes 
rusk musk husk 
empty testy plenty 
hurt turtle purple spur 
park spark spar part 
fatal aloft formal along 
road roach throat 
triple maple staple simple 
choke smoke spoke 
stick sticky 
tight sight slight plight 
take lake flake wake 
block flock stock shock 
afar alarm lark embark 
task desk skulk ask 
palm calm 
varnish tarnish 
stark star start starch 
epic metric 
crack cracker 
sob hog ox box 
a than penalty organ 
matter patter pattern latter 
import morning or born 
thick slick bicker 
shrift shrimp 
slope rope mope hope 
canal banana 
go so old gold 
impeach peach each reach 
divine incline 
bench branch ranch blanch 
butter mutter putter buttery 
tatter flatter flattery battery 
bitter fritter litter 
rode node code 
giving misgiving livid 
flight flighty 
mouth south 
better letter 
sip this sin spin 
funeral colander 
as has is his 
cane crane plane 
potter shutter cutter clatter 
encode code node rode 
booth loop cool blooming 
war ward warm warp 
sea seam seal 
distemper temper tamper hamper 
burst murder turban furnish 
expert desert 
sting string 

chip chin 
stack stuck 
acts cat cast craft 
raze gaze blaze craze 
gap gag 
scrape cape tape grape 
all ball tall fall 
mouse house blouse 
malt halt salt 
warn warmth wart water 
bony only 
fume home same slime 
tube cube globe robe 
ease please 
perfect temper tamper expert 
stutter butter mutter putter 
perish blemish 
fool foolish 
safe safety 
i pint ninth find 
bray pray fray gray 
mass brass grass glass 
swim swift 
mess dress bless impress 
tray stray spray prayer 
meek seek sleek cheek 
baby navy gravy lady 
call small stall wall 
soap 
mild child 
our sour flour 
invite ignite 
wish wit with width 
class classic 
void point oil toil 
no both go so 
stoic rustic 
sham thrash dash dish 
bible noble bramble rumble 
rank drank frank shrank 
entwine twine swine 
archery march parch larch 
envy entry plenty 
afloat float 
bank dank hank tank 
pink drink sink blink 
day may say stay 
text next 
rich enrich 
moist hoist 
fresh flesh shelf 
bait wait dainty entail 
blank flank 
crank rank drank frank 
attendant attempt 
brisk skill ask bask 
route abate dictate inflate 
ticket picket packet racket 
santa constant 
bother voucher miser trousers 
ostrich frost frosty 
that than 
spirit culprit 
unit profit 
distill still 
sultry trust 
redress depress regress express 
berate elate relate estate 
rebel repel relent regret 
deliver bewilder delivery 
define refine decline recline 
detain retain detail 
defend defect deflect reflect 
fault faulty default 
elicit exhibit 
thank ankle sank think 
report deport 
deride beside side ride 
demur return recur 
skeptical disposal 
depend detest detect depict 
remain refrain prevail 
beset behest 
remark market 
clock locket lock block 
retire expire 
remember deliver bewilder delivery 
extract text next 
demean mean 
enigma malignant 
defame became 
close 
defeat eat beat treat 
rascal radical local vocal 
depose expose 
element enemy remedy benefit 
defender defend 
ravel gravel grovel shrivel 
tragedy majesty comedy deposit 
bitten mitten smitten kitten 
level bevel seven 
patent potent pungent open 
bucket rocket pocket socket 
token taken broken shaken 
poem poet poetry 
diet item strident silent 
admit adrift adopt cadet 
nickel chicken wicked ticket 
brier bribery 
omen moment ailment 
driven raven haven 
linen children golden stolen 
resident decrepit 
lintel novel gospel swivel 
life wife rife 
ripen aspen 
absent insistent 
rivet driven 
noted potent 
ardent garden 
insist inflict 
spoken waken taken token 
event expend 
eminent denizen specimen evidently 
boot hoof smooth 
eleven level bevel seven 
anoint defendant human refusal 
remote note notes vote 
agony canopy balcony ebony 
erect elect neglect respect 
deficit centigram destiny 
contend second consent compel 
talon felon felony melon 
pacify magnify amplify gratify 
piston custom custody customer 
ballot gallop gallon 
edit merit exit 
weak speak sneak streak 
bush bushy push 
cabinet accident prominent 
animal pelican dominant 
edify verify petrify notify 
to atom into 
lion lemon heron mason 
medicine precipice deficit 
family mutiny paucity 
infinite intimate 
protest protect 
button mutton 
contain contented content contend 
democrat domestic 
nominate dominance dominant 
more tore store chore 
nobody consider 
justify glorify 
velvet helmet 
pagan vacant husband an 
dread bread tread thread 
ecstasy obstacle constant distant 
general informal 
convent client 
amass mass 
beaver bead beam bean 
dogmatic ecstatic vanity gravity 
eaves cheap sheath 
race brace trace face 
alive live 
click cricket 
dead head stead spread 
feather leather weather 
bear pear tear 
mice price advice 
pastry hasty 
cold scold 
death breath 
ready steady 
dragon wagon agony 
intensify edify verify petrify 
cake snake forsake 
grace race brace trace 
fuel tinsel morsel lintel 
tallow shallow billow pillow 
sleeve geese 
didactic gigantic antic tactic 
leave heave weave 
follow hollow 
angelic density 
semester gardener target garment 
spice slice 
deaf threat wealth instead 
forgive give live 
pavement statement 
further lurk absurd diurnal 
basic ethics public 
spade poke 
wild wind windy 
kick pick brick trick 
rare bare dare mare 
emulate speculate 
perspire fireman fire mire 
meeting discreet meet beet 
colony develop 
golf god got 
shore wore more tore 
case chase vase 
match patch snatch dispatch 
hare flare glare share 
pitch witch switch twitch 
mince wince prance chance 
bundle dwindle handle fondle 
mitt ditty kitty little 
billet millet skillet sullen 
mellow fellow 
care scare 
wash watch wander 
prison crimson 
limit digit 
brazen frozen 
oath poach oak 
device entice 
tablet planet hatchet triplet 
spare snare 
basis basic 
title rifle bible 
refresh record predict expect 
algebra amended relevant 
arrow marrow narrow sparrow 
eligible flexible 
punish banish vanish 
adder ladder rudder fodder 
zone alone 
wheel reel feel 
which rich enrich 
pawn spawn brawn lawn 
first thirst thirsty firstly 
fatten bitten mitten smitten 
enslave slave 
cavity gravity 
ahead head 
inert invert avert alert 
namesake same name tame 
dirt dirty shirt flirt 
riddle middle fiddle puddle 
term fern herb infer 
own blown thrown owner 
loss gloss cross across 
furry hurry curry 
breeze freeze sneeze 
birth firth 
trunk sunk shrunk banker 
mix fix 
third thirdly girder 
moan bemoan 
firm girl birch chirp 
saddle huddle cuddle puddle 
prize size 
were swerve 
pivot bigot consist venom 
verse terse 
gallant ballast 
marry carry 
behave rave brave pave 
abash about liable tribal 
harrow arrow narrow 
six mix fix 
often sweeten widen maiden 
voice choice 
prefer exert verbal merchant 
abreast breakfast 
err berry cherry 
soda sofa 
heavy heavily health head 
tighten lighten 
stir skirt 
serve merge clergy verdict 
mute dispute acute 
fabricate cultivate 
damsel chisel 
shudder rudder 
publish public 
blanket tank bank blank 
began begin befit between 
droll stroll smell shell 
abrupt extra dogma logical 
jam jump jug jig 
down downtown town drown 
flax index fix mix 
exalt halt malt salt 
girlish girl 
build guild built guilt 
consistent contingent 
galaxy malady 
buckle duck truck stuck 
sedate date 
distress impress dress 
groove groom room broom 
angular singular particular regular 
colon felon felony 
bewitch witch switch 
encroach roach coach poach 
word worm world worth 
brown frown crown gown 
worthy worldly work worker 
haphazard calvary calendar 
quit quilt squint quiver 
muscular popular singular particular 
eject reject 
jest just 
libel label angel 
quick quicksand quicken 
degree decree 
owl prowl growl howl 
kite migrate 
dune tune prune june 
await wait 
chess mess dress bless 
truth truly truant brutal 
plume flume flute dilute 
rude crude 
cowl scowl 
massive passive 
put pulpit 
ago agree avoid was 
hundred sacred forest record 
delude exclude 
delicate duplicate 
clown crown brown down 
restore store 
any many 
keep 
elastic disjointed 
ruby ruin prudent duly 
wasp swamp swan wad 
esteem amnesty 
amount amidst 
missive massive passive 
fence menace 
amputate litigate locate 
outfit out pout flout 
selfish blemish perish 
jeans bean dean mean 
book brook took look 
fracas vacant 
tremor tumor rumor memory 
row throw grow crow 
negligence eminent evidently 
joke choke poke spoke 
season 
huge cage impinge 
imbecile infinite 
loyal royal 
motor tutor actor captor 
good hood wood stood 
favor flavor savor fervor 
visitor editor creditor 
tow bestow sow snow 
advisor ivory 
angry anger finger 
sentinel eminent denizen specimen 
factory history 
odor humor armor arbor 
doctor decorator directory 
basket brisket musket drunken 
wool woodland wood 
debate debase 
result 
using music 
ladle cradle 
jelly jellyfish 
add addict adder ladder 
enactment enjoyment 
forbid forget victory mayor 
rally silly jolly 
amendment assessment acumen 
joy enjoy 
foot hook shook lookout 
imitate obligate 
snore ignore 
gruel frugal 
gaudy audit 
milking milk 
crook brook 
forever janitor 
flange fringe tinge 
food fool 
jade native 
emit exist rebut deduct 
inmate stipulate 
vary charity 
meditate hesitate 
cook crook book brook 
way clay defray 
daisy daily dainty 
freshen burden 
mile smile pile tile 
assert alert avert 
enrage engage page cage 
dispose pose 
coronet domestic 
host hold holy 
earn learn pearl heard 
refute mute 
altitude gratitude 
amaze raze gaze blaze 
dumb numb thumb crumb 
scarce care scare 
federal oral 
teeth steep 
tangible forcible cuticle 
pale tale gale sale 
boy toy troy 
drawl crawl sprawl 
blonde bronze olive involved 
flow slow below 
kind kept fork stork 
resonant political 
role stole 
confine confide 
file while 
deduce reduce 
arose arise are 
substitute multitude 
eliminate imitate intimate 
armament apartment absorbent urgency 
edible edit 
early search 
ashes bushes pushes 
bath path 
poison reason treason 
crutch clutch 
polar solar 
acid lucid pencil deficit 
desolate resolute 
mule whale scale 
risen chisel 
tendency amnesty 
image voyage 
dredge ledge sledge 
play display 
banner inner dinner 
calculator ancestor 
afterward calvary 
hatred hundred 
ivy i ninth find 
alike like 
exhale pale tale gale 
counsel tinsel 
week meek seek sleek 
legitimate obstinate intimate nominate 
coax coat coach 
fluke flume flute 
explode rode node 
checker bicker 
household house blouse mouse 
visiting using 
ruse rude prune 
treachery tread 
patrol redundant dismal miracle 
chest bench chat chant 
deface face 
asterisk task ask bask 
dew new grew blew 
quill quit squint 
disturb turn 
chose raise 
cider grocer ulcer grocery 
broker poker baker 
flew stew crew blew 
embassy assembly 
flimsy clumsy 
horse corpse 
limestone time lime slime 
overrate ate rate date 
delay decay 
almost salt malt halt 
beginner inner dinner 
disclose close pose dispose 
potato despotism 
exponent punishment 
calico purity security 
today 
sorry mulberry curry carry 
longitude altitude gratitude 
hazel brazen 
notoriety malefactor actor factory 
bringing handling nostril sandwich 
hatch botch 
dear beard dreary shear 
anecdote majesty 
comical logical 
iceberg price mice advice 
delegate relevant 
smith midst 
soothe goose 
detachment judgment 
decade cascade 
love glove shove above 
teachable teach each reach 
rainstorm strain rain train 
ton front month from 
other brother another 
smear spear clear weary 
flannel channel funnel bonnet 
none done 
icy racy mercy 
widow window 
some come 
eddy giddy 
jet inject join 
force farce 
entertain painter 
mastodon personality 
scratch snatch match patch 
oregano penalty 
extremity dormitory 
compute confuse 
protocol nobody 
paw draw law flaw 
management amusement 
thaw saw jaw claw 
pillar dollar collar 
deplore explore 
basin basis 
lace truce induce 
anvil pupil 
recompense carbonate 
problem tablet 
become come 
reprint repay prepay repeal 
prow 
themselves them 
carnival skeptical 
bauble taught caustic 
canvas asleep 
cardinal card lard hard 
awake wake bake rake 
confirm firm 
twinkle pink drink sink 
refreshing refresh 
tower flower flowery 
remind restrain respond reclaim 
rodeo romeo 
aspect insect 
cargo car card 
sadden sudden 
space race brace trace 
be maybe 
repress reproach replenish 
pretend detest 
zeal deal real meal 
jot object 
net 
revenge preventive 
rabble scrabble scribble cobble 
relapse release 
prowess prow 
penny funny sunny 
shall gallery rally 
how cow allow now 
ebb pebble 
boundary vinegar 
eager easy read bead 
parole role 
recoil recur 
detach inches embody 
redden sadden sudden 
research search 
twelve absolve 
burglar similar solar polar 
restrict restrain 
me he she we 
spruce truce 
gross kiss russet 
declaim aim maim 
mercer mercy 
assault fault faulty 
imitation recitation destination 
battle cattle bottle 
eon demon bacon 
parse crease increase disuse 
legal 
coward custard steward lizard 
lamb comb climb 
condition consider 
parental regular singular particular 
dupe fluid include 
signal malignant 
defraud default 
author theory 
deity 
notion nation mention section 
civilization imitation 
bliss kiss 
die tried fried cried 
toothpaste tooth 
action caption fraction election 
pardon wanton person sermon 
fiction friction 
convene concrete conclude 
stupid student 
senator assessor memorable 
station foundation 
neon eon 
invention mention 
major juror 
enforce force 
witness harness 
decrease crease 
by my try why 
fulfill fill ill bill 
alkali banana malady cavalry 
fly rely reply lying 
hybrid hydra hydrant 
bridge abridge 
civilize mobilize 
nonentity destiny centigram 

fertile hostile tile 
bedtime pastime 
labeling label 
formula informal 
corporal senator 
type tyrant 
patronize absolute 
option salvation 
vowel towel 
endure manure 
breathe criticize 
retake retrace 
reflex regal 
tailor stupor 
superb herb 
skeptic kept 
moonshine moon 
squad squat squash 
tartar lunar 
nonfiction fiction 
clinch 
banjo enjoy 
bubble rabble 
being be 
cotton button mutton 
awaken waken taken shaken 
true sue blue glue 
compete comprise compute 
doll jolly 
belittle little 
off offer differ chaff 
baffle ruffle shuffle 
torrent sorrel abhorrent 
here rebate impede these 
going clothing 
jewel jewelry 
frigid digit 
serpent stiffen kitchen weaken 
cabin robin 
behind belong example exactly 
competent benefited resentment 
optimism multiply 
suffer differ 
recondite recognize 
wrath wren wrench wring 
territory berry cherry err 
duel duly 
illegal legal 
grabbed rabble 
hoax road toad boat 
avail vain 
noontime noon 
fury purist purity 
staff traffic 
argument garment omen moment 
condor effort plethora 
balloon boon noon moon 
scuffle ruffle shuffle 
development democrat 
cemetery pretzel helpless effect 
spy deny awry 
idea penal 
derive revive deprive drive 
harvest forest 
buzz muzzle drizzle dizzy 
froze freeze 
away way 
embellish bell 
markup park mark bark 
orange tinge fringe 
jail mailbox rail pail 
plantation station 
wrist wring 
excuse use 
waiver wait 
carpenter ripen 
wonder affront 
pervade blockade blade made 
king kidnap kindle 
alcohol balcony 
fundamental metal mental 
aware unaware 
televise delegate element enemy 
spelling sell bell smell 
crayon bray pray tray 
laurel claus flaunt 
sadness mattress 
ermine doctrine 
crisis jurist 
citron proceed 
rosy noisy 
exempt exist 
admonish punish 
fossil possible 
kindred kindle 
sedition vacation 
nectar custard 
together toward 
devotion notion 
describe tribe 
vein veil eight freight 
promise nominate 
odd fodder 
barrel sorrel 
inhabit cabin 
organization recitation destination 
carrot carry 
license slice 
sheriff merit 
concern conceal 
simplicity activity 
lazy crazy frenzy 
deacon congeal 
forward wayward buzzard 
saucy saucer 
division inscription 
vacate prostrate 
candidate altitude 
microbe tribe tube cube 
fortress groundless 
yet yes yell yellow 
absence inducement sentence preference 
remiss reward 
infection section 
gentle title 
nylon deny 
repulse repeal 
mightily family 
medicinal dominant 
yard yarn 
fashion cushion region legion 
award ward war warm 
fathom freedom 
gossip fossil 
year gearing 
indelible bundle 
contrary vary 
cancer grocer grocery 
frustrate magistrate 
baseball ball 
attract attendant attempt 
napkin ask bask mask 
stockings stock 
hair chair unfair repair 
demise despise 
kennel flannel funnel 
turpitude turn 
cliff afford off 
deer cheer sneer been 
haircut 
arbitrate armistice 
incite imbalance ambulance 
jury rural 
liberate inmate dictate 
galling all ball tall 
tornado cornet forget 
ransack wedlock neck lack 
extreme rebate 
minus cactus focus locust 
everybody everything 
engineer sneer 
wallow billow pillow 
concede convene concrete 

hero zero 
preferred prefer 
drunkenness drunken broken 
rejoice voice choice 
faculty bankruptcy modicum upon 
prohibit obesity thesis zenith 
educate prejudice 
postpone tone stone bone 
zoology colony agony canopy 
lasso glass 
visible feasible 
soprano consider 
tearful tear 
unite alkaline franchise 
competition petition 
industry statutory 
antidote impulse indulge 
belie untie die tried 
impossible possible 
cameo resist stereo resemble 
jolt jam jet jest 
introduce truce 
timing humid 
eclipse consecrate 
berserk insert 
baritone bare 
barbarism cheddar 
council pencil 
dismiss bliss 
prescribe respond 
itemized item 
hermit dormitory 
airplane airport 
mesmerize enterprise accelerate 
submit subvert 
pure impure cure 
rubber rubbish 
presented pretend 
landslide blonde 
vestige storage 
buy buyer guy 
zebra zero 
decimal pencil deficit 
frigate tribute 
talk walk chalk 
four court your yourself 
beware compare 
subject secure 
malicious capricious 
homogenize comedy 
mature that 
warranty want 
bachelor tailor 
money honey 
sarcasm arguing car scar 
bought sought 
significance abusive 
marigold mariner 
attorney attorneys 
continuum prospectus 
manual mental metal 
procure cure 
climate private 
sponge none done 
around cellar 
move prove unmoved 
straw lawyer 
distance solace 
next 
affair hair chair 
embezzle muzzle 
assume plume flume 
accessory memory 
anywhere any many 
expedite unite 
noel poetic rotund halo 
until unload unseen 
create creator 
disinterested insinuate 
approval disapproval movingly immovable 
obtain obscure 
hitherto to 
hoping clothing 

fleecy icy 
address add 
reflective executive 
terrible accessible 
thieves fiend field shriek 
guard quantity 
perforated for forbid 
usurp purple 
resolve result 
cherub submit 
compose comprise 
passport dissect 
cinder center 
cannot banner 
alchemy metallic dishonest currency 
advantage narrative attractive orphanage 
belief relief 
believe relieve 
unhappy unwilling opossum 
difficult difficulty 
besiege besieged 
cannibal animal capital 
establish recurring 
commuter community 
grieve achieve 
mackerel passenger 
caught naughty daughter 
retrieve relieve believe 
unlucky unhappy 
adjacent awaken 
apparel tragedy majesty 
passable amass mass brass 
kangaroo boundary 
surgery surly 
immigrant ministry 
predecessor decorator memory directory 
civil anvil 
disapprove approval 
volcano noel 
cinnamon collateral 
intelligible eligible 
quandary quantity 
classification recitation destination 
bailiff plaintiff 
laborer favor flavor savor 
urge purse nurse spur 
satellite anecdote tragedy majesty 
priest fried 
unlock unload 
product callus unfounded 
narrate narrow arrow marrow 
tariff mariner 
capitalization plantation 
admissible possible 
wrong wring 
frostbitten fatten 
tweezers weed weep 
before deplore explore 
attend attack 
profess connect 
polite scaffold 
egoism tuxedo 
knives knee kneel 
perusal frugal brutal truant 
sweat sweater 
refuse infuse use used 
weasel chisel 
provide produce pronounce 
show know row tow 
knelt knapsack knuckle 
durable miracle 
duchess meanness 
professor profess 
collate commit commute commune 
antiseptic solid 
assist canvass 
merchandise merchant 
leaven heavy 
junction action fraction 
instrument faculty 
blood flood bloodshed 
birthright circle 
coincident accident 
soundings is his 
talkative talk 
commitment opponent 
door doormat floor 
cent central 
niece apiece 
detrimental skeptical 
coming discover 
conjugate modicum 
unacceptable miracle 
discuss distress 
wilderness witness 
communicate commune commute 
hobby cobble 
exotic exactly 
nourish flourish journal journey 
microcosm democrat 
demolish embody 
soup group grouping acoustics 
seclude include 
expansive olive involved solve 
rule console 
summary boundary 
exude recluse 
bustle hustle jostle 
obsolete absolute 
dingy mangy 
you youth 
petulant asylum 
journalist journal 
wrestle bustle hustle 
extricate doctrine 
heroic elastic 
speechless duchess 
half calf halfway 
written wring 
concurrent contain 
afford 
compensate ripen 
cedar boundary 
unkind unseen 
touch double trouble young 
fruit suit recruit 
dynasty cycle 
seminary solitary 
guest quest 
epitaph deficit edify verify 
fasten glisten 
imaginary invalid family gravity 
country couple 
request quest guest 
disposition customary custody 
positive nominate 
necessary remedy 
unusual petulant 
kindness meanness 
education salvation 
elephant relevant element enemy 
pantomime atom 
rough tough enough 
comfort coming 
bondage hostage beverage pillage 
heart hearty 
pancake 
circus focus locust 
insoluble bramble 
cousin country 
practice gratitude 
mountain fountain 
because claus 
institution salvation 
kerosene desolate 
boycott mitt bitter fritter 
violence polite 
reptile cajole 
injury century 
chimney kidney 
occasion pollution 
portrait curtain 
devour our sour flour 
forage orange storage 
domesticate desolate 
nature picture creature feature 
novice lattice 
athlete vote note notes 
cancellation plantation 
adventure century 
horrid humid 
begrudge badge bridge 
otherwise another 
nucleus cactus locust focus 
unable modicum 
oneself line fine nine 
clearance clear 
torture saturate gesture lecture 
villain certain mountain fountain 
presage cottage 
crevice practice precipice 
possessive community 
recover among 
blossom fathom 
myth mythical lyric cylinder 
brotherhood other brother 
buffalo ruffle shuffle 
fulcrum cherub 
indicate fabricate 
preceding prepay 
organize breeze freeze 
crowd powder 
appear disappear 
supper slippery copper 
agile fragile 
mystery gypsy syntax syrup 
cyst system 
angle uncle distinct angry 
remove approve 
surrender century 

typify cylinder 
nymph lymph 
disappeared disappear 
apply fly 
occasionally occasion 
contemporary ebony felony 
movement move prove 
summon siphon 
quail quaint 
symphony nymph 
fearless clear dear beard 
sterile agile fragile 
physical cylinder 
equipping quit quilt 
annual banner 
typhus cactus 
service novice 
diagnosis emphasis 
hyphen hybrid 
motley chimney 
squirm squirt 
menthol forget 
mercury term her herb 
supreme upon 
lozenge brazen 
tour tourist 
terrific horrific 
galley pulley 
do to 
furniture saturate 
debt debtor 
common summon 
mispronounce pronounce 
should could would 
insecure eclipse 
taunt 
there where 
connive compute 
extinct uncle 
annoy inner dinner 
famous fibrous raucous jealous 
parent transparent 
pollute collate 
employment element resident decrepit 
oblige obtain 
cabbage rabble scrabble 
schism school schooner 
amorous rigorous 
quench quest 
garbage mileage 
pompous zealous 
chaos chemist 
texture adventure 
illiterate frigate 
source four 
therefore there 
paragraph embarrass 
yearn earnest earn learn 
whole wholesale 
dolphin bulletin 
maintenance delegate relevant 
wondrous fibrous 
egg foggy craggy 
enormous famous 
governor monk 
wholesome whole wholesale 
hoarse coarse 
recently eleven 
recess december 
understood roof foot good 
southern double 
portion operation 
vegetable ninety 
billow 
coed cobweb convent 
elliptical distill ill still 
folklore talk chalk walk 
appointment allotment 
sublime submit 
chorus schism 
beggar haggard 
accept cent 
ragged happen 
eggnog egg 
dagger craggy 
maggot ballot 
government covet 
recreation creation 
monotonous pompous 
advertisement omen moment 
desecration reduction 
female wholesale 
literature picture 
tire conspire 
entire desire 
addition sedition 
paraphrase paragraph 
birthday birth firth 
technical chemist 
accede accept 
nuisance suit fruit 
artichoke arbitrate 
drowsy drown 
supporter bankruptcy 
innocent proceed 
square spare snare rare 
patch 
already ready read dread 
evanescent incandescent amendment element 
revile awhile while mile 
midnight delight 
syndicate syntax 
stepped stopped 
lightning light plight flight 
arithmetic vinegar 
rebuke bike bake rake 
irksome stir skirt first 
attire mire fire wire 
incessant cent 
scent ascend 
unknown until 
bankrupt cherub 
overrule meanwhile 
allotted bottle 
meadow dead read dread 
existence sentence 
mystify mystery 
awe gnawing paw draw 
irrevocable havoc 
recede accede 
tongue ton 
appliance ambulance 
commerce exercise 
abolish magazine 
descent scent 
tyranny syllable 
celebration education 
reign freight 
plaque torque mosque 
icicle icy 
scholastic chemist 
hazardous fibrous 
desirable about 
harangue submarine 
submission unfounded 
bravely homely 
crystal mystery 
appease disappeared 
irritate accumulate 
recite incite 
who whom 
stammer summer 
gem digest 
lovely bravely 
crescent scent 
excessive college 
arrest arrival 
credence tendency 
justifiable obstacle 
siege besiege besieged 
ensue tuesday 
adjourn nourish 
eighth eight freight 
guardian guard 
essence influence 
succumb dumb numb thumb 
aluminum deceitful 
cement faucet 
emphasize organize orphanage 
pursue sue 
whose who whom 
myriad myth 
subterfuge strange stage range 
triangle angle 
mammal stammer 
innocence innocent 
knack knapsack 
supply supporter 
announcement mince 
receiver reduction 
achieving thieves fried fiend 
office lattice 
interior inferior 
reconcile meanwhile 
barbaric charity 
symmetry mystery 
accidentally detrimental 
encourage encouragement 
faithful doubtful 
mummy summer 
opposite colony agony canopy 
blue 
plausible feasible 
receive retrace 
revere materialism 
parcel faucet 
frivolous jealous 
ancestry criticism 
kindergarten broken token spoken 
cypress cycle 
bomb tomb dumb numb 
extraordinary destiny skeptical detrimental 
language adage damage 
mopped clapped zipped 
one once 
bracelet bravely 
architect mutiny 
knead knives 
necessarily marigold 
grateful conjugate 
compensation desecration 
arrangement vinegar singular particular 
rhyme type my by 
mischievous famous 
clique critique 
facsimile meteor 
preoccupy preceding 
schedule schism 
murmur luxury 
allay daylight 
pale 
heifer heighten 
secret vehicle he be 
manufacturer century 
zest topaz 
turkey donkey 
daytime day 
appeal disappear 
altercation foundation 
callous fibrous 
pursuant sour our flour 
yield yard yarn 
access icy 
misunderstood faculty 
perseverance get when 
geology preoccupy 
unique intrigue 
worship worry 
someone somewhere some 
chasm echo echoing 
worse word worm worth 
congress mattress 
neither heifer 
sluggish egg 
they obey survey 
catastrophe establish 
humid 
writer write 
acquittal guillotine 
everywhere everyone every 
afternoon choose noon boon 
puny 
discernible irresistible visible tangible 
efficient 
chili amphibian 
useful grateful 
flippant slippery 
scholar schism 
misfortune faculty 
when 
expenditure century 
camouflage fibrous 
sincerely hero 
cafeteria interior 
idiosyncrasy crystal 
failure fire mire tire 
willful powerful 
fiftieth chili 
newspaper jewelry 
solo 
oppress 
tomorrow 
does 
shoes 
maneuver 
usual 
befriend 
studies 
cough 
requirement 
hopeless careless 
deceive receive 
offense consent content contend 
irrefutable teachable 
cocoa cocoanuts 
excel except 
graduate usual 
appoint appendix 
crystallize myth 
borrow tomorrow 
unnecessary unfounded 
character characteristic 
duet 
budgeting 
bye dye 
unlikely bravely 
lettuce prejudice 
knowledge knives 
ladybug 
impatience 
inquire 
sure 
chrome chasm 
scarcely homely 
height heifer 
invariable as 
voluntary contrary 
winnow borrow 
humidor 
exceptional election 
juice fruit 

exterior cafeteria 
popcorn 
pretty 
surmount injury 
juggle foggy 
few new 
underdog 
apple happy 
leisure pleasure 
illustration education 
jockey motley 
dogged craggy 
ambush 
dungeon luncheon 
budget budgeting 
serious get when 
crusade 
survive surmount 
nigh thigh 
innumerable teachable 
sanctuary 
bedroom lunchroom 
secretarial parent 
doubt debt 
subtle debt 
disguise inquire 
adjust 
handkerchief studies 
adjunct 
wholly who whom 
whoever who whom 
sheik receiver 
ceiling receiver 
metaphor spherical 
conceit receiver 
synopsis analysis 
policeman unique 
conceive deceive receive 
orchid chasm 
myself 
prairie treaties 
handicapped clapped 
eye 
hobbies treaties 
preschool schism 
personal 
thirtieth fiftieth 
fortunately towel 
grows 
understand 
can't won't 
excite except excel 
miniature chili 
salmon palm calm 
aversion cushion 
library 
paradoxical 
comma summer 
immune commune 
serviceable 
poignant poignancy 
dilemma mammal 
chivalry 
roommate mummy 
deficient efficient 
counterfeit county 
sanctify 
squirrel squirm squirt 
mercurial chili 
hyena 
dehydration 
visual usual 
harmonic barbaric 
partake barbaric 
shoe shoes 
anachronism chasm 
boyhood 
acquit acquaint 
notebook 
pamphlet elephant 
calligraphy metaphor 
require inquire 
cue 
two 
of 
sixth 
chef chivalry 
chute chivalry 
chaise chivalry 
sideways 
friday yesterday 
brochure chivalry 
machine chivalry 
accost accumulate 
thirty 
wolf woman 
lieu 
valiant 
civilian 
pavilion 
familiar 
alien roominess 
behavior 
copier mercurial 
junior 
appreciate 
easier copier 
christmas bustle 
medallion 
always 
genius 
seashore 
assignment 
utopia easier 
aviator alien 
liaison easier 
radioactive chili 
dissociate chili 
testimonial mercurial 
audience roominess 
depreciation fiftieth 
associate miniature 
abbreviate aviator 
cruise fruit 
obedience alien 
encyclopedia mercurial 
expediency alien 
juicy fruit 
poultry shoulder 
what 
jeopardize 
holiday yesterday 
railway yesterday 
cookie prairie 
doesn't does 
questionnaire hair 
fluorescent scent 
audible 
shadow winnow 
elbow winnow 
fallow winnow 
grandfather 
sleight height 
employ employment 
goes 
sleuth maneuver 
neutral maneuver 
manageable 
extravagant 
their 
surgeon dungeon 
police unique 
heiress 
accompanied prairie 
czar 
yacht 
it's 
raccoon accost 
stucco accost 
account accost 
soccer accost 
occur accost 
accuse accost 
psalm 
don't 
laugh 
campaign assignment 
assign assignment 
cologne 
scene scent 
science scent 
treatment 
erroneous 
transcript 
street 
destroy 
mistreat 
pageant manageable 
stranger 
strenuous 
sequel 
sequence sequel 
strength 
avenue 
statue 
artificial 
though 
quote 
vengeance pageant 
adequate 
shrewd newspaper jewelry 
quarantine 
imbue shrewd 
sugar sure 
surely sure 
extension sure 
value 
antique oblique 
argue 
guess quench 
oatmeal 
factual 
queen 
they're 
quack 
lieutenant 
handsome landslide 
feud 
session submission 
issuing submission 
expression 
issue submission 
busy 
income 
grandmother 
instruct 
disbursement 
basketball 
construct 
receipt 
playground grandfather 
ghost 
ghetto 
acknowledgment bondage image 
naive 
quite inquire 
quiet 
beguile 
petite antique 
fatigue clique 
grotesque plaque 
judicious malicious capricious 
cherries studies 
apogee 
virtue 

biscuit 
piece 
noticeable pageant 
hygiene 
especially 
banquet sequel 
subsequent sequel 
delinquent sequel 
board hoarse coarse 
equal 
piquant 
manuscript 
bury 
nondescript grandfather 
liquid 
guitar 
quixotic 
equilibrium biscuit 
surfeit 
foreign 
ocean pageant 
impatient impatience 
says 
goldfish 
splendid 
splinter 
awful 
waltz 
answer 
island 
routine 
roulette 
asphalt basketball 
volleyball basketball 
sidewalk basketball 
friend befriend 
precious judicious 
forked zipped 
pieced mopped 
guide 
acquire 
women 
headquarters 
rhythm 
monologue 
bicycle synopsis 
larynx synopsis 
gymnasium synopsis 
hosiery glacier 
aerial 
autumn 
joyous 
throughout 
quorum 
liquor 
measles 
retail 
beauty 
weird 
ancient impatient 
query 
lacquer 
cashier 
plaid 
continue 
discrepancy 
persuade 
assuage 
financial 
potential 
parliament 
commercial 
coffee 
committee 
employee 
gaseous erroneous 
extraneous erroneous 
decide 
periodical 
basement disbursement 
cachet 
mildew 
debris 
fired 
people 
whatever 
transient ancient 
somersault 
rapport 
mortgage 
afterthought 
jeopardy jeopardize 
chocolate 
admiral directory 
direction directory 
giraffe directory 
toothbrush 
business 
applebee 
chauffeur 
fillet 
squall 
colleague 
moreover 
conscious 
conscience 
underwear 
hawaii 
gauge 
furious 
laborious 
fastidious 
highland 
sculptor 
shambles 
lengthen 
quotation 
khaki 
vacuum 
contiguous 
barbecue 
rapacious 
poetically 
evening 
epicure 
intrinsic 
nineteenth 
synonym 
turmoil 
courtship 
thoroughbred 
quartet 
sailboat 
squander 
daybreak 
forfeit 
genuine 
austere 
exchange 
dessert 
dissolve 
scissors 
carburetor 
mosquito 
wednesday 
tipped 
anonymous 
beautiful 
withhold 
newsstand 
indoors 
invoice 
awkward 
obnoxious 
brilliance 
flamboyant 
gorgeous 
shepherd 
resource 
earthquake 
`;
