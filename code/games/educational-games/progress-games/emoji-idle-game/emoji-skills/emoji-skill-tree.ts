export type EmojiSkillNode = {
    emoji: string;
    name: string;
    startEmoji: null | string;
    requirementEmojis: string[];
    debug_totalRequirementsCost?: string;

    parent: null | EmojiSkillNode;
    children: EmojiSkillNode[];
};
export type EmojiSkillRequirement = {
    emoji: string;
    cost: number;
};
export type EmojiSkillTree = {
    allNodes: EmojiSkillNode[];
    allRequirements: EmojiSkillRequirement[];
    root: EmojiSkillNode;
};


export const buildEmojiSkillTree = (): EmojiSkillTree => {
    const maleSkillDoc = `${child_male}\n${student_male}\n${skillDoc}`;
    const femaleSkillDoc = `${child_female}\n${student_female}\n\n${getFemaleVariant(skillDoc)}`;
    const maleNodes = parseSkillDoc(maleSkillDoc);
    const femaleNodes = parseSkillDoc(femaleSkillDoc);
    const babyNode: EmojiSkillNode = {
        emoji: babyEmoji,
        name: `baby`,
        requirementEmojis: [],
        startEmoji: null,
        parent: null,
        children: [],
    };
    const allNodes = [babyNode, ...maleNodes, ...femaleNodes];
    const root = babyNode;

    allNodes.forEach(child => {
        const parent = allNodes.find(x => child.startEmoji === x.emoji);
        if (!parent) { return; }

        parent.children.push(child);
        child.parent = parent;
    });

    const allRequirements = parseRequirementsDoc(requirementsDoc);

    allNodes.forEach(node => {
        const allCosts = node.requirementEmojis
            .map(r => allRequirements.find(x => x.emoji === r) ?? { emoji: r, cost: 0 });

        const summary = allCosts
            .map(x => `${x.emoji} = ${x.cost}`)
            .join(`\n`);

        // eslint-disable-next-line unicorn/no-reduce
        const totalCost = allCosts.reduce((out, x) => { out += x.cost; return out; }, 0);
        node.debug_totalRequirementsCost = `${totalCost} =\n${summary}`;
    });

    const tree: EmojiSkillTree = {
        allNodes,
        root,
        allRequirements,
    };

    // const allRequirements = distinct(allNodes.flatMap(x => x.requirementEmojis));
    // const allRequirementsDoc = allRequirements.map(x => `${x} = 0`).join(`\n`);

    console.log(`buildSkillTree`, { tree, maleSkillDoc, femaleSkillDoc });
    return tree;
};
setTimeout(buildEmojiSkillTree);

const parseRequirementsDoc = (doc: string) => {
    const lines = doc.split(`\n`).map(x => x.trim()).filter(x => x);
    const nodes = lines.map(line => {
        const parts = line.split(`=`).map(x => x.trim()).filter(x => x);
        const r: EmojiSkillRequirement = {
            emoji: parts[0],
            cost: Number.parseInt(parts[1], 10),
        };
        return r;
    });
    return nodes;
};

const parseSkillDoc = (doc: string) => {
    const lines = doc.split(`\n`).map(x => x.trim()).filter(x => x);
    const nodes = lines.map(x => parseSkillLine(x));
    return nodes;
};

const parseSkillLine = (skillLine: string): EmojiSkillNode => {
    const [name, p1] = skillLine.split(`:`).map(x => x.trim());
    const [end, p2] = p1.split(`=`).map(x => x.trim());
    const [start, requirementsStr] = p2.split(`+`).map(x => x.trim());
    const requirements = requirementsStr.split(` `).map(x => x.trim()).filter(x => x);
    return { name, emoji: end, startEmoji: start, requirementEmojis: requirements, children: [], parent: null };
};

const getFemaleVariant = (emoji: string) => {
    return emoji
        .replace(new RegExp(genderCharCodes.male, `g`), genderCharCodes.female)
        .replace(new RegExp(genderCharCodes.man, `g`), genderCharCodes.woman);
};

const genderCharCodes = {
    man: String.fromCodePoint(0x1F468),
    woman: String.fromCodePoint(0x1F469),
    male: String.fromCodePoint(0x1F469),
    female: String.fromCodePoint(0x1F469),
};

const babyEmoji = `👶`;
const child_male = `boy    : 👦 = 👶 + 🍼 🧸 👕 👖 🧦 🩲 👟 📖 🪁 🚲 🎮`;
const child_female = `girl  : 👧 = 👶 + 🍼 🧸 👚 👗 🩰 🩱 🥿 📖 🪁 🚲 🎮`;
const student_male = `  student_boy   : 👨‍🎓 = 👦 + 🍕 ✏️ 📓 📚 ⏰ 📱 💻 🚗 🧳 🎓`;
const student_female = `student_girl  : 👩‍🎓 = 👧 + 🍕 ✏️ 📓 📚 ⏰ 📱 💻 🚗 🧳 🎓`;

const skillDoc = `
factory_worker         : 👨‍🏭 = 👨‍🎓 + 🧤 🥾 🔧 ⏲ 📋 🚗              
mechanic               : 👨‍🔧 = 👨‍🎓 + 🧤 🥾 🧰 🔧 🔩 🚚         
construction_worker    : 👷‍♂️ = 👨‍🎓 + 🦺 🥾 🧰 🔧 🔨 ⚒ 🧱 🧨 🚙                    
artist                 : 👨‍🎨 = 👨‍🎓 + 🎨 🖌 🖊 🖋 🖍 ✏️ 📒 🖼 💡 📷 🚗          
singer                 : 👨‍🎤 = 👨‍🎓 + 🎤 🎧 🎼 🎹 🥁 🎻 🎥 🚗       
farmer                 : 👨‍🌾 = 👨‍🎓 + 🧢 🥾 🥚 🐕 🐈 🐓 🐄 🐖 🐑 🐐 🚜        
cook                   : 👨‍🍳 = 👨‍🎓 + 🍓 🥑 🥕 🥩 🍤 🥚 🥫 🥄 🍴 🧂 ⏰ 🔪 🚗      
firefighter            : 👨‍🚒 = 👨‍🎓 + ⛑️ 🧯 🥾 🪓 🔔 🚒    
police_officer         : 👮‍♂️ = 👨‍🎓 + 🧢 ⚖️ 🔫 🥊 🤼 📢 🚓             
detective              : 🕵️‍♂️ = 👨‍🎓 + 👔 ⚖️ 🔦 🔎 📋 💼 🚓          
teacher                : 👨‍🏫 = 👨‍🎓 + 📝 📒 📕 📗 📘 📙 🚐
office_worker          : 👨‍💼 = 👨‍🎓 + 👔 💼 💻 🗄 🪑 📁 📊 🚗             
technologist           : 👨‍💻 = 👨‍🎓 + 💻 ⌨️ 🖥 📱 🖱 🎮 🤖 🚗              
scientist              : 👨‍🔬 = 👨‍🎓 + 🥼 🥽 🔬 💻 🧫 🧪 ⚗️ 🚗            
judge                  : 👨‍⚖️ = 👨‍🎓 + 👔 ⚖️ 💼 📚 🗃 🕰 🚗   
health_worker          : 👨‍⚕️ = 👨‍🎓 + 🥼 ⛑ 🔬 🩹 🩺 💊 💉 🧫 ⛑ 🚑
pilot                  : 👨‍✈️ = 👨‍🎓 + 🧥 🧭 💻 🕹 ✈️       
astronaut              : 👨‍🚀 = 👨‍🎓 + 🧥 🔭 💻 🕹 🚀  
`;

const requirementsDoc = `
🍼 = 10
🧸 = 10
👕 = 20
👖 = 20
🧦 = 10
🩲 = 20
👟 = 30
📖 = 50
🪁 = 25
🚲 = 150
🎮 = 200

👚 = 20
👗 = 20
🩰 = 10
🩱 = 20
🥿 = 30

🍕 = 30
✏️ = 10
📓 = 20
📚 = 500
⏰ = 15
📱 = 350
💻 = 1250
🚗 = 7000
🧳 = 800
🎓 = 10000

🧤 = 20
🥾 = 80
🔧 = 110
⏲ = 25
📋 = 15
🧰 = 300
🔩 = 700
🚚 = 35000
🦺 = 150
🔨 = 75
⚒ = 150
🧱 = 3000
🧨 = 16000
🚙 = 32000
🎨 = 100
🖌 = 70
🖊 = 50
🖋 = 35
🖍 = 15
📒 = 15
🖼 = 80
💡 = 150
📷 = 400
🎤 = 150
🎧 = 120
🎼 = 750
🎹 = 320
🥁 = 450
🎻 = 320
🎥 = 1450
🧢 = 25
🥚 = 10
🐕 = 35
🐈 = 25
🐓 = 30
🐄 = 350
🐖 = 150
🐑 = 120
🐐 = 100
🚜 = 15000
🍓 = 25
🥑 = 30
🥕 = 20
🥩 = 75
🍤 = 100
🥫 = 50
🥄 = 120
🍴 = 350
🧂 = 120
🔪 = 225
⛑️ = 150
🧯 = 250
🪓 = 50
🔔 = 75
🚒 = 135000
⚖️ = 15000
🔫 = 750
🥊 = 500
🤼 = 1250
📢 = 150
🚓 = 55000
👔 = 250
🔦 = 55
🔎 = 85
💼 = 125
📝 = 25
📕 = 75
📗 = 25
📘 = 60
📙 = 30
🚐 = 16000
🗄 = 250
🪑 = 150
📁 = 50
📊 = 750
⌨️ = 75
🖥 = 150
🖱 = 50
🤖 = 1500
🥼 = 150
🥽 = 25
🔬 = 3500
🧫 = 150
🧪 = 300
⚗️ = 250
🗃 = 150
🕰 = 650
⛑ = 150
🩹 = 100
🩺 = 120
💊 = 1200
💉 = 1500
🚑 = 75000
🧥 = 550
🧭 = 50
🕹 = 850
✈️ = 1500000
🔭 = 350
🚀 = 150000000
`;
