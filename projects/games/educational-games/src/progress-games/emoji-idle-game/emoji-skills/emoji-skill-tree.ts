/* eslint-disable @typescript-eslint/naming-convention */
export type EmojiSkillNode = {
  emoji: string;
  name: string;
  gender: `baby` | `male` | `female`;
  pay: number;
  startEmoji: null | string;
  requirementEmojis: string[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  const maleNodes = parseSkillDoc(maleSkillDoc, `male`);
  const femaleNodes = parseSkillDoc(femaleSkillDoc, `female`);
  const babyNode: EmojiSkillNode = {
    emoji: babyEmoji,
    name: `baby`,
    gender: `baby`,
    pay: 0,
    requirementEmojis: [],
    startEmoji: null,
    parent: null,
    children: [],
  };
  const allNodes = [babyNode, ...maleNodes, ...femaleNodes];
  const root = babyNode;

  allNodes.forEach((child) => {
    const parent = allNodes.find((x) => child.startEmoji === x.emoji);
    if (!parent) {
      return;
    }

    parent.children.push(child);
    child.parent = parent;
  });

  const allRequirements = parseRequirementsDoc(requirementsDoc);

  allNodes.forEach((node) => {
    const allCosts = node.requirementEmojis.map(
      (r) => allRequirements.find((x) => x.emoji === r) ?? { emoji: r, cost: 0 },
    );

    const summary = allCosts.map((x) => `${x.emoji} = ${x.cost}`).join(`\n`);

    const totalCost = allCosts.reduce((out, x) => {
      out += x.cost;
      return out;
    }, 0);
    node.debug_totalRequirementsCost = `${totalCost} =\n${summary}`;
  });

  const tree: EmojiSkillTree = {
    allNodes,
    root,
    allRequirements,
  };

  // const allRequirements = distinct(allNodes.flatMap(x => x.requirementEmojis));
  // const allRequirementsDoc = allRequirements.map(x => `${x} = 0`).join(`\n`);

  // console.log(`buildSkillTree`, { tree, maleSkillDoc, femaleSkillDoc });
  return tree;
};
// setTimeout(buildEmojiSkillTree);

const parseRequirementsDoc = (doc: string) => {
  const lines = doc
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);
  const nodes = lines.map((line) => {
    const parts = line
      .split(`=`)
      .map((x) => x.trim())
      .filter((x) => x);
    const r: EmojiSkillRequirement = {
      emoji: parts[0],
      cost: Number.parseInt(parts[1], 10),
    };
    return r;
  });
  return nodes;
};

const parseSkillDoc = (doc: string, gender: 'male' | 'female') => {
  const lines = doc
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);
  const nodes = lines.map((x) => parseSkillLine(x, gender));
  return nodes;
};

const parseSkillLine = (skillLine: string, gender: 'male' | 'female'): EmojiSkillNode => {
  const [name, payText, p1] = skillLine.split(`:`).map((x) => x.trim());
  const pay = Number.parseInt(payText, 10);
  const [end, p2] = p1.split(`=`).map((x) => x.trim());
  const [start, requirementsStr] = p2.split(`+`).map((x) => x.trim());
  const requirements = requirementsStr
    .split(` `)
    .map((x) => x.trim())
    .filter((x) => x);
  return {
    name,
    pay,
    emoji: end,
    startEmoji: start,
    requirementEmojis: requirements,
    children: [],
    parent: null,
    gender,
  };
};

const getFemaleVariant = (emoji: string) => {
  return (
    emoji
      // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
      .replace(new RegExp(genderCharCodes.male, `g`), genderCharCodes.female)
      // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
      .replace(new RegExp(genderCharCodes.man, `g`), genderCharCodes.woman)
  );
};

const genderCharCodes = {
  man: String.fromCodePoint(0x1f468),
  woman: String.fromCodePoint(0x1f469),
  male: String.fromCodePoint(0x1f469),
  female: String.fromCodePoint(0x1f469),
};

const babyEmoji = `👶`;
const child_male = `boy               : 0 : 👦 = 👶 + 🍼 🧸 👕 👖 🧦 🩲 👟 📖 🪁 🚲 🎮`;
const child_female = `girl            : 0 : 👧 = 👶 + 🍼 🧸 👚 👗 🩰 🩱 🥿 📖 🪁 🚲 🎮`;
const student_male = `  student_boy   : 0 : 👨‍🎓 = 👦 + 🍕 ✏️ 📓 📚 ⏰ 📱 💻 🚗 🧳 🎓`;
const student_female = `student_girl  : 0 : 👩‍🎓 = 👧 + 🍕 ✏️ 📓 📚 ⏰ 📱 💻 🚗 🧳 🎓`;

const skillDoc = `
factory_worker      :   20000 : 👨‍🏭 = 👨‍🎓 + 🧤 🥾 🔧 ⏲ 📋 🚗              
mechanic            :   30000 : 👨‍🔧 = 👨‍🎓 + 🧤 🥾 🧰 🔧 🔩 🚚         
construction_worker :   75000 : 👷‍♂️ = 👨‍🎓 + 🦺 🥾 🧰 🔧 🔨 ⚒ 🧱 🧨 🚙                    
artist              :   35000 : 👨‍🎨 = 👨‍🎓 + 🎨 🖌 🖊 🖋 🖍 ✏️ 📒 🖼 💡 📷 🚗          
singer              :   40000 : 👨‍🎤 = 👨‍🎓 + 🎤 🎧 🎼 🎹 🥁 🎻 🎥 🚗       
farmer              :   50000 : 👨‍🌾 = 👨‍🎓 + 🧢 🥾 🥚 🐕 🐈 🐓 🐄 🐖 🐑 🐐 🚜        
cook                :   40000 : 👨‍🍳 = 👨‍🎓 + 🍓 🥑 🥕 🥩 🍤 🥚 🥫 🥄 🍴 🧂 ⏰ 🔪 🚗      
firefighter         :   55000 : 👨‍🚒 = 👨‍🎓 + ⛑️ 🧯 🥾 🪓 🔔 🚒    
police_officer      :   60000 : 👮‍♂️ = 👨‍🎓 + 🧢 ⚖️ 🔫 🥊 🤼 📢 🚓             
detective           :   70000 : 🕵️‍♂️ = 👨‍🎓 + 👔 ⚖️ 🔦 🔎 📋 💼 🚓          
teacher             :   50000 : 👨‍🏫 = 👨‍🎓 + 📝 📒 📕 📗 📘 📙 🚐
office_worker       :   60000 : 👨‍💼 = 👨‍🎓 + 👔 💼 💻 🗄 🪑 📁 📊 🚗             
technologist        :   80000 : 👨‍💻 = 👨‍🎓 + 💻 ⌨️ 🖥 📱 🖱 🎮 🤖 🚗              
scientist           :   90000 : 👨‍🔬 = 👨‍🎓 + 🥼 🥽 🔬 💻 🧫 🧪 ⚗️ 🚗            
judge               :  120000 : 👨‍⚖️ = 👨‍🎓 + 👔 ⚖️ 💼 📚 🗃 🕰 🚗   
health_worker       :  100000 : 👨‍⚕️ = 👨‍🎓 + 🥼 ⛑ 🔬 🩹 🩺 💊 💉 🧫 ⛑ 🚑
pilot               :  110000 : 👨‍✈️ = 👨‍🎓 + 🧥 🧭 💻 🕹 ✈️       
astronaut           :  130000 : 👨‍🚀 = 👨‍🎓 + 🧥 🔭 💻 🕹 🚀  
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
