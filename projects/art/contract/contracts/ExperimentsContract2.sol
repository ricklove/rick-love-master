  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function generateSvg(uint _rvs) public pure returns (string memory) {
        string memory output;

// DataPack 
string memory dataPack = "ffdeb81e1b1aded2cffafafa100f0f604f870000009d9df0161f2d6a6aa0ededede9928b121212050505f6f6f6d9b4f3383838d4c2ff7326822e253cb17b5d70aeffd5ddecfcfcfc4986e964a4f7e0edff0f408a5f5fce1f27321b294b2a3f6f9a847edbd2d26354557c6e6adfc7f53d3d3dd4b2f5573e70f0f0f0415d81c9d1decedff21c3040354e6e9797dd182c498e8ef0402f7523232f73635ed5d0cde7dcda6a514d685550c1a7dc2d24261c12135757571f1a19171617dee2e73c84e29696f3621e6b40406d262626c6d0e1ced6e320252e9ba8bf34455f2d35434459792929299a4c5eeeb8ffefdff1fef0ffbe73d3eab1fbbe6dd5522e5c944da829183e572960361b34fff4b8dfdccefff8ebc0a46df8eba0b19b59615538b191683f2224352a18231e158f6a5669a27cd6dece4171504558376a9a7a44573520231f313a341f2e24d8d8f3e9e9f2ebebffb6b6eccecef39788d37979b4a8a8f040405e7575a9f5f5f5b4c7e4d7e0ef8a9dc1a3b8d78288ba3e3e6056567b27273a58586f7594f0dccade1d24491f2538bb91d4151537808080fff9d6aee9f9a3faca669cff0209ef00372c00003d5b175601490000332300003f581c50014e05002f061a3f47561960064f0100342000003b562f5f054d03003214005f005a19640446050036307259634f265b054d0500342b400036582559034f00003831003f225c15630646080d3b25001a00541466194904003221b94c4850375b1156030038304000404f2159004b070035252e1e1f54295c0246050f38250000395418611d50060d37247264005529631446050f3728000078532758184a02003232b02b78531f440b4d0b002d1e64003b5128570b6201003220000040573562045003650a501957253117320734281b650a501e322e1000321446141d650d4d1e392c110132114500177d0a4c1e2c220a0e320035201d830a491e37320b0d340a32161e650a501e471c1d1d321132251c650651342c220a0e320027331900063f14003603167c3e4633190c0c3f2c3a0018173e323339195f064c402c220a0d0000332819650a502357251a0532053a281b480d501243362412910e542a19650a501e53202f08340a5019198906541a4d362e0e2d253725190a08043c12151404280c080414120f150528060805280712140528080d056411051501260908045a121015052811080600120a1408250b0a063211021404250c0d045a16001402280908002810111303280908043c0e101305280c080432120f15042800090432021615022806050446030f1408280c0001640f11160b281e0c1c151e1d160f0d0d1e07018a43080a0b00d5430a0508016243060f0c00d5160e050b0078000e0a0c012b03080b0d00d5260f0a0a01001303080d013258000e0d211e6404071204211e640407120300006604071404000066040714030a0908070605040303010201000d131211100f0e0d0c030a030b1f1e1d1c1b1a19181715161514101027262524232217202120000c3231302f2e2d2c2b292a29283d3c3b3a393837363533343328434241401b1a013f01173e17004b4a064849484647464445442857565554535251504f4d4e4d4c6261605f5e5d5c5b5a5859584c0a6c066b6a696867666465646377767574737271706f6d6e6d14807f067e7d7c7b7a1a7879782806068786068584834f8182811488898a8b068c000103050204081009000102060c10302024284080c0<?xml version='1.0' encoding='UTF-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-color:#'/></linearGradient><linearGradient id='x2'><stop style='stop-color:#'/></linearGradient><linearGradient id='x3'><stop style='stop-color:#'/></linearGradient><linearGradient id='x4'><stop style='stop-color:#'/></linearGradient><linearGradient id='x5'><stop style='stop-color:#'/></linearGradient><linearGradient id='x6'><stop style='stop-color:#'/></linearGradient><linearGradient id='x7'><stop style='stop-color:#'/></linearGradient><linearGradient id='x8'><stop style='stop-color:#'/></linearGradient><linearGradient id='x9'><stop style='stop-color:#'/></linearGradient><linearGradient id='x10'><stop style='stop-color:#'/></linearGradient><linearGradient id='x11'><stop style='stop-color:#'/></linearGradient><linearGradient id='x12'><stop style='stop-color:#'/></linearGradient><linearGradient id='x13'><stop style='stop-color:#'/></linearGradient><linearGradient id='x14'><stop style='stop-color:#'/></linearGradient><linearGradient id='x15'><stop style='stop-color:#'/></linearGradient><linearGradient id='x16'><stop style='stop-color:#'/></linearGradient><linearGradient id='x17'><stop style='stop-color:#'/></linearGradient><linearGradient id='x18'><stop style='stop-color:#'/></linearGradient><linearGradient id='x19'><stop style='stop-color:#'/></linearGradient><linearGradient><stop style='stop-color:#'/></linearGradient><linearGradient id='x20'><stop style='stop-color:#'/></linearGradient><linearGradient id='x21'><stop style='stop-color:#'/></linearGradient><linearGradient id='x22'><stop style='stop-color:#'/></linearGradient><linearGradient id='x23'><stop style='stop-color:#'/></linearGradient><filter id='x24' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0 0' result='blur'/></filter><filter id='x25' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0.5 0.5' result='blur'/></filter><filter id='x26' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='5 5' result='blur'/></filter><filter id='x27' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='3 3' result='blur'/></filter></defs><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x1)'/><g transform='translate(150.0,150.0) scale(1)'><g style='filter:url(#x24)'><animateMotion dur='17s' repeatCount='indefinite' path='M2,5c0,-5,3,5,3,0c0,-5-3,5-3,0Z'/><clipPath id='x28' clipPathUnits='userSpaceOnUse'><path d='M,LZ'/></clipPath><g clip-path='url(#x28)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x2)'/><g opacity=''><path id='x29' style='fill:none;stroke:url(#x5);stroke-width:14' d=''/><use xlink:href='#x29' transform='translate(0, 27)'/><use xlink:href='#x29' transform='translate(0, 54)'/><use xlink:href='#x29' transform='translate(0, 81)'/><use xlink:href='#x29' transform='translate(0, 108)'/></g><g opacity=''><path style='fill:url(#x7)' d='MZ'/><path style='fill:url(#x8)' d='MZ'/></g><g opacity=''><g id='x30'><path id='x31' style='fill:url(#x5);filter:url(#x25)' d='Mc60,15,60,20,60,20c0,5-60,-10-60,-10z'/><use xlink:href='#x31' transform='translate( -4, 18)'/><use xlink:href='#x31' transform='translate( -8,36)'/><use xlink:href='#x31' transform='translate(-12,54)'/></g><use xlink:href='#x30' transform='scale(-1,1)'/></g><g opacity=''><path style='fill:url(#x4)' d='MH'><ellipse style='fill:url(#x4)' cx='0' cy='165' rx='' ry='50'/></g></g><g><path style='fill:url(#x11);filter:url(#x26)' clip-path='url(#x28)' d='M-90,-5c0,0,40,-40,90,-40c50,0,90,40,90,40c0,0,10,50,10,70c-20,0,-70,30,-100,30c-30,0,-80,-30,-100,-30c0,-20,10,-70,10,-70z'/></g></g><g><g transform='scale(,1)'><g><g><clipPath id='x32' clipPathUnits='userSpaceOnUse'><path d='S50,0,0,0Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x13)' clip-path='url(#x32)'/><g id='x33'><animateMotion dur='31s' repeatCount='indefinite' path='M0,3c0,-3,2,3,2,0c0,-3-2,3-2,0Z'/><clipPath id='x34' clipPathUnits='userSpaceOnUse'><path d='Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x14)' clip-path='url(#x34)'/></g></g><g><g transform='scale(-1,1)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x12)' clip-path='url(#x32)'/><use xlink:href='#x33'/></g></g></g><g style='filter:url(#x24)'><clipPath id='x35' clipPathUnits='userSpaceOnUse'><path d='z'/></clipPath><g clip-path='url(#x35)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x3)'/><g opacity=''><ellipse style='fill:url(#x4)' cx='0' cy='' rx='60' ry='60'/></g><g opacity=''><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:6' d='M0,L-124,L124,'><ellipse style='fill:url(#x4)' cx='10' cy='' rx='11' ry='11'/><ellipse style='fill:url(#x4)' cx='-10' cy='' rx='11' ry='11'/></g><g opacity=''><path style='fill:url(#x4)' d='L150,-150Z'/></g><g opacity=''><ellipse style='fill:url(#x6)' cx='-68' cy='' rx='75' ry='100'/></g><g opacity=''><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M-16,L16,'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M0,5L-16,'><ellipse style='fill:url(#x9)' cx='0' cy='' rx='16' ry='35'/><ellipse style='fill:url(#x10)' cx='-76' cy='' rx='70' ry='100'/><ellipse style='fill:url(#x9)' cx='76' cy='' rx='70' ry='100'/></g><g><path opacity='' id='x36' style='fill:url(#x5);filter:url(#x25)' d='Mc60,0,60,5,60,5c0,5,-60,5,-60,5z'/><use xlink:href='#x36' transform='translate(0,14)'/><use xlink:href='#x36' transform='translate(0,-14)'/><use xlink:href='#x36' transform='translate(0,0) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,14) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,-14) scale(-1,1)'/><path opacity='' id='x37' style='fill:url(#x5);filter:url(#x25)' d='M-20,c0,60,5,60,5,60c5,0,5,-60,5,-60z'/><use xlink:href='#x37' transform='translate(15,4)'/><use xlink:href='#x37' transform='translate(30,0)'/></g></g></g></g><g><g transform='translate() translate(-,-)'><clipPath id='x38' clipPathUnits='userSpaceOnUse'><path id='x39' transform='translate() scale(1,1) rotate()' d='z'><animate attributeName='d' type='xml' repeatCount='indefinite' dur='4s' keyTimes='0;0.4;0.5;0.6;1' values='   z;  z '/></path></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x16)' clip-path='url(#x38)'/><g clip-path='url(#x38)'><g transform='translate()'><g id='x40'><ellipse style='fill:url(#x18)' cx='' cy='' rx='' ry=''><animateMotion dur='20s' repeatCount='indefinite' path='M0,0c0,-5,3,5,3,0c0,-10-6,10-6,0Z'/></ellipse><g><g transform='translate()'><circle r='25' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g><g transform='translate()'><circle r='15' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g></g></g></g></g><use id='x41' xlink:href='#x39' style='stroke-width:2;stroke:url(#x17);fill:transparent'/></g><g transform='translate(-) translate()'><rect x='-300' y='-300' width='600' height='600' transform='scale(-1,1)' style='fill:url(#x15)' clip-path='url(#x38)'/><g clip-path='url(#x38)' transform='scale(-1,1)'><g transform='translate() scale(-1,1)'><use xlink:href='#x40'/></g></g><use xlink:href='#x41' transform='scale(-1,1)'/></g></g><g transform='translate(0,)'><g transform='translate(0,0)'><g transform='translate(0,0)'><path style='fill:none;stroke:url(#x20);stroke-width:1.5' d=''/><path id='x42' style='fill:none;stroke:url(#x20);stroke-width:1.5' d=''/><use xlink:href='#x42' transform='scale(-1,1)'/><g opacity='' transform='translate(0,0)'><g id='x43' transform='translate()'><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate('/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate('/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' opacity='' transform='rotate('/></g><use xlink:href='#x43' transform='scale(-1,1)'/></g></g></g></g><g transform='translate(0,0)'><path style='fill:url(#x21);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d='Z'/><path id='x44' style='fill:url(#x22);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d=''/><use xlink:href='#x44' transform='scale(-1,1)'/></g></g></g></svg>";

        assembly {
// START ---    


            function getRvsValue(bitShift) -> value {
                let rvs := mload(add(mload(0x40),0x00))
                value := and(0xff, shr(bitShift, rvs))
            }
    

            // Select Breed Data from rvs value
            function selectBreed() -> breedData {
                let rvs_breed        := getRvsValue(0x00)
                let rvs_body         := getRvsValue(0x08)
                let rvs_face         := getRvsValue(0x10)
                let rvs_palette      := getRvsValue(0x18)
                let rvs_eyeColor     := getRvsValue(0x68)

                
                if lt(rvs_breed, 51) { 
                    // Breed: black
                    // {"name":"black","odds":51,"b_body":[0,4,5,6],"b_face":[0,1,2,3,4,5,6,7,8,9],"b_palettes":[0],"b_eyes":[0,1,2,3],"b_tabbyFaceOdds":0}
                    breedData := 0x00000000000000000103
                    let m := 0
                    let mask := 0xff

                    
                    // body: [0,4,5,6]
                    m := mod(rvs_body, 4)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 3 = 4 <=> 3 + 3 = 6                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 3))) }
                    
                    // face: [0,1,2,3,4,5,6,7,8,9]
                    m := mod(rvs_face, 10)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 0 = 1 <=> 9 + 0 = 9                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 0))) }
                    
                    // eyes: [0,1,2,3]
                    m := mod(rvs_eyeColor, 4)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 3 + 0 = 3                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 77) { 
                    // Breed: white
                    // {"name":"white","odds":26,"b_body":[0,6],"b_face":[0,10,11,12],"b_palettes":[1],"b_eyes":[0,1,2],"b_tabbyFaceOdds":0}
                    breedData := 0x01000000000001000113
                    let m := 0
                    let mask := 0xff

                    
                    // body: [0,6]
                    m := mod(rvs_body, 2)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 5 = 6                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 5))) }
                    
                    // face: [0,10,11,12]
                    m := mod(rvs_face, 4)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 9 = 10 <=> 3 + 9 = 12                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 9))) }
                    
                    // eyes: [0,1,2]
                    m := mod(rvs_eyeColor, 3)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 2 + 0 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 177) { 
                    // Breed: tabby
                    // {"name":"tabby","odds":100,"b_body":[1,2,3,4,5,6,7],"b_face":[1,2,3,4,5,6,7,8,9],"b_palettes":[2,3,4],"b_eyes":[0,1,2],"b_tabbyFaceOdds":255}
                    breedData := 0x02ff0000010102000103
                    let m := 0
                    let mask := 0xff

                    
                    // body: [1,2,3,4,5,6,7]
                    m := mod(rvs_body, 7)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 1 = 2 <=> 6 + 1 = 7                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 1))) }
                    
                    // face: [1,2,3,4,5,6,7,8,9]
                    m := mod(rvs_face, 9)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 1 = 2 <=> 8 + 1 = 9                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 1))) }
                    
                    // palettes: [2,3,4]
                    m := mod(rvs_palette, 3)
                    mask := not(shl(0x30, 0xff))
                        // 1 + 2 = 3 <=> 2 + 2 = 4                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x30, add(m, 2))) }
                    
                    // eyes: [0,1,2]
                    m := mod(rvs_eyeColor, 3)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 2 + 0 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 197) { 
                    // Breed: shorthair
                    // {"name":"shorthair","odds":20,"b_body":[0,4,5,6],"b_face":[0,1,4,6,7,8],"b_palettes":[5],"b_eyes":[3],"b_tabbyFaceOdds":0}
                    breedData := 0x03000000000005030003
                    let m := 0
                    let mask := 0xff

                    
                    // body: [0,4,5,6]
                    m := mod(rvs_body, 4)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 3 = 4 <=> 3 + 3 = 6                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 3))) }
                    
                    // face: [0,1,4,6,7,8]
                    m := mod(rvs_face, 6)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 0 = 1                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 0))) }
                        // 2 + 2 = 4                
                        if gt(m, 1)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 2))) }
                        // 3 + 3 = 6 <=> 5 + 3 = 8                
                        if gt(m, 2)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 3))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 214) { 
                    // Breed: calico
                    // {"name":"calico","odds":17,"b_body":[6],"b_face":[1,12],"b_palettes":[6],"b_eyes":[0,1,2],"b_tabbyFaceOdds":0}
                    breedData := 0x0400000006010600013b
                    let m := 0
                    let mask := 0xff

                    
                    // face: [1,12]
                    m := mod(rvs_face, 2)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 11 = 12                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 11))) }
                    
                    // eyes: [0,1,2]
                    m := mod(rvs_eyeColor, 3)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 2 + 0 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 224) { 
                    // Breed: siamese
                    // {"name":"siamese","odds":10,"b_body":[0,6],"b_face":[0,8],"b_palettes":[7],"b_eyes":[0,1,2],"b_tabbyFaceOdds":0}
                    breedData := 0x05000000000007000113
                    let m := 0
                    let mask := 0xff

                    
                    // body: [0,6]
                    m := mod(rvs_body, 2)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 5 = 6                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 5))) }
                    
                    // face: [0,8]
                    m := mod(rvs_face, 2)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 7 = 8                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 7))) }
                    
                    // eyes: [0,1,2]
                    m := mod(rvs_eyeColor, 3)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 2 + 0 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 229) { 
                    // Breed: sphynx
                    // {"name":"sphynx","odds":5,"b_body":[0],"b_face":[0],"b_palettes":[11],"b_eyes":[0,1,2],"b_head":15,"b_ear":11,"b_tabbyFaceOdds":0}
                    breedData := 0x06000f0b00000b000102
                    let m := 0
                    let mask := 0xff

                    
                    // eyes: [0,1,2]
                    m := mod(rvs_eyeColor, 3)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 2 + 0 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 234) { 
                    // Breed: sandcat
                    // {"name":"sandcat","odds":5,"b_body":[3,8],"b_face":[6],"b_palettes":[12],"b_eyes":[0,1],"b_head":16,"b_ear":12,"b_tabbyFaceOdds":255}
                    breedData := 0x07ff100c03060c000103
                    let m := 0
                    let mask := 0xff

                    
                    // body: [3,8]
                    m := mod(rvs_body, 2)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 7 = 8                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 7))) }
                    
                    // eyes: [0,1]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 239) { 
                    // Breed: toyger
                    // {"name":"toyger","odds":5,"b_body":[3,8],"b_face":[6],"b_palettes":[13],"b_eyes":[0,1,2],"b_head":17,"b_ear":13,"b_tabbyFaceOdds":255}
                    breedData := 0x08ff110d03060d000103
                    let m := 0
                    let mask := 0xff

                    
                    // body: [3,8]
                    m := mod(rvs_body, 2)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 7 = 8                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 7))) }
                    
                    // eyes: [0,1,2]
                    m := mod(rvs_eyeColor, 3)
                    mask := not(shl(0x38, 0xff))
                        // 1 + 0 = 1 <=> 2 + 0 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x38, add(m, 0))) }
                    
                    // eyesHeterochromia: [1,2]
                    m := mod(rvs_eyeColor, 2)
                    mask := not(shl(0x40, 0xff))
                        // 1 + 1 = 2                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x40, add(m, 1))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 251) { 
                    // Breed: alien
                    // {"name":"alien","odds":12,"b_body":[1,2,3,4,5,6,8],"b_face":[1,2,3,4,5,6,7,8,9],"b_palettes":[8,9],"b_eyes":[4],"b_tabbyFaceOdds":127}
                    breedData := 0x097f0000010108040001
                    let m := 0
                    let mask := 0xff

                    
                    // body: [1,2,3,4,5,6,8]
                    m := mod(rvs_body, 7)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 1 = 2 <=> 5 + 1 = 6                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 1))) }
                        // 6 + 2 = 8                
                        if gt(m, 5)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 2))) }
                    
                    // face: [1,2,3,4,5,6,7,8,9]
                    m := mod(rvs_face, 9)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 1 = 2 <=> 8 + 1 = 9                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 1))) }
                    
                    // palettes: [8,9]
                    m := mod(rvs_palette, 2)
                    mask := not(shl(0x30, 0xff))
                        // 1 + 8 = 9                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x30, add(m, 8))) }
                    

                    leave
                }
                
                if lt(rvs_breed, 256) { 
                    // Breed: zombie
                    // {"name":"zombie","odds":5,"b_body":[1,2,3,4,5,6,7,8],"b_face":[2,3,4,5,6,9],"b_palettes":[10],"b_eyes":[5],"b_tabbyFaceOdds":127}
                    breedData := 0x0a7f000001020a050005
                    let m := 0
                    let mask := 0xff

                    
                    // body: [1,2,3,4,5,6,7,8]
                    m := mod(rvs_body, 8)
                    mask := not(shl(0x20, 0xff))
                        // 1 + 1 = 2 <=> 7 + 1 = 8                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x20, add(m, 1))) }
                    
                    // face: [2,3,4,5,6,9]
                    m := mod(rvs_face, 6)
                    mask := not(shl(0x28, 0xff))
                        // 1 + 2 = 3 <=> 4 + 2 = 6                
                        if gt(m, 0)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 2))) }
                        // 5 + 4 = 9                
                        if gt(m, 4)  { breedData := add(or(breedData, mask), shl(0x28, add(m, 4))) }
                    

                    leave
                }
                
            }

            // Breed Data
            
            function getBreedData_i_breed(breedData) -> index {
                index := and(0xff, shr(0x00, breedData))
            }
            
            function getBreedData_b_tabbyFaceOdds(breedData) -> index {
                index := and(0xff, shr(0x08, breedData))
            }
            
            function getBreedData_b_head(breedData) -> index {
                index := and(0xff, shr(0x10, breedData))
            }
            
            function getBreedData_b_ear(breedData) -> index {
                index := and(0xff, shr(0x18, breedData))
            }
            
            function getBreedData_i_body(breedData) -> index {
                index := and(0xff, shr(0x20, breedData))
            }
            
            function getBreedData_i_face(breedData) -> index {
                index := and(0xff, shr(0x28, breedData))
            }
            
            function getBreedData_i_palette(breedData) -> index {
                index := and(0xff, shr(0x30, breedData))
            }
            
            function getBreedData_i_eyeColorMain(breedData) -> index {
                index := and(0xff, shr(0x38, breedData))
            }
            
            function getBreedData_i_eyeColorHeterochromia(breedData) -> index {
                index := and(0xff, shr(0x40, breedData))
            }
            
            function getBreedData_breedFlags(breedData) -> index {
                index := and(0xff, shr(0x48, breedData))
            }
            

            // Breed Flags
            
            function getBreedData_f_whiskers(breedData) -> index {
                index := and(0x1, shr(0x48, breedData))
            }
            
            function getBreedData_f_tongue(breedData) -> index {
                index := and(0x1, shr(0x49, breedData))
            }
            
            function getBreedData_f_zombieEyes(breedData) -> index {
                index := and(0x1, shr(0x4a, breedData))
            }
            
            function getBreedData_f_swapMarkColors(breedData) -> index {
                index := and(0x1, shr(0x4b, breedData))
            }
            
            function getBreedData_f_useBodyColorForCorner(breedData) -> index {
                index := and(0x1, shr(0x4c, breedData))
            }
            
            function getBreedData_f_calico(breedData) -> index {
                index := and(0x1, shr(0x4d, breedData))
            }
            
// END Data Functions ---

// Write Function ---

            // 8 or 6 chars
            function writeOutput_color(rgba) {                
                let p := mload(0x00)

                mstore8(p, '#')     p := add(p, 1)

                // Handle rgba extra byte
                // Note: rgba must have r > 0 to detect rgba
                if gt(rgba, 0xFFFFFF) {
                    mstore8(p, and(0xff, shr(24, rgba)))    p := add(p, 1)
                }
                
                // Handle rgb (or gba)
                mstore8(p, and(0xff, shr(16, rgba)))    p := add(p, 1)
                mstore8(p, and(0xff, shr( 8, rgba)))    p := add(p, 1)
                mstore8(p, and(0xff, shr( 0, rgba)))    p := add(p, 1)

                mstore(0x00, p)
            }

            // 5 or 4 chars
            function writeOutput_int(v) {
                let p := mload(0x00)

                if slt(0,v) {
                    mstore8(p, '-')    p := add(p, 1)
                    v := sub(0, v)
                }
                
                // Note: Only up to 9999
                mstore8(p, add('0',mod(10, div(v, 1000))))      p := add(p, 1)
                mstore8(p, add('0',mod(10, div(v, 100 ))))      p := add(p, 1)
                mstore8(p, add('0',mod(10, div(v, 10  ))))      p := add(p, 1)
                mstore8(p, add('0',mod(10, div(v, 1   ))))      p := add(p, 1)

                mstore(0x00, p)
            }

            function writeOutput(str) {
                let p := mload(0x00)

                for { let i := 0 } true { i := add(8,i) }{
                    let b := and(0xff, shr(i, str))
                    if iszero(b) { leave }

                    mstore8(p, b)      p := add(p, 1)
                    p := add(p, 1)
                }

                mstore(0x00, p)
            }


// Helper Functions ---
            function average(a,b) -> v {
                v := div(add(a,b),2)
            }
            function constrain(a,min,max) -> v {
                v := a
                if slt(a,min) { v := min }
                if sgt(a,max) { v := max }
            }
            function ceil_100(a) -> v {
                v := mul(div(a,100),100)
                if slt(v,a) {
                    v := add(100, v)
                }
            }
            function lerp_100(a,b,t100) -> v {
                v := add(
                    mul(a,sub(100,t100)),
                    mul(b,t100))

                v := div(v, 100)
            }
            // const bezierPoint_100 = (a: number, b: number, c: number, d: number, t100: number) => {
            //     const tInv = 100 - t100;
            //     return (a *     tInv / 100 * tInv / 100 * tInv / 100)
            //         +  (b * 3 * tInv / 100 * tInv / 100 * t100 / 100)
            //         +  (c * 3 * tInv / 100 * t100 / 100 * t100 / 100)
            //         +  (d *     t100 / 100 * t100 / 100 * t100 / 100)
            //         ;
            // };
            function bezierPoint_100(a,b,c,d,t100) -> v {
                let tInv := sub(100, t100)
                v := 0
                v := add(v,         mul(a, mul(tInv, mul(tInv, tInv)))      )
                v := add(v, mul(3,  mul(b, mul(tInv, mul(tInv, t100)))  )   )
                v := add(v, mul(3,  mul(c, mul(tInv, mul(t100, t100)))  )   )
                v := add(v,         mul(d, mul(t100, mul(t100, t100)))      )

                v := div(v, 1000000)
            }
            
            function ternary(cond, valIfTrue, valIfFalse) -> v {
                v := valIfFalse
                if cond {
                    v := valIfTrue
                }
            }

            function intToStringInVar(s, pos, v) -> sNew, posNew {
                if slt(0,v) {
                    s := or(s, shl(pos, '-'))                               pos := add(pos, 8)
                    v := sub(0, v)
                }
                
                // Note: Only up to 9999
                s := or(s, shl(pos, add('0',mod(10, div(v, 1000)))))        pos := add(pos, 8)
                s := or(s, shl(pos, add('0',mod(10, div(v, 100 )))))        pos := add(pos, 8)
                s := or(s, shl(pos, add('0',mod(10, div(v, 10  )))))        pos := add(pos, 8)
                s := or(s, shl(pos, add('0',mod(10, div(v, 1   )))))        pos := add(pos, 8)

                sNew := s
                posNew := pos
            }

            // const vertex = (a,b) => `M${a},${b}`;
            function vertex(a,b) -> s {
                s := 0
                let pos := 0

                s := or(s, shl(pos, 'M'))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, a)
                s := or(s, shl(pos, ','))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, b)
            }

            // const bezierVertex = (a,b,c,d,e,f) => `C${a},${b} ${c},${d} ${e},${f}`;
            function bezierVertex(a,b,c,d,e,f) -> s {
                s := 0
                let pos := 0

                s := or(s, shl(pos, 'C'))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, a)
                s := or(s, shl(pos, ','))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, b)

                s := or(s, shl(pos, ' '))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, c)
                s := or(s, shl(pos, ','))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, d)

                s := or(s, shl(pos, ' '))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, e)
                s := or(s, shl(pos, ','))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, f)
            }

            // const line = (a,b,c,d) => `M${a},${b} L${c},${d} l.1,.1`;
            function line(a,b,c,d) -> s {
                s := 0
                let pos := 0

                s := or(s, shl(pos, 'M'))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, a)
                s := or(s, shl(pos, ','))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, b)

                s := or(s, shl(pos, 'L'))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, c)
                s := or(s, shl(pos, ','))                               pos := add(pos, 8)
                s, pos := intToStringInVar(s, pos, d)

                s := or(s, shl(pos, 'l.1,.1')                  )        pos := add(pos, 48)
            }

            // const bezier = (a,b,c,d,e,f,g,h) => `M${a},${b} C${c},${d} ${e},${f} ${g},${h}`;
            function writeOutput_bezier(a,b,c,d,e,f,g,h) {
                writeOutput(vertex(a,b))
                writeOutput(bezierVertex(c,d,e,f,g,h))
            }

              // Prototype
        function generateSvgFromData() {
            let pOps := mload(0x00)
            let pVars := mload(0x20)

            for {} true {} {
                let op := and(0xff, pOps)        pOps := add(pOps, 1)

                switch op
                case 0x00 { leave }
                // Store var from var bits
                case 0x01 {
                    let dVarIn := and(0xffff, pOps)         pOps := add(pOps, 2)
                    let bitOffset := and(0xff, pOps)        pOps := add(pOps, 1)
                    let bitSize := and(0xff, pOps)          pOps := add(pOps, 1)
                    let dVarOut := and(0xffff, pOps)        pOps := add(pOps, 2)
                    // and(0x1, shr(0x4c, breedData))

                    let bitMask := sub(shl(bitSize, 0x1),1)
                    mstore(add(pVars, dVarOut), and(bitMask, shr(bitOffset, mload(add(pVars, dVarIn)))))
                }
                // writeOutput
                case 0x10 { 
                    let vString := and(0xffff, pOps)     pOps := add(pOps, 2)
                    writeOutput(vString)
                }
                // writeOutput_text
                case 0x11 { 
                    let iTextStart := and(0xffff, pOps)     pOps := add(pOps, 2)
                    writeOutput_text(iTextStart)
                }
                // writeOutput_int
                case 0x12 { 
                    let iValue := and(0xffff, pOps)         pOps := add(pOps, 2)
                    writeOutput_int(iValue)
                }
                // writeOutput_color from var value
                case 0x13 { 
                    let iVar := and(0xffff, pOps)           pOps := add(pOps, 2)
                    let iColor := mload(add(pVars, iVar))
                    writeOutput_color(getColor(iColor))
                }
                // writeOutput_bezier
                case 0x14 { 
                    let varA := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varB := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varC := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varD := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varE := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varF := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varG := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varH := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    writeOutput_bezier(varA, varB, varC, varD, varE, varF, varG, varH)
                }
                // math +
                case 0x20 { 
                    let varA := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varB := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let dVarOut := add(pVars, pOps)         pOps := add(pOps, 2)
                    mstore(add(pVars, dVarOut), add(varA, varB))
                }
                case 0x21 { 
                    let varA := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varB := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let dVarOut := add(pVars, pOps)         pOps := add(pOps, 2)
                    mstore(add(pVars, dVarOut), sub(varA, varB))
                }
                case 0x22 { 
                    let varA := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varB := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let dVarOut := add(pVars, pOps)         pOps := add(pOps, 2)
                    mstore(add(pVars, dVarOut), mul(varA, varB))
                }
                case 0x23 { 
                    let varA := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let varB := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let dVarOut := add(pVars, pOps)         pOps := add(pOps, 2)
                    mstore(add(pVars, dVarOut), sdiv(varA, varB))
                }
                case 0x24 { 
                    let varA := mload(add(pVars, pOps))     pOps := add(pOps, 2)
                    let dVarOut := add(pVars, pOps)         pOps := add(pOps, 2)
                    mstore(add(pVars, dVarOut), not(varA))
                }
            }
        }


// Memory Functions
        function getMemoryWordAddress(iWord) -> pWord {
            pWord := add(mload(0x40),0x80)
        }
        function loadMemoryWord(iWord) -> value {
            value := mload(add(mload(0x40),0x80))
        }
        function getColor_bits(bitShift, wColorValue) -> color {
            color := getColor(and(0xff, shr(bitShift, loadMemoryWord(wColorValue) )))
        }
        function getFieldData_bitFlag(bitShift, wValue) -> value {
            value := and(0x01, shr(bitShift,loadMemoryWord(wValue)))
        }
        function getFieldData_byte(bitShift, wValue) -> value {
            value := and(0xff, shr(bitShift,loadMemoryWord(wValue)))
        }
        function getFieldData_sub_bits(offset, bitSize, bitShift, wValue) -> value {
            value := sub(and(0xff, shr(bitShift,loadMemoryWord(wValue))), offset)
        }
        function getFieldData_sub_mul_bits(offset, scale, bitSize, bitShift, wValue) -> value {
            value := sub(mul(scale, and(0xff, shr(bitShift,loadMemoryWord(wValue)))), offset)
        }
        function varStore(iSlot, value) {
            mstore(add(getMemoryWordAddress(128), mul(32,iSlot)), value)
        }
        function varLoad(iSlot) -> value {
            value := mload(add(getMemoryWordAddress(128), mul(32,iSlot)))
        }


// --- ------------ ---
// --- START OUTPUT ---
// --- ------------ ---

// DataPack 
// string memory dataPack = "ffdeb81e1b1aded2cffafafa100f0f604f870000009d9df0161f2d6a6aa0ededede9928b121212050505f6f6f6d9b4f3383838d4c2ff7326822e253cb17b5d70aeffd5ddecfcfcfc4986e964a4f7e0edff0f408a5f5fce1f27321b294b2a3f6f9a847edbd2d26354557c6e6adfc7f53d3d3dd4b2f5573e70f0f0f0415d81c9d1decedff21c3040354e6e9797dd182c498e8ef0402f7523232f73635ed5d0cde7dcda6a514d685550c1a7dc2d24261c12135757571f1a19171617dee2e73c84e29696f3621e6b40406d262626c6d0e1ced6e320252e9ba8bf34455f2d35434459792929299a4c5eeeb8ffefdff1fef0ffbe73d3eab1fbbe6dd5522e5c944da829183e572960361b34fff4b8dfdccefff8ebc0a46df8eba0b19b59615538b191683f2224352a18231e158f6a5669a27cd6dece4171504558376a9a7a44573520231f313a341f2e24d8d8f3e9e9f2ebebffb6b6eccecef39788d37979b4a8a8f040405e7575a9f5f5f5b4c7e4d7e0ef8a9dc1a3b8d78288ba3e3e6056567b27273a58586f7594f0dccade1d24491f2538bb91d4151537808080fff9d6aee9f9a3faca669cff0209ef00372c00003d5b175601490000332300003f581c50014e05002f061a3f47561960064f0100342000003b562f5f054d03003214005f005a19640446050036307259634f265b054d0500342b400036582559034f00003831003f225c15630646080d3b25001a00541466194904003221b94c4850375b1156030038304000404f2159004b070035252e1e1f54295c0246050f38250000395418611d50060d37247264005529631446050f3728000078532758184a02003232b02b78531f440b4d0b002d1e64003b5128570b6201003220000040573562045003650a501957253117320734281b650a501e322e1000321446141d650d4d1e392c110132114500177d0a4c1e2c220a0e320035201d830a491e37320b0d340a32161e650a501e471c1d1d321132251c650651342c220a0e320027331900063f14003603167c3e4633190c0c3f2c3a0018173e323339195f064c402c220a0d0000332819650a502357251a0532053a281b480d501243362412910e542a19650a501e53202f08340a5019198906541a4d362e0e2d253725190a08043c12151404280c080414120f150528060805280712140528080d056411051501260908045a121015052811080600120a1408250b0a063211021404250c0d045a16001402280908002810111303280908043c0e101305280c080432120f15042800090432021615022806050446030f1408280c0001640f11160b281e0c1c151e1d160f0d0d1e07018a43080a0b00d5430a0508016243060f0c00d5160e050b0078000e0a0c012b03080b0d00d5260f0a0a01001303080d013258000e0d211e6404071204211e640407120300006604071404000066040714030a0908070605040303010201000d131211100f0e0d0c030a030b1f1e1d1c1b1a19181715161514101027262524232217202120000c3231302f2e2d2c2b292a29283d3c3b3a393837363533343328434241401b1a013f01173e17004b4a064849484647464445442857565554535251504f4d4e4d4c6261605f5e5d5c5b5a5859584c0a6c066b6a696867666465646377767574737271706f6d6e6d14807f067e7d7c7b7a1a7879782806068786068584834f8182811488898a8b068c000103050204081009000102060c10302024284080c0<?xml version='1.0' encoding='UTF-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-color:#'/></linearGradient><linearGradient id='x2'><stop style='stop-color:#'/></linearGradient><linearGradient id='x3'><stop style='stop-color:#'/></linearGradient><linearGradient id='x4'><stop style='stop-color:#'/></linearGradient><linearGradient id='x5'><stop style='stop-color:#'/></linearGradient><linearGradient id='x6'><stop style='stop-color:#'/></linearGradient><linearGradient id='x7'><stop style='stop-color:#'/></linearGradient><linearGradient id='x8'><stop style='stop-color:#'/></linearGradient><linearGradient id='x9'><stop style='stop-color:#'/></linearGradient><linearGradient id='x10'><stop style='stop-color:#'/></linearGradient><linearGradient id='x11'><stop style='stop-color:##01000080'/></linearGradient><linearGradient id='x12'><stop style='stop-color:#'/></linearGradient><linearGradient id='x13'><stop style='stop-color:#'/></linearGradient><linearGradient id='x14'><stop style='stop-color:#'/></linearGradient><linearGradient id='x15'><stop style='stop-color:#'/></linearGradient><linearGradient id='x16'><stop style='stop-color:#'/></linearGradient><linearGradient id='x17'><stop style='stop-color:#'/></linearGradient><linearGradient id='x18'><stop style='stop-color:##FFFFFF#000000'/></linearGradient><linearGradient id='x19'><stop style='stop-color:##FFFFFF00'/></linearGradient><linearGradient><stop style='stop-color:##333333'/></linearGradient><linearGradient id='x20'><stop style='stop-color:##DB7093#E38FAB'/></linearGradient><linearGradient id='x21'><stop style='stop-color:#'/></linearGradient><linearGradient id='x22'><stop style='stop-color:#'/></linearGradient><linearGradient id='x23'><stop style='stop-color:##505050'/></linearGradient><filter id='x24' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0 0' result='blur'/></filter><filter id='x25' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0.5 0.5' result='blur'/></filter><filter id='x26' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='5 5' result='blur'/></filter><filter id='x27' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='3 3' result='blur'/></filter></defs><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x1)'/><g transform='translate(150.0,150.0) scale(1)'><g style='filter:url(#x24)'><animateMotion dur='17s' repeatCount='indefinite' path='M2,5c0,-5,3,5,3,0c0,-5-3,5-3,0Z'/><clipPath id='x28' clipPathUnits='userSpaceOnUse'><path d='M,LZ'/></clipPath><g clip-path='url(#x28)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x2)'/><g opacity=''><path id='x29' style='fill:none;stroke:url(#x5);stroke-width:14' d=''/><use xlink:href='#x29' transform='translate(0, 27)'/><use xlink:href='#x29' transform='translate(0, 54)'/><use xlink:href='#x29' transform='translate(0, 81)'/><use xlink:href='#x29' transform='translate(0, 108)'/></g><g opacity=''><path style='fill:url(#x7)' d='MZ'/><path style='fill:url(#x8)' d='MZ'/></g><g opacity=''><g id='x30'><path id='x31' style='fill:url(#x5);filter:url(#x25)' d='Mc60,15,60,20,60,20c0,5-60,-10-60,-10z'/><use xlink:href='#x31' transform='translate( -4, 18)'/><use xlink:href='#x31' transform='translate( -8,36)'/><use xlink:href='#x31' transform='translate(-12,54)'/></g><use xlink:href='#x30' transform='scale(-1,1)'/></g><g opacity=''><path style='fill:url(#x4)' d='MH'><ellipse style='fill:url(#x4)' cx='0' cy='165' rx='' ry='50'/></g></g><g><path style='fill:url(#x11);filter:url(#x26)' clip-path='url(#x28)' d='M-90,-5c0,0,40,-40,90,-40c50,0,90,40,90,40c0,0,10,50,10,70c-20,0,-70,30,-100,30c-30,0,-80,-30,-100,-30c0,-20,10,-70,10,-70z'/></g></g><g><g transform='scale(,1)'><g><g><clipPath id='x32' clipPathUnits='userSpaceOnUse'><path d='S50,0,0,0Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x13)' clip-path='url(#x32)'/><g id='x33'><animateMotion dur='31s' repeatCount='indefinite' path='M0,3c0,-3,2,3,2,0c0,-3-2,3-2,0Z'/><clipPath id='x34' clipPathUnits='userSpaceOnUse'><path d='Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x14)' clip-path='url(#x34)'/></g></g><g><g transform='scale(-1,1)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x12)' clip-path='url(#x32)'/><use xlink:href='#x33'/></g></g></g><g style='filter:url(#x24)'><clipPath id='x35' clipPathUnits='userSpaceOnUse'><path d='z'/></clipPath><g clip-path='url(#x35)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x3)'/><g opacity=''><ellipse style='fill:url(#x4)' cx='0' cy='' rx='60' ry='60'/></g><g opacity=''><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:6' d='M0,L-124,L124,'><ellipse style='fill:url(#x4)' cx='10' cy='' rx='11' ry='11'/><ellipse style='fill:url(#x4)' cx='-10' cy='' rx='11' ry='11'/></g><g opacity=''><path style='fill:url(#x4)' d='L150,-150Z'/></g><g opacity=''><ellipse style='fill:url(#x6)' cx='-68' cy='' rx='75' ry='100'/></g><g opacity=''><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M-16,L16,'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M0,5L-16,'><ellipse style='fill:url(#x9)' cx='0' cy='' rx='16' ry='35'/><ellipse style='fill:url(#x10)' cx='-76' cy='' rx='70' ry='100'/><ellipse style='fill:url(#x9)' cx='76' cy='' rx='70' ry='100'/></g><g><path opacity='' id='x36' style='fill:url(#x5);filter:url(#x25)' d='Mc60,0,60,5,60,5c0,5,-60,5,-60,5z'/><use xlink:href='#x36' transform='translate(0,14)'/><use xlink:href='#x36' transform='translate(0,-14)'/><use xlink:href='#x36' transform='translate(0,0) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,14) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,-14) scale(-1,1)'/><path opacity='' id='x37' style='fill:url(#x5);filter:url(#x25)' d='M-20,c0,60,5,60,5,60c5,0,5,-60,5,-60z'/><use xlink:href='#x37' transform='translate(15,4)'/><use xlink:href='#x37' transform='translate(30,0)'/></g></g></g></g><g><g transform='translate() translate(-,-)'><clipPath id='x38' clipPathUnits='userSpaceOnUse'><path id='x39' transform='translate() scale(1,1) rotate()' d='z'><animate attributeName='d' type='xml' repeatCount='indefinite' dur='4s' keyTimes='0;0.4;0.5;0.6;1' values='   z;  z '/></path></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x16)' clip-path='url(#x38)'/><g clip-path='url(#x38)'><g transform='translate()'><g id='x40'><ellipse style='fill:url(#x18)' cx='' cy='' rx='' ry=''><animateMotion dur='20s' repeatCount='indefinite' path='M0,0c0,-5,3,5,3,0c0,-10-6,10-6,0Z'/></ellipse><g><g transform='translate()'><circle r='25' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g><g transform='translate()'><circle r='15' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g></g></g></g></g><use id='x41' xlink:href='#x39' style='stroke-width:2;stroke:url(#x17);fill:transparent'/></g><g transform='translate(-) translate()'><rect x='-300' y='-300' width='600' height='600' transform='scale(-1,1)' style='fill:url(#x15)' clip-path='url(#x38)'/><g clip-path='url(#x38)' transform='scale(-1,1)'><g transform='translate() scale(-1,1)'><use xlink:href='#x40'/></g></g><use xlink:href='#x41' transform='scale(-1,1)'/></g></g><g transform='translate(0,)'><g transform='translate(0,0)'><g transform='translate(0,0)'><path style='fill:none;stroke:url(#x20);stroke-width:1.5' d=''/><path id='x42' style='fill:none;stroke:url(#x20);stroke-width:1.5' d=''/><use xlink:href='#x42' transform='scale(-1,1)'/><g opacity='' transform='translate(0,0)'><g id='x43' transform='translate()'><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate('/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate('/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' opacity='' transform='rotate('/></g><use xlink:href='#x43' transform='scale(-1,1)'/></g></g></g></g><g transform='translate(0,0)'><path style='fill:url(#x21);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d='Z'/><path id='x44' style='fill:url(#x22);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d=''/><use xlink:href='#x44' transform='scale(-1,1)'/></g></g></g></svg>";
// ^-- Move to Solidity Function



            // Text
            function writeOutput_text(iTextStart) {
                let p := mload(0x00)

                // Write text 1 byte at a time
                for { let iText := iTextStart } true { iText := add(1, iText) } {
                    let t := and(0xff, mload(add(
                        loadMemoryWord(4), // DataPack[text]
                        iText)))
                    
                    if iszero(t) {
                        break
                    }

                    mstore(p, t)
                    p := add(1, p)
                }

                mstore(0x00, p)
            }
    
    

    
            // Colors
            function getColor(iColor) -> color {
                color := and(0xffffff, mload(add(
                        loadMemoryWord(3), // DataPack[colors]
                        mul(3,iColor))))
            }
    


            // head - Select Data
            function selectData_head(breedData) -> data {
                
                let rvs_head         := getBreedData_b_head(breedData) 
                if not(rvs_head) { rvs_head := getRvsValue(0x20) }
                let iValue := mod(15, rvs_head)
                

                // Load the data for the selected head
                data := mload(add(
                        add(loadMemoryWord(2), 0), // DataPack[head]
                        iValue))
                // Keep 96 bits (8 bits * 12 fields)
                data := shr(160, shl(160, data))

                
                // [0]: 00372c00003d5b1756014900
                // {"name":"round","fhy":-55,"tplx":73,"tply":-29,"chkx":86,"chky":23,"chny":91,"chkc_100":1,"chko_100":0,"chnc_100":-100,"chno_100":44,"bw_100":55.00000000000001,"eeo_100":0}
                //        fhy:   -55 = 0x00 - 55
                //       tplx:    73 = 0x49
                //       tply:   -29 = 0x01 - 30
                //       chkx:    86 = 0x56
                //       chky:    23 = 0x17
                //       chny:    91 = 0x5b
                //   chkc_100:     1 = 0x3d - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    44 = 0x2c
                //     bw_100:    55 = 0x37
                //    eeo_100:     0 = 0x00
                
                // [1]: 00332300003f581c50014e05
                // {"name":"oval","fhy":-50,"tplx":78,"tply":-29,"chkx":80,"chky":28,"chny":88,"chkc_100":3,"chko_100":0,"chnc_100":-100,"chno_100":35,"bw_100":51,"eeo_100":0}
                //        fhy:   -50 = 0x05 - 55
                //       tplx:    78 = 0x4e
                //       tply:   -29 = 0x01 - 30
                //       chkx:    80 = 0x50
                //       chky:    28 = 0x1c
                //       chny:    88 = 0x58
                //   chkc_100:     3 = 0x3f - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    35 = 0x23
                //     bw_100:    51 = 0x33
                //    eeo_100:     0 = 0x00
                
                // [2]: 002f061a3f47561960064f01
                // {"name":"diamond","fhy":-54,"tplx":79,"tply":-24,"chkx":96,"chky":25,"chny":86,"chkc_100":11,"chko_100":63,"chnc_100":-74,"chno_100":6,"bw_100":47,"eeo_100":0}
                //        fhy:   -54 = 0x01 - 55
                //       tplx:    79 = 0x4f
                //       tply:   -24 = 0x06 - 30
                //       chkx:    96 = 0x60
                //       chky:    25 = 0x19
                //       chny:    86 = 0x56
                //   chkc_100:    11 = 0x47 - 60
                //   chko_100:    63 = 0x3f
                //   chnc_100:   -74 = 0x1a - 100
                //   chno_100:     6 = 0x06
                //     bw_100:    47 = 0x2f
                //    eeo_100:     0 = 0x00
                
                // [3]: 00342000003b562f5f054d03
                // {"name":"squarish","fhy":-52,"tplx":77,"tply":-25,"chkx":95,"chky":47,"chny":86,"chkc_100":-1,"chko_100":0,"chnc_100":-100,"chno_100":32,"bw_100":52,"eeo_100":0}
                //        fhy:   -52 = 0x03 - 55
                //       tplx:    77 = 0x4d
                //       tply:   -25 = 0x05 - 30
                //       chkx:    95 = 0x5f
                //       chky:    47 = 0x2f
                //       chny:    86 = 0x56
                //   chkc_100:    -1 = 0x3b - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    32 = 0x20
                //     bw_100:    52 = 0x34
                //    eeo_100:     0 = 0x00
                
                // [4]: 003214005f005a1964044605
                // {"name":"fluffy","fhy":-50,"tplx":70,"tply":-26,"chkx":100,"chky":25,"chny":90,"chkc_100":-60,"chko_100":95,"chnc_100":-100,"chno_100":20,"bw_100":50,"eeo_100":0}
                //        fhy:   -50 = 0x05 - 55
                //       tplx:    70 = 0x46
                //       tply:   -26 = 0x04 - 30
                //       chkx:   100 = 0x64
                //       chky:    25 = 0x19
                //       chny:    90 = 0x5a
                //   chkc_100:   -60 = 0x00 - 60
                //   chko_100:    95 = 0x5f
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    20 = 0x14
                //     bw_100:    50 = 0x32
                //    eeo_100:     0 = 0x00
                
                // [5]: 0036307259634f265b054d05
                // {"name":"scruffy","fhy":-50,"tplx":77,"tply":-25,"chkx":91,"chky":38,"chny":79,"chkc_100":39,"chko_100":89,"chnc_100":14.000000000000002,"chno_100":48,"bw_100":54,"eeo_100":0}
                //        fhy:   -50 = 0x05 - 55
                //       tplx:    77 = 0x4d
                //       tply:   -25 = 0x05 - 30
                //       chkx:    91 = 0x5b
                //       chky:    38 = 0x26
                //       chny:    79 = 0x4f
                //   chkc_100:    39 = 0x63 - 60
                //   chko_100:    89 = 0x59
                //   chnc_100:    14 = 0x72 - 100
                //   chno_100:    48 = 0x30
                //     bw_100:    54 = 0x36
                //    eeo_100:     0 = 0x00
                
                // [6]: 00342b400036582559034f00
                // {"name":"plain","fhy":-55,"tplx":79,"tply":-27,"chkx":89,"chky":37,"chny":88,"chkc_100":-6,"chko_100":0,"chnc_100":-36,"chno_100":43,"bw_100":52,"eeo_100":0}
                //        fhy:   -55 = 0x00 - 55
                //       tplx:    79 = 0x4f
                //       tply:   -27 = 0x03 - 30
                //       chkx:    89 = 0x59
                //       chky:    37 = 0x25
                //       chny:    88 = 0x58
                //   chkc_100:    -6 = 0x36 - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:   -36 = 0x40 - 100
                //   chno_100:    43 = 0x2b
                //     bw_100:    52 = 0x34
                //    eeo_100:     0 = 0x00
                
                // [7]: 003831003f225c1563064608
                // {"name":"chonker","fhy":-47,"tplx":70,"tply":-24,"chkx":99,"chky":21,"chny":92,"chkc_100":-26,"chko_100":63,"chnc_100":-100,"chno_100":49,"bw_100":56.00000000000001,"eeo_100":0}
                //        fhy:   -47 = 0x08 - 55
                //       tplx:    70 = 0x46
                //       tply:   -24 = 0x06 - 30
                //       chkx:    99 = 0x63
                //       chky:    21 = 0x15
                //       chny:    92 = 0x5c
                //   chkc_100:   -26 = 0x22 - 60
                //   chko_100:    63 = 0x3f
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    49 = 0x31
                //     bw_100:    56 = 0x38
                //    eeo_100:     0 = 0x00
                
                // [8]: 0d3b25001a00541466194904
                // {"name":"slick","fhy":-51,"tplx":73,"tply":-5,"chkx":102,"chky":20,"chny":84,"chkc_100":-60,"chko_100":26,"chnc_100":-100,"chno_100":37,"bw_100":59,"eeo_100":13}
                //        fhy:   -51 = 0x04 - 55
                //       tplx:    73 = 0x49
                //       tply:    -5 = 0x19 - 30
                //       chkx:   102 = 0x66
                //       chky:    20 = 0x14
                //       chny:    84 = 0x54
                //   chkc_100:   -60 = 0x00 - 60
                //   chko_100:    26 = 0x1a
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    37 = 0x25
                //     bw_100:    59 = 0x3b
                //    eeo_100:    13 = 0x0d
                
                // [9]: 003221b94c4850375b115603
                // {"name":"rectangular","fhy":-52,"tplx":86,"tply":-13,"chkx":91,"chky":55,"chny":80,"chkc_100":12,"chko_100":76,"chnc_100":85,"chno_100":33,"bw_100":50,"eeo_100":0}
                //        fhy:   -52 = 0x03 - 55
                //       tplx:    86 = 0x56
                //       tply:   -13 = 0x11 - 30
                //       chkx:    91 = 0x5b
                //       chky:    55 = 0x37
                //       chny:    80 = 0x50
                //   chkc_100:    12 = 0x48 - 60
                //   chko_100:    76 = 0x4c
                //   chnc_100:    85 = 0xb9 - 100
                //   chno_100:    33 = 0x21
                //     bw_100:    50 = 0x32
                //    eeo_100:     0 = 0x00
                
                // [10]: 0038304000404f2159004b07
                // {"name":"teeny","fhy":-48,"tplx":75,"tply":-30,"chkx":89,"chky":33,"chny":79,"chkc_100":4,"chko_100":0,"chnc_100":-36,"chno_100":48,"bw_100":56.00000000000001,"eeo_100":0}
                //        fhy:   -48 = 0x07 - 55
                //       tplx:    75 = 0x4b
                //       tply:   -30 = 0x00 - 30
                //       chkx:    89 = 0x59
                //       chky:    33 = 0x21
                //       chny:    79 = 0x4f
                //   chkc_100:     4 = 0x40 - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:   -36 = 0x40 - 100
                //   chno_100:    48 = 0x30
                //     bw_100:    56 = 0x38
                //    eeo_100:     0 = 0x00
                
                // [11]: 0035252e1e1f54295c024605
                // {"name":"cheeky","fhy":-50,"tplx":70,"tply":-28,"chkx":92,"chky":41,"chny":84,"chkc_100":-28.999999999999996,"chko_100":30,"chnc_100":-54,"chno_100":37,"bw_100":53,"eeo_100":0}
                //        fhy:   -50 = 0x05 - 55
                //       tplx:    70 = 0x46
                //       tply:   -28 = 0x02 - 30
                //       chkx:    92 = 0x5c
                //       chky:    41 = 0x29
                //       chny:    84 = 0x54
                //   chkc_100:   -29 = 0x1f - 60
                //   chko_100:    30 = 0x1e
                //   chnc_100:   -54 = 0x2e - 100
                //   chno_100:    37 = 0x25
                //     bw_100:    53 = 0x35
                //    eeo_100:     0 = 0x00
                
                // [12]: 0f38250000395418611d5006
                // {"name":"lemon","fhy":-49,"tplx":80,"tply":-1,"chkx":97,"chky":24,"chny":84,"chkc_100":-3,"chko_100":0,"chnc_100":-100,"chno_100":37,"bw_100":56.00000000000001,"eeo_100":15}
                //        fhy:   -49 = 0x06 - 55
                //       tplx:    80 = 0x50
                //       tply:    -1 = 0x1d - 30
                //       chkx:    97 = 0x61
                //       chky:    24 = 0x18
                //       chny:    84 = 0x54
                //   chkc_100:    -3 = 0x39 - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    37 = 0x25
                //     bw_100:    56 = 0x38
                //    eeo_100:    15 = 0x0f
                
                // [13]: 0d3724726400552963144605
                // {"name":"silky","fhy":-50,"tplx":70,"tply":-10,"chkx":99,"chky":41,"chny":85,"chkc_100":-60,"chko_100":100,"chnc_100":14.000000000000002,"chno_100":36,"bw_100":55.00000000000001,"eeo_100":13}
                //        fhy:   -50 = 0x05 - 55
                //       tplx:    70 = 0x46
                //       tply:   -10 = 0x14 - 30
                //       chkx:    99 = 0x63
                //       chky:    41 = 0x29
                //       chny:    85 = 0x55
                //   chkc_100:   -60 = 0x00 - 60
                //   chko_100:   100 = 0x64
                //   chnc_100:    14 = 0x72 - 100
                //   chno_100:    36 = 0x24
                //     bw_100:    55 = 0x37
                //    eeo_100:    13 = 0x0d
                
                // [14]: 0f3728000078532758184a02
                // {"name":"chubby","fhy":-53,"tplx":74,"tply":-6,"chkx":88,"chky":39,"chny":83,"chkc_100":60,"chko_100":0,"chnc_100":-100,"chno_100":40,"bw_100":55.00000000000001,"eeo_100":15}
                //        fhy:   -53 = 0x02 - 55
                //       tplx:    74 = 0x4a
                //       tply:    -6 = 0x18 - 30
                //       chkx:    88 = 0x58
                //       chky:    39 = 0x27
                //       chny:    83 = 0x53
                //   chkc_100:    60 = 0x78 - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    40 = 0x28
                //     bw_100:    55 = 0x37
                //    eeo_100:    15 = 0x0f
                
                // [15]: 003232b02b78531f440b4d0b
                // {"name":"skinny","fhy":-44,"tplx":77,"tply":-19,"chkx":68,"chky":31,"chny":83,"chkc_100":60,"chko_100":43,"chnc_100":76,"chno_100":50,"bw_100":50,"eeo_100":0}
                //        fhy:   -44 = 0x0b - 55
                //       tplx:    77 = 0x4d
                //       tply:   -19 = 0x0b - 30
                //       chkx:    68 = 0x44
                //       chky:    31 = 0x1f
                //       chny:    83 = 0x53
                //   chkc_100:    60 = 0x78 - 60
                //   chko_100:    43 = 0x2b
                //   chnc_100:    76 = 0xb0 - 100
                //   chno_100:    50 = 0x32
                //     bw_100:    50 = 0x32
                //    eeo_100:     0 = 0x00
                
                // [16]: 002d1e64003b5128570b6201
                // {"name":"wide","fhy":-54,"tplx":98,"tply":-19,"chkx":87,"chky":40,"chny":81,"chkc_100":-1,"chko_100":0,"chnc_100":0,"chno_100":30,"bw_100":45,"eeo_100":0}
                //        fhy:   -54 = 0x01 - 55
                //       tplx:    98 = 0x62
                //       tply:   -19 = 0x0b - 30
                //       chkx:    87 = 0x57
                //       chky:    40 = 0x28
                //       chny:    81 = 0x51
                //   chkc_100:    -1 = 0x3b - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:     0 = 0x64 - 100
                //   chno_100:    30 = 0x1e
                //     bw_100:    45 = 0x2d
                //    eeo_100:     0 = 0x00
                
                // [17]: 003220000040573562045003
                // {"name":"blocky","fhy":-52,"tplx":80,"tply":-26,"chkx":98,"chky":53,"chny":87,"chkc_100":4,"chko_100":0,"chnc_100":-100,"chno_100":32,"bw_100":50,"eeo_100":0}
                //        fhy:   -52 = 0x03 - 55
                //       tplx:    80 = 0x50
                //       tply:   -26 = 0x04 - 30
                //       chkx:    98 = 0x62
                //       chky:    53 = 0x35
                //       chny:    87 = 0x57
                //   chkc_100:     4 = 0x40 - 60
                //   chko_100:     0 = 0x00
                //   chnc_100:  -100 = 0x00 - 100
                //   chno_100:    32 = 0x20
                //     bw_100:    50 = 0x32
                //    eeo_100:     0 = 0x00
                
            }
            
            // ear - Select Data
            function selectData_ear(breedData) -> data {
                
                let rvs_ear          := getBreedData_b_ear(breedData) 
                if not(rvs_ear) { rvs_ear := getRvsValue(0x28) }
                let iValue := mod(11, rvs_ear)
                

                // Load the data for the selected ear
                data := mload(add(
                        add(loadMemoryWord(2), 432), // DataPack[ear]
                        iValue))
                // Keep 104 bits (8 bits * 13 fields)
                data := shr(152, shl(152, data))

                
                // [0]: 650a501957253117320734281b
                // {"name":"plain","eso_100":27,"etox":-1,"etoy":52,"eb_100":7.000000000000001,"ebr_100":0,"esc_100":19,"etc_100":49,"eec_100":13,"eitc_100":53,"esi_100":25,"eti_100":80,"eei_100":10,"eito_100":0}
                //    eso_100:    27 = 0x1b
                //       etox:    -1 = 0x28 - 41
                //       etoy:    52 = 0x34
                //     eb_100:     7 = 0x07
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:    19 = 0x17 - 4
                //    etc_100:    49 = 0x31
                //    eec_100:    13 = 0x25 - 24
                //   eitc_100:    53 = 0x57 - 34
                //    esi_100:    25 = 0x19
                //    eti_100:    80 = 0x50
                //    eei_100:    10 = 0x0a
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [1]: 650a501e322e1000321446141d
                // {"name":"upright","eso_100":28.999999999999996,"etox":-21,"etoy":70,"eb_100":20,"ebr_100":0,"esc_100":-4,"etc_100":16,"eec_100":22,"eitc_100":16,"esi_100":30,"eti_100":80,"eei_100":10,"eito_100":0}
                //    eso_100:    29 = 0x1d
                //       etox:   -21 = 0x14 - 41
                //       etoy:    70 = 0x46
                //     eb_100:    20 = 0x14
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:    -4 = 0x00 - 4
                //    etc_100:    16 = 0x10
                //    eec_100:    22 = 0x2e - 24
                //   eitc_100:    16 = 0x32 - 34
                //    esi_100:    30 = 0x1e
                //    eti_100:    80 = 0x50
                //    eei_100:    10 = 0x0a
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [2]: 650d4d1e392c11013211450017
                // {"name":"alert","eso_100":23,"etox":-41,"etoy":69,"eb_100":17,"ebr_100":0,"esc_100":-3,"etc_100":17,"eec_100":20,"eitc_100":23,"esi_100":30,"eti_100":77,"eei_100":13,"eito_100":0}
                //    eso_100:    23 = 0x17
                //       etox:   -41 = 0x00 - 41
                //       etoy:    69 = 0x45
                //     eb_100:    17 = 0x11
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:    -3 = 0x01 - 4
                //    etc_100:    17 = 0x11
                //    eec_100:    20 = 0x2c - 24
                //   eitc_100:    23 = 0x39 - 34
                //    esi_100:    30 = 0x1e
                //    eti_100:    77 = 0x4d
                //    eei_100:    13 = 0x0d
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [3]: 7d0a4c1e2c220a0e320035201d
                // {"name":"pointy","eso_100":28.999999999999996,"etox":-9,"etoy":53,"eb_100":0,"ebr_100":0,"esc_100":10,"etc_100":10,"eec_100":10,"eitc_100":10,"esi_100":30,"eti_100":76,"eei_100":10,"eito_100":95}
                //    eso_100:    29 = 0x1d
                //       etox:    -9 = 0x20 - 41
                //       etoy:    53 = 0x35
                //     eb_100:     0 = 0x00
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:    10 = 0x0e - 4
                //    etc_100:    10 = 0x0a
                //    eec_100:    10 = 0x22 - 24
                //   eitc_100:    10 = 0x2c - 34
                //    esi_100:    30 = 0x1e
                //    eti_100:    76 = 0x4c
                //    eei_100:    10 = 0x0a
                //   eito_100:    95 = 0x7d * 4 - 405
                
                // [4]: 830a491e37320b0d340a32161e
                // {"name":"teeny","eso_100":30,"etox":-19,"etoy":50,"eb_100":10,"ebr_100":2,"esc_100":9,"etc_100":11,"eec_100":26,"eitc_100":21,"esi_100":30,"eti_100":73,"eei_100":10,"eito_100":119}
                //    eso_100:    30 = 0x1e
                //       etox:   -19 = 0x16 - 41
                //       etoy:    50 = 0x32
                //     eb_100:    10 = 0x0a
                //    ebr_100:     2 = 0x34 - 50
                //    esc_100:     9 = 0x0d - 4
                //    etc_100:    11 = 0x0b
                //    eec_100:    26 = 0x32 - 24
                //   eitc_100:    21 = 0x37 - 34
                //    esi_100:    30 = 0x1e
                //    eti_100:    73 = 0x49
                //    eei_100:    10 = 0x0a
                //   eito_100:   119 = 0x83 * 4 - 405
                
                // [5]: 650a501e471c1d1d321132251c
                // {"name":"curved","eso_100":28.000000000000004,"etox":-4,"etoy":50,"eb_100":17,"ebr_100":0,"esc_100":25,"etc_100":28.999999999999996,"eec_100":4,"eitc_100":37,"esi_100":30,"eti_100":80,"eei_100":10,"eito_100":0}
                //    eso_100:    28 = 0x1c
                //       etox:    -4 = 0x25 - 41
                //       etoy:    50 = 0x32
                //     eb_100:    17 = 0x11
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:    25 = 0x1d - 4
                //    etc_100:    29 = 0x1d
                //    eec_100:     4 = 0x1c - 24
                //   eitc_100:    37 = 0x47 - 34
                //    esi_100:    30 = 0x1e
                //    eti_100:    80 = 0x50
                //    eei_100:    10 = 0x0a
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [6]: 650651342c220a0e3200273319
                // {"name":"slanted","eso_100":25,"etox":10,"etoy":39,"eb_100":0,"ebr_100":0,"esc_100":10,"etc_100":10,"eec_100":10,"eitc_100":10,"esi_100":52,"eti_100":81,"eei_100":6,"eito_100":0}
                //    eso_100:    25 = 0x19
                //       etox:    10 = 0x33 - 41
                //       etoy:    39 = 0x27
                //     eb_100:     0 = 0x00
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:    10 = 0x0e - 4
                //    etc_100:    10 = 0x0a
                //    eec_100:    10 = 0x22 - 24
                //   eitc_100:    10 = 0x2c - 34
                //    esi_100:    52 = 0x34
                //    eti_100:    81 = 0x51
                //    eei_100:     6 = 0x06
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [7]: 00063f14003603167c3e463319
                // {"name":"folded","eso_100":25,"etox":10,"etoy":70,"eb_100":62,"ebr_100":74,"esc_100":18,"etc_100":3,"eec_100":30,"eitc_100":-34,"esi_100":20,"eti_100":63,"eei_100":6,"eito_100":-405}
                //    eso_100:    25 = 0x19
                //       etox:    10 = 0x33 - 41
                //       etoy:    70 = 0x46
                //     eb_100:    62 = 0x3e
                //    ebr_100:    74 = 0x7c - 50
                //    esc_100:    18 = 0x16 - 4
                //    etc_100:     3 = 0x03
                //    eec_100:    30 = 0x36 - 24
                //   eitc_100:   -34 = 0x00 - 34
                //    esi_100:    20 = 0x14
                //    eti_100:    63 = 0x3f
                //    eei_100:     6 = 0x06
                //   eito_100:  -405 = 0x00 * 4 - 405
                
                // [8]: 0c0c3f2c3a0018173e32333919
                // {"name":"floppy","eso_100":25,"etox":16,"etoy":51,"eb_100":50,"ebr_100":12,"esc_100":19,"etc_100":24,"eec_100":-24,"eitc_100":24,"esi_100":44,"eti_100":63,"eei_100":12,"eito_100":-357}
                //    eso_100:    25 = 0x19
                //       etox:    16 = 0x39 - 41
                //       etoy:    51 = 0x33
                //     eb_100:    50 = 0x32
                //    ebr_100:    12 = 0x3e - 50
                //    esc_100:    19 = 0x17 - 4
                //    etc_100:    24 = 0x18
                //    eec_100:   -24 = 0x00 - 24
                //   eitc_100:    24 = 0x3a - 34
                //    esi_100:    44 = 0x2c
                //    eti_100:    63 = 0x3f
                //    eei_100:    12 = 0x0c
                //   eito_100:  -357 = 0x0c * 4 - 405
                
                // [9]: 5f064c402c220a0d0000332819
                // {"name":"sideways","eso_100":25,"etox":-1,"etoy":51,"eb_100":0,"ebr_100":-50,"esc_100":9,"etc_100":10,"eec_100":10,"eitc_100":10,"esi_100":64,"eti_100":76,"eei_100":6,"eito_100":-24}
                //    eso_100:    25 = 0x19
                //       etox:    -1 = 0x28 - 41
                //       etoy:    51 = 0x33
                //     eb_100:     0 = 0x00
                //    ebr_100:   -50 = 0x00 - 50
                //    esc_100:     9 = 0x0d - 4
                //    etc_100:    10 = 0x0a
                //    eec_100:    10 = 0x22 - 24
                //   eitc_100:    10 = 0x2c - 34
                //    esi_100:    64 = 0x40
                //    eti_100:    76 = 0x4c
                //    eei_100:     6 = 0x06
                //   eito_100:   -24 = 0x5f * 4 - 405
                
                // [10]: 650a502357251a0532053a281b
                // {"name":"perky","eso_100":27,"etox":-1,"etoy":58,"eb_100":5,"ebr_100":0,"esc_100":1,"etc_100":26,"eec_100":13,"eitc_100":53,"esi_100":35,"eti_100":80,"eei_100":10,"eito_100":0}
                //    eso_100:    27 = 0x1b
                //       etox:    -1 = 0x28 - 41
                //       etoy:    58 = 0x3a
                //     eb_100:     5 = 0x05
                //    ebr_100:     0 = 0x32 - 50
                //    esc_100:     1 = 0x05 - 4
                //    etc_100:    26 = 0x1a
                //    eec_100:    13 = 0x25 - 24
                //   eitc_100:    53 = 0x57 - 34
                //    esi_100:    35 = 0x23
                //    eti_100:    80 = 0x50
                //    eei_100:    10 = 0x0a
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [11]: 480d501243362412910e542a19
                // {"name":"sphynx","eso_100":25,"etox":1,"etoy":84,"eb_100":14.000000000000002,"ebr_100":95,"esc_100":14.000000000000002,"etc_100":36,"eec_100":30,"eitc_100":33,"esi_100":18,"eti_100":80,"eei_100":13,"eito_100":-119}
                //    eso_100:    25 = 0x19
                //       etox:     1 = 0x2a - 41
                //       etoy:    84 = 0x54
                //     eb_100:    14 = 0x0e
                //    ebr_100:    95 = 0x91 - 50
                //    esc_100:    14 = 0x12 - 4
                //    etc_100:    36 = 0x24
                //    eec_100:    30 = 0x36 - 24
                //   eitc_100:    33 = 0x43 - 34
                //    esi_100:    18 = 0x12
                //    eti_100:    80 = 0x50
                //    eei_100:    13 = 0x0d
                //   eito_100:  -119 = 0x48 * 4 - 405
                
                // [12]: 650a501e53202f08340a501919
                // {"name":"wide","eso_100":25,"etox":-16,"etoy":80,"eb_100":10,"ebr_100":2,"esc_100":4,"etc_100":47,"eec_100":8,"eitc_100":49,"esi_100":30,"eti_100":80,"eei_100":10,"eito_100":0}
                //    eso_100:    25 = 0x19
                //       etox:   -16 = 0x19 - 41
                //       etoy:    80 = 0x50
                //     eb_100:    10 = 0x0a
                //    ebr_100:     2 = 0x34 - 50
                //    esc_100:     4 = 0x08 - 4
                //    etc_100:    47 = 0x2f
                //    eec_100:     8 = 0x20 - 24
                //   eitc_100:    49 = 0x53 - 34
                //    esi_100:    30 = 0x1e
                //    eti_100:    80 = 0x50
                //    eei_100:    10 = 0x0a
                //   eito_100:     0 = 0x65 * 4 - 405
                
                // [13]: 8906541a4d362e0e2d25372519
                // {"name":"round","eso_100":25,"etox":-4,"etoy":55,"eb_100":37,"ebr_100":-5,"esc_100":10,"etc_100":46,"eec_100":30,"eitc_100":43,"esi_100":26,"eti_100":84,"eei_100":6,"eito_100":143}
                //    eso_100:    25 = 0x19
                //       etox:    -4 = 0x25 - 41
                //       etoy:    55 = 0x37
                //     eb_100:    37 = 0x25
                //    ebr_100:    -5 = 0x2d - 50
                //    esc_100:    10 = 0x0e - 4
                //    etc_100:    46 = 0x2e
                //    eec_100:    30 = 0x36 - 24
                //   eitc_100:    43 = 0x4d - 34
                //    esi_100:    26 = 0x1a
                //    eti_100:    84 = 0x54
                //    eei_100:     6 = 0x06
                //   eito_100:   143 = 0x89 * 4 - 405
                
            }
            
            // eye - Select Data
            function selectData_eye(breedData) -> data {
                
                let rvs_eye          := getRvsValue(0x30)
                let iValue := mod(14, rvs_eye)
                

                // Load the data for the selected eye
                data := mload(add(
                        add(loadMemoryWord(2), 796), // DataPack[eye]
                        iValue))
                // Keep 72 bits (8 bits * 9 fields)
                data := shr(184, shl(184, data))

                
                // [0]: 0a08043c1215140428
                // {"name":"round","eyox":40,"eyoy":4,"eyw":20,"eyt":18,"eyb":18,"eyr_100":-4,"eypox":-4,"eypoy":0,"no":-3}
                //       eyox:    40 = 0x28
                //       eyoy:     4 = 0x04
                //        eyw:    20 = 0x14
                //        eyt:    18 = 0x15 - 3
                //        eyb:    18 = 0x12
                //    eyr_100:    -4 = 0x3c - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -3 = 0x0a - 13
                
                // [1]: 0c080414120f150528
                // {"name":"fierce","eyox":40,"eyoy":5,"eyw":21,"eyt":12,"eyb":18,"eyr_100":-44,"eypox":-4,"eypoy":0,"no":-1}
                //       eyox:    40 = 0x28
                //       eyoy:     5 = 0x05
                //        eyw:    21 = 0x15
                //        eyt:    12 = 0x0f - 3
                //        eyb:    18 = 0x12
                //    eyr_100:   -44 = 0x14 - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -1 = 0x0c - 13
                
                // [2]: 060805280712140528
                // {"name":"squinting","eyox":40,"eyoy":5,"eyw":20,"eyt":15,"eyb":7,"eyr_100":-24,"eypox":-3,"eypoy":0,"no":-7}
                //       eyox:    40 = 0x28
                //       eyoy:     5 = 0x05
                //        eyw:    20 = 0x14
                //        eyt:    15 = 0x12 - 3
                //        eyb:     7 = 0x07
                //    eyr_100:   -24 = 0x28 - 64
                //      eypox:    -3 = 0x05 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -7 = 0x06 - 13
                
                // [3]: 080d05641105150126
                // {"name":"sullen","eyox":38,"eyoy":1,"eyw":21,"eyt":2,"eyb":17,"eyr_100":36,"eypox":-3,"eypoy":5,"no":-5}
                //       eyox:    38 = 0x26
                //       eyoy:     1 = 0x01
                //        eyw:    21 = 0x15
                //        eyt:     2 = 0x05 - 3
                //        eyb:    17 = 0x11
                //    eyr_100:    36 = 0x64 - 64
                //      eypox:    -3 = 0x05 - 8
                //      eypoy:     5 = 0x0d - 8
                //         no:    -5 = 0x08 - 13
                
                // [4]: 0908045a1210150528
                // {"name":"meek","eyox":40,"eyoy":5,"eyw":21,"eyt":13,"eyb":18,"eyr_100":26,"eypox":-4,"eypoy":0,"no":-4}
                //       eyox:    40 = 0x28
                //       eyoy:     5 = 0x05
                //        eyw:    21 = 0x15
                //        eyt:    13 = 0x10 - 3
                //        eyb:    18 = 0x12
                //    eyr_100:    26 = 0x5a - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -4 = 0x09 - 13
                
                // [5]: 11080600120a140825
                // {"name":"stern","eyox":37,"eyoy":8,"eyw":20,"eyt":7,"eyb":18,"eyr_100":-64,"eypox":-2,"eypoy":0,"no":4}
                //       eyox:    37 = 0x25
                //       eyoy:     8 = 0x08
                //        eyw:    20 = 0x14
                //        eyt:     7 = 0x0a - 3
                //        eyb:    18 = 0x12
                //    eyr_100:   -64 = 0x00 - 64
                //      eypox:    -2 = 0x06 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:     4 = 0x11 - 13
                
                // [6]: 0b0a06321102140425
                // {"name":"mean","eyox":37,"eyoy":4,"eyw":20,"eyt":-1,"eyb":17,"eyr_100":-14.000000000000002,"eypox":-2,"eypoy":2,"no":-2}
                //       eyox:    37 = 0x25
                //       eyoy:     4 = 0x04
                //        eyw:    20 = 0x14
                //        eyt:    -1 = 0x02 - 3
                //        eyb:    17 = 0x11
                //    eyr_100:   -14 = 0x32 - 64
                //      eypox:    -2 = 0x06 - 8
                //      eypoy:     2 = 0x0a - 8
                //         no:    -2 = 0x0b - 13
                
                // [7]: 0c0d045a1600140228
                // {"name":"droopy","eyox":40,"eyoy":2,"eyw":20,"eyt":-3,"eyb":22,"eyr_100":26,"eypox":-4,"eypoy":5,"no":-1}
                //       eyox:    40 = 0x28
                //       eyoy:     2 = 0x02
                //        eyw:    20 = 0x14
                //        eyt:    -3 = 0x00 - 3
                //        eyb:    22 = 0x16
                //    eyr_100:    26 = 0x5a - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     5 = 0x0d - 8
                //         no:    -1 = 0x0c - 13
                
                // [8]: 090800281011130328
                // {"name":"cross","eyox":40,"eyoy":3,"eyw":19,"eyt":14,"eyb":16,"eyr_100":-24,"eypox":-8,"eypoy":0,"no":-4}
                //       eyox:    40 = 0x28
                //       eyoy:     3 = 0x03
                //        eyw:    19 = 0x13
                //        eyt:    14 = 0x11 - 3
                //        eyb:    16 = 0x10
                //    eyr_100:   -24 = 0x28 - 64
                //      eypox:    -8 = 0x00 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -4 = 0x09 - 13
                
                // [9]: 0908043c0e10130528
                // {"name":"almond","eyox":40,"eyoy":5,"eyw":19,"eyt":13,"eyb":14,"eyr_100":-4,"eypox":-4,"eypoy":0,"no":-4}
                //       eyox:    40 = 0x28
                //       eyoy:     5 = 0x05
                //        eyw:    19 = 0x13
                //        eyt:    13 = 0x10 - 3
                //        eyb:    14 = 0x0e
                //    eyr_100:    -4 = 0x3c - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -4 = 0x09 - 13
                
                // [10]: 0c080432120f150428
                // {"name":"doe","eyox":40,"eyoy":4,"eyw":21,"eyt":12,"eyb":18,"eyr_100":-14.000000000000002,"eypox":-4,"eypoy":0,"no":-1}
                //       eyox:    40 = 0x28
                //       eyoy:     4 = 0x04
                //        eyw:    21 = 0x15
                //        eyt:    12 = 0x0f - 3
                //        eyb:    18 = 0x12
                //    eyr_100:   -14 = 0x32 - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     0 = 0x08 - 8
                //         no:    -1 = 0x0c - 13
                
                // [11]: 000904320216150228
                // {"name":"glaring","eyox":40,"eyoy":2,"eyw":21,"eyt":19,"eyb":2,"eyr_100":-14.000000000000002,"eypox":-4,"eypoy":1,"no":-13}
                //       eyox:    40 = 0x28
                //       eyoy:     2 = 0x02
                //        eyw:    21 = 0x15
                //        eyt:    19 = 0x16 - 3
                //        eyb:     2 = 0x02
                //    eyr_100:   -14 = 0x32 - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:     1 = 0x09 - 8
                //         no:   -13 = 0x00 - 13
                
                // [12]: 06050446030f140828
                // {"name":"sleepy","eyox":40,"eyoy":8,"eyw":20,"eyt":12,"eyb":3,"eyr_100":6,"eypox":-4,"eypoy":-3,"no":-7}
                //       eyox:    40 = 0x28
                //       eyoy:     8 = 0x08
                //        eyw:    20 = 0x14
                //        eyt:    12 = 0x0f - 3
                //        eyb:     3 = 0x03
                //    eyr_100:     6 = 0x46 - 64
                //      eypox:    -4 = 0x04 - 8
                //      eypoy:    -3 = 0x05 - 8
                //         no:    -7 = 0x06 - 13
                
                // [13]: 0c0001640f11160b28
                // {"name":"pleading","eyox":40,"eyoy":11,"eyw":22,"eyt":14,"eyb":15,"eyr_100":36,"eypox":-7,"eypoy":-8,"no":-1}
                //       eyox:    40 = 0x28
                //       eyoy:    11 = 0x0b
                //        eyw:    22 = 0x16
                //        eyt:    14 = 0x11 - 3
                //        eyb:    15 = 0x0f
                //    eyr_100:    36 = 0x64 - 64
                //      eypox:    -7 = 0x01 - 8
                //      eypoy:    -8 = 0x00 - 8
                //         no:    -1 = 0x0c - 13
                
            }
            
            // pupil - Select Data
            function selectData_pupil(breedData) -> data {
                
                let rvs_pupil        := getRvsValue(0x38)
                let iValue := mod(6, rvs_pupil)
                

                // Load the data for the selected pupil
                data := mload(add(
                        add(loadMemoryWord(2), 1048), // DataPack[pupil]
                        iValue))
                // Keep 16 bits (8 bits * 2 fields)
                data := shr(240, shl(240, data))

                
                // [0]: 1e0c
                // {"name":"thin","eypw":12,"eyph":30}
                //       eypw:    12 = 0x0c
                //       eyph:    30 = 0x1e
                
                // [1]: 1c15
                // {"name":"big","eypw":21,"eyph":28}
                //       eypw:    21 = 0x15
                //       eyph:    28 = 0x1c
                
                // [2]: 1e1d
                // {"name":"huge","eypw":29,"eyph":30}
                //       eypw:    29 = 0x1d
                //       eyph:    30 = 0x1e
                
                // [3]: 160f
                // {"name":"normal","eypw":15,"eyph":22}
                //       eypw:    15 = 0x0f
                //       eyph:    22 = 0x16
                
                // [4]: 0d0d
                // {"name":"small","eypw":13,"eyph":13}
                //       eypw:    13 = 0x0d
                //       eyph:    13 = 0x0d
                
                // [5]: 1e07
                // {"name":"thinnest","eypw":7,"eyph":30}
                //       eypw:     7 = 0x07
                //       eyph:    30 = 0x1e
                
            }
            
            // mouth - Select Data
            function selectData_mouth(breedData) -> data {
                
                let rvs_mouth        := getRvsValue(0x40)
                let iValue := mod(9, rvs_mouth)
                

                // Load the data for the selected mouth
                data := mload(add(
                        add(loadMemoryWord(2), 1072), // DataPack[mouth]
                        iValue))
                // Keep 48 bits (8 bits * 6 fields)
                data := shr(208, shl(208, data))

                
                // [0]: 018a43080a0b
                // {"name":"neutral","mh":11,"mox":10,"moy":6,"mc_100":50,"tngo_100":500,"tng":true}
                //         mh:    11 = 0x0b
                //        mox:    10 = 0x0a
                //        moy:     6 = 0x08 - 2
                //     mc_100:    50 = 0x43 - 17
                //   tngo_100:   500 = 0x8a * 4 - 50
                //        tng:     1 = 0x01
                
                // [1]: 00d5430a0508
                // {"name":"pursed","mh":8,"mox":5,"moy":8,"mc_100":50,"tngo_100":800,"tng":false}
                //         mh:     8 = 0x08
                //        mox:     5 = 0x05
                //        moy:     8 = 0x0a - 2
                //     mc_100:    50 = 0x43 - 17
                //   tngo_100:   800 = 0xd5 * 4 - 50
                //        tng:     0 = 0x00
                
                // [2]: 016243060f0c
                // {"name":"pleased","mh":12,"mox":15,"moy":4,"mc_100":50,"tngo_100":340,"tng":true}
                //         mh:    12 = 0x0c
                //        mox:    15 = 0x0f
                //        moy:     4 = 0x06 - 2
                //     mc_100:    50 = 0x43 - 17
                //   tngo_100:   340 = 0x62 * 4 - 50
                //        tng:     1 = 0x01
                
                // [3]: 00d5160e050b
                // {"name":"pouting","mh":11,"mox":5,"moy":12,"mc_100":5,"tngo_100":800,"tng":false}
                //         mh:    11 = 0x0b
                //        mox:     5 = 0x05
                //        moy:    12 = 0x0e - 2
                //     mc_100:     5 = 0x16 - 17
                //   tngo_100:   800 = 0xd5 * 4 - 50
                //        tng:     0 = 0x00
                
                // [4]: 0078000e0a0c
                // {"name":"drooping","mh":12,"mox":10,"moy":12,"mc_100":-17,"tngo_100":430,"tng":false}
                //         mh:    12 = 0x0c
                //        mox:    10 = 0x0a
                //        moy:    12 = 0x0e - 2
                //     mc_100:   -17 = 0x00 - 17
                //   tngo_100:   430 = 0x78 * 4 - 50
                //        tng:     0 = 0x00
                
                // [5]: 012b03080b0d
                // {"name":"displeased","mh":13,"mox":11,"moy":6,"mc_100":-14.000000000000002,"tngo_100":120,"tng":true}
                //         mh:    13 = 0x0d
                //        mox:    11 = 0x0b
                //        moy:     6 = 0x08 - 2
                //     mc_100:   -14 = 0x03 - 17
                //   tngo_100:   120 = 0x2b * 4 - 50
                //        tng:     1 = 0x01
                
                // [6]: 00d5260f0a0a
                // {"name":"impartial","mh":10,"mox":10,"moy":13,"mc_100":21,"tngo_100":800,"tng":false}
                //         mh:    10 = 0x0a
                //        mox:    10 = 0x0a
                //        moy:    13 = 0x0f - 2
                //     mc_100:    21 = 0x26 - 17
                //   tngo_100:   800 = 0xd5 * 4 - 50
                //        tng:     0 = 0x00
                
                // [7]: 01001303080d
                // {"name":"dull","mh":13,"mox":8,"moy":1,"mc_100":2,"tngo_100":-50,"tng":true}
                //         mh:    13 = 0x0d
                //        mox:     8 = 0x08
                //        moy:     1 = 0x03 - 2
                //     mc_100:     2 = 0x13 - 17
                //   tngo_100:   -50 = 0x00 * 4 - 50
                //        tng:     1 = 0x01
                
                // [8]: 013258000e0d
                // {"name":"smiling","mh":13,"mox":14,"moy":-2,"mc_100":71,"tngo_100":150,"tng":true}
                //         mh:    13 = 0x0d
                //        mox:    14 = 0x0e
                //        moy:    -2 = 0x00 - 2
                //     mc_100:    71 = 0x58 - 17
                //   tngo_100:   150 = 0x32 * 4 - 50
                //        tng:     1 = 0x01
                
            }
            
            // whisker - Select Data
            function selectData_whisker(breedData) -> data {
                
                let rvs_whisker      := getRvsValue(0x48)
                let iValue := mod(4, rvs_whisker)
                

                // Load the data for the selected whisker
                data := mload(add(
                        add(loadMemoryWord(2), 1180), // DataPack[whisker]
                        iValue))
                // Keep 56 bits (8 bits * 7 fields)
                data := shr(200, shl(200, data))

                
                // [0]: 211e6404071204
                // {"name":"downward","whl":4,"wha_100":18,"whox":7,"whoy":4,"wheox":100,"wheoy":30,"whc_100":15}
                //        whl:     4 = 0x04
                //    wha_100:    18 = 0x12
                //       whox:     7 = 0x07
                //       whoy:     4 = 0x04
                //      wheox:   100 = 0x64
                //      wheoy:    30 = 0x1e
                //    whc_100:    15 = 0x21 - 18
                
                // [1]: 211e6404071203
                // {"name":"downwardShort","whl":3,"wha_100":18,"whox":7,"whoy":4,"wheox":100,"wheoy":30,"whc_100":15}
                //        whl:     3 = 0x03
                //    wha_100:    18 = 0x12
                //       whox:     7 = 0x07
                //       whoy:     4 = 0x04
                //      wheox:   100 = 0x64
                //      wheoy:    30 = 0x1e
                //    whc_100:    15 = 0x21 - 18
                
                // [2]: 00006604071404
                // {"name":"upward","whl":4,"wha_100":20,"whox":7,"whoy":4,"wheox":102,"wheoy":0,"whc_100":-18}
                //        whl:     4 = 0x04
                //    wha_100:    20 = 0x14
                //       whox:     7 = 0x07
                //       whoy:     4 = 0x04
                //      wheox:   102 = 0x66
                //      wheoy:     0 = 0x00
                //    whc_100:   -18 = 0x00 - 18
                
                // [3]: 00006604071403
                // {"name":"upwardShort","whl":3,"wha_100":20,"whox":7,"whoy":4,"wheox":102,"wheoy":0,"whc_100":-18}
                //        whl:     3 = 0x03
                //    wha_100:    20 = 0x14
                //       whox:     7 = 0x07
                //       whoy:     4 = 0x04
                //      wheox:   102 = 0x66
                //      wheoy:     0 = 0x00
                //    whc_100:   -18 = 0x00 - 18
                
            }
            
            // palette - Select Data
            function selectData_palette(breedData) -> data {
                
                let rvs_palette      := getRvsValue(0x18)
                let iValue := mod(4, rvs_palette)
                

                // Load the data for the selected palette
                data := mload(add(
                        add(loadMemoryWord(2), 1236), // DataPack[palette]
                        iValue))
                // Keep 104 bits (8 bits * 13 fields)
                data := shr(152, shl(152, data))

                
                // [0]: 0a090807060504030301020100
                // {"name":"black","c_bg":"#b8deff","c_body":"#1a1b1e","c_neck":"#cfd2de","c_face":"#1a1b1e","c_prim":"#fafafa","c_sec":"#fafafa","c_ear":"#0f0f10","c_earIn":"#874f60","c_eyeline":"#000000","c_nose":"#f09d9d","c_noseIn":"#2d1f16","c_mouth":"#a06a6a","c_whiskers":"#ededed"}
                //       c_bg:     0 = 0x00
                //     c_body:     1 = 0x01
                //     c_neck:     2 = 0x02
                //     c_face:     1 = 0x01
                //     c_prim:     3 = 0x03
                //      c_sec:     3 = 0x03
                //      c_ear:     4 = 0x04
                //    c_earIn:     5 = 0x05
                //  c_eyeline:     6 = 0x06
                //     c_nose:     7 = 0x07
                //   c_noseIn:     8 = 0x08
                //    c_mouth:     9 = 0x09
                // c_whiskers:    10 = 0x0a
                
                // [1]: 0d131211100f0e0d0c030a030b
                // {"name":"white","c_bg":"#8b92e9","c_body":"#fafafa","c_neck":"#ededed","c_face":"#fafafa","c_prim":"#121212","c_sec":"#050505","c_ear":"#f6f6f6","c_earIn":"#f3b4d9","c_eyeline":"#383838","c_nose":"#ffc2d4","c_noseIn":"#822673","c_mouth":"#3c252e","c_whiskers":"#050505"}
                //       c_bg:    11 = 0x0b
                //     c_body:     3 = 0x03
                //     c_neck:    10 = 0x0a
                //     c_face:     3 = 0x03
                //     c_prim:    12 = 0x0c
                //      c_sec:    13 = 0x0d
                //      c_ear:    14 = 0x0e
                //    c_earIn:    15 = 0x0f
                //  c_eyeline:    16 = 0x10
                //     c_nose:    17 = 0x11
                //   c_noseIn:    18 = 0x12
                //    c_mouth:    19 = 0x13
                // c_whiskers:    13 = 0x0d
                
                // [2]: 1f1e1d1c1b1a19181715161514
                // {"name":"ginger","c_bg":"#5d7bb1","c_body":"#ffae70","c_neck":"#ecddd5","c_face":"#ffae70","c_prim":"#fcfcfc","c_sec":"#e98649","c_ear":"#f7a464","c_earIn":"#ffede0","c_eyeline":"#8a400f","c_nose":"#ce5f5f","c_noseIn":"#32271f","c_mouth":"#4b291b","c_whiskers":"#6f3f2a"}
                //       c_bg:    20 = 0x14
                //     c_body:    21 = 0x15
                //     c_neck:    22 = 0x16
                //     c_face:    21 = 0x15
                //     c_prim:    23 = 0x17
                //      c_sec:    24 = 0x18
                //      c_ear:    25 = 0x19
                //    c_earIn:    26 = 0x1a
                //  c_eyeline:    27 = 0x1b
                //     c_nose:    28 = 0x1c
                //   c_noseIn:    29 = 0x1d
                //    c_mouth:    30 = 0x1e
                // c_whiskers:    31 = 0x1f
                
                // [3]: 10102726252423221720212000
                // {"name":"gray","c_bg":"#b8deff","c_body":"#7e849a","c_neck":"#d2d2db","c_face":"#7e849a","c_prim":"#fcfcfc","c_sec":"#555463","c_ear":"#6a6e7c","c_earIn":"#f5c7df","c_eyeline":"#3d3d3d","c_nose":"#f5b2d4","c_noseIn":"#703e57","c_mouth":"#383838","c_whiskers":"#383838"}
                //       c_bg:     0 = 0x00
                //     c_body:    32 = 0x20
                //     c_neck:    33 = 0x21
                //     c_face:    32 = 0x20
                //     c_prim:    23 = 0x17
                //      c_sec:    34 = 0x22
                //      c_ear:    35 = 0x23
                //    c_earIn:    36 = 0x24
                //  c_eyeline:    37 = 0x25
                //     c_nose:    38 = 0x26
                //   c_noseIn:    39 = 0x27
                //    c_mouth:    16 = 0x10
                // c_whiskers:    16 = 0x10
                
                // [4]: 0c3231302f2e2d2c2b292a2928
                // {"name":"brown","c_bg":"#f0f0f0","c_body":"#815d41","c_neck":"#ded1c9","c_face":"#815d41","c_prim":"#f2dfce","c_sec":"#40301c","c_ear":"#6e4e35","c_earIn":"#dd9797","c_eyeline":"#492c18","c_nose":"#f08e8e","c_noseIn":"#752f40","c_mouth":"#2f2323","c_whiskers":"#121212"}
                //       c_bg:    40 = 0x28
                //     c_body:    41 = 0x29
                //     c_neck:    42 = 0x2a
                //     c_face:    41 = 0x29
                //     c_prim:    43 = 0x2b
                //      c_sec:    44 = 0x2c
                //      c_ear:    45 = 0x2d
                //    c_earIn:    46 = 0x2e
                //  c_eyeline:    47 = 0x2f
                //     c_nose:    48 = 0x30
                //   c_noseIn:    49 = 0x31
                //    c_mouth:    50 = 0x32
                // c_whiskers:    12 = 0x0c
                
                // [5]: 3d3c3b3a393837363533343328
                // {"name":"british blue","c_bg":"#f0f0f0","c_body":"#5e6373","c_neck":"#cdd0d5","c_face":"#5e6373","c_prim":"#dadce7","c_sec":"#4d516a","c_ear":"#505568","c_earIn":"#dca7c1","c_eyeline":"#26242d","c_nose":"#13121c","c_noseIn":"#575757","c_mouth":"#191a1f","c_whiskers":"#171617"}
                //       c_bg:    40 = 0x28
                //     c_body:    51 = 0x33
                //     c_neck:    52 = 0x34
                //     c_face:    51 = 0x33
                //     c_prim:    53 = 0x35
                //      c_sec:    54 = 0x36
                //      c_ear:    55 = 0x37
                //    c_earIn:    56 = 0x38
                //  c_eyeline:    57 = 0x39
                //     c_nose:    58 = 0x3a
                //   c_noseIn:    59 = 0x3b
                //    c_mouth:    60 = 0x3c
                // c_whiskers:    61 = 0x3d
                
                // [6]: 434241401b1a013f01173e1700
                // {"name":"calico","c_bg":"#b8deff","c_body":"#fcfcfc","c_neck":"#e7e2de","c_face":"#fcfcfc","c_prim":"#1a1b1e","c_sec":"#e2843c","c_ear":"#1a1b1e","c_earIn":"#ffede0","c_eyeline":"#8a400f","c_nose":"#f39696","c_noseIn":"#6b1e62","c_mouth":"#6d4040","c_whiskers":"#262626"}
                //       c_bg:     0 = 0x00
                //     c_body:    23 = 0x17
                //     c_neck:    62 = 0x3e
                //     c_face:    23 = 0x17
                //     c_prim:     1 = 0x01
                //      c_sec:    63 = 0x3f
                //      c_ear:     1 = 0x01
                //    c_earIn:    26 = 0x1a
                //  c_eyeline:    27 = 0x1b
                //     c_nose:    64 = 0x40
                //   c_noseIn:    65 = 0x41
                //    c_mouth:    66 = 0x42
                // c_whiskers:    67 = 0x43
                
                // [7]: 4b4a0648494846474644454428
                // {"name":"creamy","c_bg":"#f0f0f0","c_body":"#e1d0c6","c_neck":"#e3d6ce","c_face":"#e1d0c6","c_prim":"#2e2520","c_sec":"#bfa89b","c_ear":"#2e2520","c_earIn":"#5f4534","c_eyeline":"#43352d","c_nose":"#5f4534","c_noseIn":"#000000","c_mouth":"#795944","c_whiskers":"#292929"}
                //       c_bg:    40 = 0x28
                //     c_body:    68 = 0x44
                //     c_neck:    69 = 0x45
                //     c_face:    68 = 0x44
                //     c_prim:    70 = 0x46
                //      c_sec:    71 = 0x47
                //      c_ear:    70 = 0x46
                //    c_earIn:    72 = 0x48
                //  c_eyeline:    73 = 0x49
                //     c_nose:    72 = 0x48
                //   c_noseIn:     6 = 0x06
                //    c_mouth:    74 = 0x4a
                // c_whiskers:    75 = 0x4b
                
                // [8]: 57565554535251504f4d4e4d4c
                // {"name":"pink","c_bg":"#5e4c9a","c_body":"#ffb8ee","c_neck":"#f1dfef","c_face":"#ffb8ee","c_prim":"#fff0fe","c_sec":"#d373be","c_ear":"#fbb1ea","c_earIn":"#d56dbe","c_eyeline":"#5c2e52","c_nose":"#a84d94","c_noseIn":"#3e1829","c_mouth":"#602957","c_whiskers":"#341b36"}
                //       c_bg:    76 = 0x4c
                //     c_body:    77 = 0x4d
                //     c_neck:    78 = 0x4e
                //     c_face:    77 = 0x4d
                //     c_prim:    79 = 0x4f
                //      c_sec:    80 = 0x50
                //      c_ear:    81 = 0x51
                //    c_earIn:    82 = 0x52
                //  c_eyeline:    83 = 0x53
                //     c_nose:    84 = 0x54
                //   c_noseIn:    85 = 0x55
                //    c_mouth:    86 = 0x56
                // c_whiskers:    87 = 0x57
                
                // [9]: 6261605f5e5d5c5b5a5859584c
                // {"name":"cyan","c_bg":"#5e4c9a","c_body":"#b8f4ff","c_neck":"#cedcdf","c_face":"#b8f4ff","c_prim":"#ebf8ff","c_sec":"#6da4c0","c_ear":"#a0ebf8","c_earIn":"#599bb1","c_eyeline":"#385561","c_nose":"#6891b1","c_noseIn":"#24223f","c_mouth":"#182a35","c_whiskers":"#151e23"}
                //       c_bg:    76 = 0x4c
                //     c_body:    88 = 0x58
                //     c_neck:    89 = 0x59
                //     c_face:    88 = 0x58
                //     c_prim:    90 = 0x5a
                //      c_sec:    91 = 0x5b
                //      c_ear:    92 = 0x5c
                //    c_earIn:    93 = 0x5d
                //  c_eyeline:    94 = 0x5e
                //     c_nose:    95 = 0x5f
                //   c_noseIn:    96 = 0x60
                //    c_mouth:    97 = 0x61
                // c_whiskers:    98 = 0x62
                
                // [10]: 0a6c066b6a6968676664656463
                // {"name":"green","c_bg":"#566a8f","c_body":"#7ca269","c_neck":"#ceded6","c_face":"#7ca269","c_prim":"#507141","c_sec":"#375845","c_ear":"#7a9a6a","c_earIn":"#355744","c_eyeline":"#1f2320","c_nose":"#343a31","c_noseIn":"#000000","c_mouth":"#242e1f","c_whiskers":"#ededed"}
                //       c_bg:    99 = 0x63
                //     c_body:   100 = 0x64
                //     c_neck:   101 = 0x65
                //     c_face:   100 = 0x64
                //     c_prim:   102 = 0x66
                //      c_sec:   103 = 0x67
                //      c_ear:   104 = 0x68
                //    c_earIn:   105 = 0x69
                //  c_eyeline:   106 = 0x6a
                //     c_nose:   107 = 0x6b
                //   c_noseIn:     6 = 0x06
                //    c_mouth:   108 = 0x6c
                // c_whiskers:    10 = 0x0a
                
                // [11]: 77767574737271706f6d6e6d14
                // {"name":"fleshy","c_bg":"#5d7bb1","c_body":"#f3d8d8","c_neck":"#f2e9e9","c_face":"#f3d8d8","c_prim":"#ffebeb","c_sec":"#ecb6b6","c_ear":"#f3cece","c_earIn":"#d38897","c_eyeline":"#b47979","c_nose":"#f0a8a8","c_noseIn":"#5e4040","c_mouth":"#a97575","c_whiskers":"#f5f5f5"}
                //       c_bg:    20 = 0x14
                //     c_body:   109 = 0x6d
                //     c_neck:   110 = 0x6e
                //     c_face:   109 = 0x6d
                //     c_prim:   111 = 0x6f
                //      c_sec:   112 = 0x70
                //      c_ear:   113 = 0x71
                //    c_earIn:   114 = 0x72
                //  c_eyeline:   115 = 0x73
                //     c_nose:   116 = 0x74
                //   c_noseIn:   117 = 0x75
                //    c_mouth:   118 = 0x76
                // c_whiskers:   119 = 0x77
                
                // [12]: 807f067e7d7c7b7a1a78797828
                // {"name":"sand","c_bg":"#f0f0f0","c_body":"#e4c7b4","c_neck":"#efe0d7","c_face":"#e4c7b4","c_prim":"#ffede0","c_sec":"#c19d8a","c_ear":"#d7b8a3","c_earIn":"#ba8882","c_eyeline":"#603e3e","c_nose":"#7b5656","c_noseIn":"#000000","c_mouth":"#3a2727","c_whiskers":"#6f5858"}
                //       c_bg:    40 = 0x28
                //     c_body:   120 = 0x78
                //     c_neck:   121 = 0x79
                //     c_face:   120 = 0x78
                //     c_prim:    26 = 0x1a
                //      c_sec:   122 = 0x7a
                //      c_ear:   123 = 0x7b
                //    c_earIn:   124 = 0x7c
                //  c_eyeline:   125 = 0x7d
                //     c_nose:   126 = 0x7e
                //   c_noseIn:     6 = 0x06
                //    c_mouth:   127 = 0x7f
                // c_whiskers:   128 = 0x80
                
                // [13]: 06068786068584834f81828114
                // {"name":"toyger","c_bg":"#5d7bb1","c_body":"#f09475","c_neck":"#decadc","c_face":"#f09475","c_prim":"#fff0fe","c_sec":"#49241d","c_ear":"#38251f","c_earIn":"#d491bb","c_eyeline":"#000000","c_nose":"#371515","c_noseIn":"#808080","c_mouth":"#000000","c_whiskers":"#000000"}
                //       c_bg:    20 = 0x14
                //     c_body:   129 = 0x81
                //     c_neck:   130 = 0x82
                //     c_face:   129 = 0x81
                //     c_prim:    79 = 0x4f
                //      c_sec:   131 = 0x83
                //      c_ear:   132 = 0x84
                //    c_earIn:   133 = 0x85
                //  c_eyeline:     6 = 0x06
                //     c_nose:   134 = 0x86
                //   c_noseIn:   135 = 0x87
                //    c_mouth:     6 = 0x06
                // c_whiskers:     6 = 0x06
                
            }
            
            // eyeColor - Select Data
            function selectData_eyeColor(iValue) -> data {
                

                // Load the data for the selected eyeColor
                data := mload(add(
                        add(loadMemoryWord(2), 1600), // DataPack[eyeColor]
                        iValue))
                // Keep 8 bits (8 bits * 1 fields)
                data := shr(248, shl(248, data))

                
                // [0]: 88
                // {"name":"blue","c_eye":"#d6f9ff"}
                //      c_eye:   136 = 0x88
                
                // [1]: 89
                // {"name":"yellow","c_eye":"#f9e9ae"}
                //      c_eye:   137 = 0x89
                
                // [2]: 8a
                // {"name":"green","c_eye":"#cafaa3"}
                //      c_eye:   138 = 0x8a
                
                // [3]: 8b
                // {"name":"orange","c_eye":"#ff9c66"}
                //      c_eye:   139 = 0x8b
                
                // [4]: 06
                // {"name":"black","c_eye":"#000000"}
                //      c_eye:     6 = 0x06
                
                // [5]: 8c
                // {"name":"white","c_eye":"#ef0902"}
                //      c_eye:   140 = 0x8c
                
            }
            
            // bodyParts - Select Data
            function selectData_bodyParts(iValue) -> data {
                

                // Load the data for the selected bodyParts
                data := mload(add(
                        add(loadMemoryWord(2), 1612), // DataPack[bodyParts]
                        iValue))
                // Keep 5 bits (1 bits * 5 fields)
                data := shr(251, shl(251, data))

                
                // [0]: 00
                // {"name":"0","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                // bodyParts_tabby:     0 = 0x00
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     0 = 0x00
                
                // [1]: 01
                // {"name":"1","bodyParts_tabby":true,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                // bodyParts_tabby:     1 = 0x01
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     0 = 0x00
                
                // [2]: 03
                // {"name":"3","bodyParts_tabby":true,"bodyParts_belly":true,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                // bodyParts_tabby:     1 = 0x01
                // bodyParts_belly:     1 = 0x01
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     0 = 0x00
                
                // [3]: 05
                // {"name":"5","bodyParts_tabby":true,"bodyParts_belly":false,"bodyParts_necktie":true,"bodyParts_corners":false,"bodyParts_stripes":false}
                // bodyParts_tabby:     1 = 0x01
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     1 = 0x01
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     0 = 0x00
                
                // [4]: 02
                // {"name":"2","bodyParts_tabby":false,"bodyParts_belly":true,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                // bodyParts_tabby:     0 = 0x00
                // bodyParts_belly:     1 = 0x01
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     0 = 0x00
                
                // [5]: 04
                // {"name":"4","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":true,"bodyParts_corners":false,"bodyParts_stripes":false}
                // bodyParts_tabby:     0 = 0x00
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     1 = 0x01
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     0 = 0x00
                
                // [6]: 08
                // {"name":"8","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":true,"bodyParts_stripes":false}
                // bodyParts_tabby:     0 = 0x00
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     1 = 0x01
                // bodyParts_stripes:     0 = 0x00
                
                // [7]: 10
                // {"name":"16","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":true}
                // bodyParts_tabby:     0 = 0x00
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     0 = 0x00
                // bodyParts_stripes:     1 = 0x01
                
                // [8]: 09
                // {"name":"9","bodyParts_tabby":true,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":true,"bodyParts_stripes":false}
                // bodyParts_tabby:     1 = 0x01
                // bodyParts_belly:     0 = 0x00
                // bodyParts_necktie:     0 = 0x00
                // bodyParts_corners:     1 = 0x01
                // bodyParts_stripes:     0 = 0x00
                
            }
            
            // faceParts - Select Data
            function selectData_faceParts(iValue) -> data {
                

                // Load the data for the selected faceParts
                data := mload(add(
                        add(loadMemoryWord(2), 1630), // DataPack[faceParts]
                        iValue))
                // Keep 8 bits (1 bits * 8 fields)
                data := shr(248, shl(248, data))

                
                // [0]: 00
                // {"name":"0","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [1]: 01
                // {"name":"1","faceParts_mask":true,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     1 = 0x01
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [2]: 02
                // {"name":"2","faceParts_mask":false,"faceParts_round":true,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     1 = 0x01
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [3]: 06
                // {"name":"6","faceParts_mask":false,"faceParts_round":true,"faceParts_nose":true,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     1 = 0x01
                // faceParts_nose:     1 = 0x01
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [4]: 0c
                // {"name":"12","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":true,"faceParts_chin":true,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     1 = 0x01
                // faceParts_chin:     1 = 0x01
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [5]: 10
                // {"name":"16","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":true,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     1 = 0x01
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [6]: 30
                // {"name":"48","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":true,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     1 = 0x01
                // faceParts_whiskers:     1 = 0x01
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [7]: 20
                // {"name":"32","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     1 = 0x01
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [8]: 24
                // {"name":"36","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":true,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     1 = 0x01
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     1 = 0x01
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [9]: 28
                // {"name":"40","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":true,"faceParts_triangle":false,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     1 = 0x01
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     1 = 0x01
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     0 = 0x00
                
                // [10]: 40
                // {"name":"64","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":true,"faceParts_temple":false}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     1 = 0x01
                // faceParts_temple:     0 = 0x00
                
                // [11]: 80
                // {"name":"128","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":true}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     0 = 0x00
                // faceParts_temple:     1 = 0x01
                
                // [12]: c0
                // {"name":"192","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":true,"faceParts_temple":true}
                // faceParts_mask:     0 = 0x00
                // faceParts_round:     0 = 0x00
                // faceParts_nose:     0 = 0x00
                // faceParts_chin:     0 = 0x00
                // faceParts_triangle:     0 = 0x00
                // faceParts_whiskers:     0 = 0x00
                // faceParts_ear:     1 = 0x01
                // faceParts_temple:     1 = 0x01
                
            }
            
    

        // Store inputs:
        // rvs
        mstore(getMemoryWordAddress(0), _rvs)
        // data memory address
        mstore(getMemoryWordAddress(1), dataPack)
        
        // Set Data Pack Address Values
        mstore(getMemoryWordAddress(3), add(loadMemoryWord(1), 0))
        mstore(getMemoryWordAddress(2), add(loadMemoryWord(1), 423))
        mstore(getMemoryWordAddress(4), add(loadMemoryWord(1), 1251))
    

        // Setup pOutputNext - First 32bits is length
        mstore(0x00, add(0x20, getMemoryWordAddress(4096)))

        // Main Function ---
        function generateSvgInner() {

            // Place pVars after output (leaving plenty of space for max string length)
            let pVars := getMemoryWordAddress(128)
            
            let slot0 := 0
            let slot1 := 0
            let slot2 := 0
            let slot3 := 0
            let slot4 := 0
            let slot5 := 0
            let slot6 := 0
            let slot7 := 0
            let slot8 := 0
            let slot9 := 0
            
            varStore(20, selectBreed())
            slot0 := selectData_head(varLoad(20))
            slot0 := selectData_ear(varLoad(20))
            slot0 := selectData_eye(varLoad(20))
            slot0 := selectData_pupil(varLoad(20))
            slot0 := selectData_mouth(varLoad(20))
            slot0 := selectData_whisker(varLoad(20))
            slot0 := selectData_palette(varLoad(20))
            slot0 := getBreedData_i_body(varLoad(20))
            slot0 := selectData_bodyParts(slot0)
            slot1 := getBreedData_i_face(varLoad(20))
            slot0 := selectData_faceParts(slot1)
            writeOutput_text(0)
            slot0 := getColor_bits(0x00, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(295)
            slot6 := getBreedData_f_useBodyColorForCorner(varLoad(20))
            slot0 := 0x0b
            slot2 := getRvsValue(slot0)
            slot0 := 0x80
            slot1 := slt(slot2, slot0)
            slot0 := getBreedData_f_swapMarkColors(varLoad(20))
            slot2 := and(slot1, slot0)
            slot1 := getColor_bits(0x28, loadMemoryWord(26))
            slot0 := getColor_bits(0x20, loadMemoryWord(26))
            slot4 := ternary(slot2, slot0, slot1)
            slot1 := getFieldData_bitFlag(0x03, loadMemoryWord(28))
            slot0 := not(slot6)
            slot1 := and(slot1, slot0)
            slot0 := getColor_bits(0x08, loadMemoryWord(26))
            slot0 := ternary(slot1, slot0, slot4)
            writeOutput_color(slot0)
            writeOutput_text(365)
            slot3 := getBreedData_f_calico(varLoad(20))
            slot1 := getFieldData_bitFlag(0x00, loadMemoryWord(29))
            slot0 := not(slot3)
            slot1 := and(slot1, slot0)
            slot0 := getColor_bits(0x18, loadMemoryWord(26))
            slot0 := ternary(slot1, slot0, slot4)
            writeOutput_color(slot0)
            writeOutput_text(435)
            writeOutput_color(slot4)
            writeOutput_text(505)
            slot1 := getColor_bits(0x20, loadMemoryWord(26))
            slot0 := getColor_bits(0x28, loadMemoryWord(26))
            slot2 := ternary(slot2, slot0, slot1)
            writeOutput_color(slot2)
            writeOutput_text(575)
            slot5 := ternary(slot3, slot4, slot2)
            writeOutput_color(slot5)
            writeOutput_text(645)
            slot0 := getFieldData_bitFlag(0x03, loadMemoryWord(28))
            slot1 := and(slot0, slot6)
            slot0 := getColor_bits(0x08, loadMemoryWord(26))
            slot1 := ternary(slot1, slot0, slot4)
            slot0 := getFieldData_bitFlag(0x03, loadMemoryWord(28))
            slot0 := and(slot0, slot3)
            slot0 := ternary(slot0, slot1, slot2)
            writeOutput_color(slot0)
            writeOutput_text(715)
            writeOutput_color(slot1)
            writeOutput_text(785)
            slot0 := getFieldData_bitFlag(0x00, loadMemoryWord(29))
            slot1 := and(slot0, slot3)
            slot0 := getColor_bits(0x18, loadMemoryWord(26))
            slot0 := ternary(slot1, slot0, slot4)
            writeOutput_color(slot0)
            writeOutput_text(855)
            slot0 := getFieldData_bitFlag(0x00, loadMemoryWord(29))
            slot1 := and(slot0, slot3)
            slot0 := getColor_bits(0x18, loadMemoryWord(26))
            slot0 := ternary(slot1, slot0, slot2)
            writeOutput_color(slot0)
            writeOutput_text(926)
            slot0 := 0x01000080
            writeOutput_color(slot0)
            writeOutput_text(1007)
            slot1 := getFieldData_bitFlag(0x07, loadMemoryWord(29))
            slot0 := getColor_bits(0x30, loadMemoryWord(26))
            slot0 := ternary(slot1, slot0, slot5)
            slot0 := ternary(slot3, slot0, slot2)
            writeOutput_color(slot0)
            writeOutput_text(1078)
            slot1 := getFieldData_bitFlag(0x06, loadMemoryWord(29))
            slot0 := getColor_bits(0x30, loadMemoryWord(26))
            slot0 := ternary(slot1, slot0, slot4)
            slot0 := ternary(slot3, slot0, slot4)
            writeOutput_color(slot0)
            writeOutput_text(1149)
            slot0 := getColor_bits(0x38, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(1220)
            slot0 := 0x0e
            slot1 := getRvsValue(slot0)
            slot0 := 0x80
            slot2 := slt(slot1, slot0)
            slot1 := getColor(selectData_eyeColor(loadMemoryWord(27)))
            slot0 := getColor(selectData_eyeColor(loadMemoryWord(27)))
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_color(slot0)
            writeOutput_text(1291)
            slot1 := getColor(selectData_eyeColor(loadMemoryWord(27)))
            slot0 := getColor(selectData_eyeColor(loadMemoryWord(27)))
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_color(slot0)
            writeOutput_text(1362)
            slot0 := getColor_bits(0x40, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(1433)
            slot2 := getBreedData_f_zombieEyes(varLoad(20))
            slot1 := 0xffffff
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_color(slot0)
            writeOutput_text(1520)
            slot1 := 0xffffff00
            slot0 := 0xffffff
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_color(slot0)
            writeOutput_text(1601)
            slot0 := 0x333333
            writeOutput_color(slot0)
            writeOutput_text(1671)
            slot0 := getColor_bits(0x58, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(1601)
            slot0 := 0xdb7093
            writeOutput_color(slot0)
            writeOutput_text(1601)
            slot0 := 0xe38fab
            writeOutput_color(slot0)
            writeOutput_text(1758)
            slot0 := getColor_bits(0x48, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(1829)
            slot0 := getColor_bits(0x50, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(1900)
            slot0 := getColor_bits(0x60, loadMemoryWord(26))
            writeOutput_color(slot0)
            writeOutput_text(1601)
            slot0 := 0x505050
            writeOutput_color(slot0)
            writeOutput_text(1979)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot5 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(100, 8, 0x40, loadMemoryWord(20))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := sub(slot5, slot0)
            slot2 := mul(slot1, slot0)
            slot1 := 0
            slot0 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot4 := sdiv(slot2, slot0)
            slot3 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot1 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := 0
            slot2 := average(slot1, slot0)
            slot1 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot4, slot0)
            slot0 := add(slot2, slot0)
            varStore(25, average(slot3, slot0))
            slot2 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot1 := getFieldData_byte(0x48, loadMemoryWord(20))
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            varStore(24, mul(slot2, slot0))
            slot3 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot1 := 0
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            varStore(10, bezierPoint_100(slot3, varLoad(25), varLoad(24), slot1, slot0))
            slot0 := 0x0a
            slot0 := add(varLoad(10), slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot2 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot1 := 0
            slot0 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot4, slot0)
            slot0 := sub(slot5, slot0)
            varStore(23, average(slot2, slot0))
            slot4 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot2 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot1 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot9 := bezierPoint_100(slot4, varLoad(23), slot2, slot1, slot0)
            slot0 := 0x32
            slot1 := sub(slot9, slot0)
            writeOutput_int(slot1)
            writeOutput_text(2778)
            slot0 := 0x0a
            slot0 := sub(varLoad(10), slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            writeOutput_int(slot1)
            writeOutput_text(2778)
            slot0 := 0x1e
            slot0 := add(varLoad(10), slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := 0x96
            slot1 := add(slot9, slot0)
            writeOutput_int(slot1)
            writeOutput_text(2778)
            slot0 := 0x1e
            slot0 := sub(varLoad(10), slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            writeOutput_int(slot1)
            writeOutput_text(2780)
            slot2 := getFieldData_bitFlag(0x04, loadMemoryWord(28))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(2905)
            slot2 := 0x32
            slot1 := 0
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot6 := lerp_100(slot2, slot1, slot0)
            slot0 := 0x1e
            slot3 := add(varLoad(10), slot0)
            slot0 := 0x07
            slot2 := add(slot9, slot0)
            slot1 := 0x04
            slot0 := 0x0a
            slot0 := sdiv(slot1, slot0)
            slot8 := mul(slot3, slot0)
            slot0 := 0x02
            slot0 := mul(slot6, slot0)
            slot7 := add(slot2, slot0)
            slot5 := sub(0, slot3)
            slot1 := 0x04
            slot0 := 0x0a
            slot0 := sdiv(slot1, slot0)
            slot4 := mul(slot5, slot0)
            slot0 := 0x02
            slot0 := mul(slot6, slot0)
            slot1 := add(slot2, slot0)
            slot0 := sub(0, slot3)
            writeOutput_bezier(slot3, slot2, slot8, slot7, slot4, slot1, slot0, slot2)
            writeOutput_text(2976)
            slot2 := getFieldData_bitFlag(0x03, loadMemoryWord(28))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(3209)
            slot0 := 0x1e
            slot3 := add(varLoad(10), slot0)
            slot2 := 0x28
            slot1 := 0x0a
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot0 := lerp_100(slot2, slot1, slot0)
            slot4 := lerp_100(varLoad(10), slot3, slot0)
            slot0 := sub(0, slot4)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := 0x96
            slot3 := add(slot9, slot0)
            slot2 := 0x28
            slot1 := 0x0a
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot0 := lerp_100(slot2, slot1, slot0)
            slot1 := lerp_100(slot9, slot3, slot0)
            writeOutput_int(slot1)
            writeOutput_text(2778)
            slot0 := 0x6e
            slot0 := add(slot4, slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := 0x96
            slot3 := add(slot1, slot0)
            writeOutput_int(slot3)
            writeOutput_text(2778)
            slot0 := 0x1e
            slot0 := sub(slot4, slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := 0x96
            slot2 := add(slot1, slot0)
            writeOutput_int(slot2)
            writeOutput_text(3244)
            writeOutput_int(slot4)
            writeOutput_text(2776)
            writeOutput_int(slot1)
            writeOutput_text(2778)
            slot0 := 0x6e
            slot0 := sub(slot4, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            writeOutput_int(slot3)
            writeOutput_text(2778)
            slot0 := 0x1e
            slot0 := add(slot4, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            writeOutput_int(slot2)
            writeOutput_text(3281)
            slot2 := getFieldData_bitFlag(0x00, loadMemoryWord(28))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(3302)
            slot3 := 0x1e
            slot2 := 0x01
            slot1 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot1 := sub(slot2, slot0)
            slot0 := 0x2a
            slot1 := mul(slot1, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(varLoad(10), slot0)
            slot1 := sub(0, slot0)
            slot0 := 0x1a
            slot0 := sub(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot3 := 0x96
            slot2 := 0x01
            slot1 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot1 := sub(slot2, slot0)
            slot0 := 0x2a
            slot1 := mul(slot1, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot1 := add(slot9, slot0)
            slot0 := 0x14
            slot0 := sub(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(3375)
            slot2 := getFieldData_bitFlag(0x02, loadMemoryWord(28))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(3647)
            slot2 := 0x46
            slot1 := 0
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot1 := lerp_100(slot2, slot1, slot0)
            slot0 := add(varLoad(10), slot1)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            writeOutput_int(slot9)
            writeOutput_text(3682)
            slot0 := sub(varLoad(10), slot1)
            writeOutput_int(slot0)
            writeOutput_text(2778)
            writeOutput_int(varLoad(10))
            writeOutput_text(2776)
            slot0 := 0x05
            slot0 := mul(slot1, slot0)
            slot0 := add(slot9, slot0)
            writeOutput_int(slot0)
            writeOutput_text(3682)
            slot0 := sub(0, varLoad(10))
            writeOutput_int(slot0)
            writeOutput_text(3281)
            slot2 := getFieldData_bitFlag(0x01, loadMemoryWord(28))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(3684)
            slot2 := 0x64
            slot1 := 0x32
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot1 := lerp_100(slot2, slot1, slot0)
            slot0 := 0x02
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(3738)
            slot0 := 0x0a
            slot1 := getRvsValue(slot0)
            slot0 := 0x80
            slot2 := slt(slot1, slot0)
            slot0 := 0x01
            slot1 := sub(0, slot0)
            slot0 := 0x01
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(3989)
            slot1 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot0 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot5 := average(slot1, slot0)
            slot0 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot2 := sub(slot5, slot0)
            slot1 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := 0
            slot0 := sub(slot1, slot0)
            slot4 := sdiv(slot2, slot0)
            slot2 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot1 := 0x04
            slot0 := 0x0a
            slot0 := sdiv(slot1, slot0)
            varStore(22, mul(slot2, slot0))
            slot3 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot1 := 0
            slot0 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot2 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot0 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot4, slot0)
            slot0 := add(slot2, slot0)
            varStore(21, average(slot3, slot0))
            slot2 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot1 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := 0
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot4, slot0)
            slot0 := sub(slot5, slot0)
            varStore(19, average(slot2, slot0))
            slot2 := 0
            slot1 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x00, loadMemoryWord(21))
            varStore(16, bezierPoint_100(slot2, varLoad(22), varLoad(21), slot1, slot0))
            slot3 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot2 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot1 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x00, loadMemoryWord(21))
            varStore(15, bezierPoint_100(slot3, slot2, varLoad(19), slot1, slot0))
            writeOutput(vertex(varLoad(16), varLoad(15)))
            slot2 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot1 := 0
            slot0 := getFieldData_byte(0x58, loadMemoryWord(20))
            varStore(14, bezierPoint_100(slot2, varLoad(21), varLoad(22), slot1, slot0))
            slot3 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot2 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot1 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x58, loadMemoryWord(20))
            varStore(12, bezierPoint_100(slot3, varLoad(19), slot2, slot1, slot0))
            slot0 := getFieldData_sub_bits(41, 8, 0x08, loadMemoryWord(21))
            slot8 := add(varLoad(14), slot0)
            slot0 := getFieldData_byte(0x10, loadMemoryWord(21))
            varStore(13, sub(varLoad(12), slot0))
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sub(0, slot0)
            slot0 := 0
            slot0 := constrain(slot2, slot1, slot0)
            slot1 := sub(0, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot9 := lerp_100(slot8, varLoad(16), slot0)
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sub(0, slot0)
            slot0 := 0
            slot0 := constrain(slot2, slot1, slot0)
            slot1 := sub(0, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot5 := lerp_100(varLoad(13), varLoad(15), slot0)
            slot2 := average(varLoad(16), slot9)
            slot1 := getFieldData_sub_bits(4, 8, 0x28, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot5, varLoad(15))
            slot0 := mul(slot1, slot0)
            slot4 := add(slot2, slot0)
            slot2 := average(varLoad(15), slot5)
            slot1 := getFieldData_sub_bits(4, 8, 0x28, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot9, varLoad(16))
            slot0 := mul(slot1, slot0)
            slot0 := sub(slot2, slot0)
            slot3 := average(varLoad(16), slot4)
            slot2 := average(varLoad(15), slot0)
            slot1 := average(slot9, slot4)
            slot0 := average(slot5, slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, slot9, slot5))
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot1 := 0
            slot0 := 0x64
            slot1 := constrain(slot2, slot1, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot7 := lerp_100(slot8, varLoad(14), slot0)
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot1 := 0
            slot0 := 0x64
            slot1 := constrain(slot2, slot1, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot4 := lerp_100(varLoad(13), varLoad(12), slot0)
            slot2 := average(slot9, slot7)
            slot1 := getFieldData_byte(0x30, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot4, slot5)
            slot0 := mul(slot1, slot0)
            slot6 := add(slot2, slot0)
            slot2 := average(slot5, slot4)
            slot1 := getFieldData_byte(0x30, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot7, slot9)
            slot0 := mul(slot1, slot0)
            slot0 := sub(slot2, slot0)
            slot3 := average(slot9, slot6)
            slot2 := average(slot5, slot0)
            slot1 := average(slot7, slot6)
            slot0 := average(slot4, slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, slot7, slot4))
            slot2 := average(slot7, varLoad(14))
            slot1 := getFieldData_sub_bits(24, 8, 0x38, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(varLoad(12), slot4)
            slot0 := mul(slot1, slot0)
            slot5 := add(slot2, slot0)
            slot2 := average(slot4, varLoad(12))
            slot1 := getFieldData_sub_bits(24, 8, 0x38, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(varLoad(14), slot7)
            slot0 := mul(slot1, slot0)
            slot0 := sub(slot2, slot0)
            slot3 := average(slot7, slot5)
            slot2 := average(slot4, slot0)
            slot1 := average(varLoad(14), slot5)
            slot0 := average(varLoad(12), slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, varLoad(14), varLoad(12)))
            writeOutput_text(4060)
            slot0 := getFieldData_byte(0x48, loadMemoryWord(21))
            slot6 := lerp_100(varLoad(16), varLoad(14), slot0)
            slot0 := getFieldData_byte(0x48, loadMemoryWord(21))
            slot5 := lerp_100(varLoad(15), varLoad(12), slot0)
            writeOutput(vertex(slot6, slot5))
            slot1 := 0x64
            slot0 := getFieldData_byte(0x58, loadMemoryWord(21))
            slot0 := sub(slot1, slot0)
            varStore(10, lerp_100(varLoad(16), varLoad(14), slot0))
            slot1 := 0x64
            slot0 := getFieldData_byte(0x58, loadMemoryWord(21))
            slot0 := sub(slot1, slot0)
            slot9 := lerp_100(varLoad(15), varLoad(12), slot0)
            varStore(17, average(slot6, varLoad(10)))
            varStore(18, average(slot5, slot9))
            slot0 := getFieldData_byte(0x50, loadMemoryWord(21))
            slot2 := lerp_100(varLoad(17), slot8, slot0)
            slot1 := getFieldData_sub_mul_bits(405, 4, 8, 0x60, loadMemoryWord(21))
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            varStore(11, add(slot2, slot0))
            slot0 := getFieldData_byte(0x50, loadMemoryWord(21))
            varStore(13, lerp_100(varLoad(18), varLoad(13), slot0))
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sub(0, slot0)
            slot0 := 0
            slot0 := constrain(slot2, slot1, slot0)
            slot1 := sub(0, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot8 := lerp_100(varLoad(11), slot6, slot0)
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sub(0, slot0)
            slot0 := 0
            slot0 := constrain(slot2, slot1, slot0)
            slot1 := sub(0, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot7 := lerp_100(varLoad(13), slot5, slot0)
            slot2 := average(slot6, slot8)
            slot1 := getFieldData_sub_bits(4, 8, 0x28, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot7, slot5)
            slot0 := mul(slot1, slot0)
            slot4 := add(slot2, slot0)
            slot2 := average(slot5, slot7)
            slot1 := getFieldData_sub_bits(4, 8, 0x28, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot8, slot6)
            slot0 := mul(slot1, slot0)
            slot0 := sub(slot2, slot0)
            slot3 := average(slot6, slot4)
            slot2 := average(slot5, slot0)
            slot1 := average(slot8, slot4)
            slot0 := average(slot7, slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, slot8, slot7))
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot1 := 0
            slot0 := 0x64
            slot1 := constrain(slot2, slot1, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot6 := lerp_100(varLoad(11), varLoad(10), slot0)
            slot4 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := 0x50
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot2 := sub(slot1, slot0)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(21))
            slot1 := ceil_100(slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot2, slot0)
            slot2 := getFieldData_sub_bits(50, 8, 0x20, loadMemoryWord(21))
            slot1 := 0
            slot0 := 0x64
            slot1 := constrain(slot2, slot1, slot0)
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot4 := lerp_100(varLoad(13), slot9, slot0)
            slot2 := average(slot8, slot6)
            slot1 := getFieldData_sub_bits(34, 8, 0x40, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot4, slot7)
            slot0 := mul(slot1, slot0)
            slot5 := add(slot2, slot0)
            slot2 := average(slot7, slot4)
            slot1 := getFieldData_sub_bits(34, 8, 0x40, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot6, slot8)
            slot0 := mul(slot1, slot0)
            slot0 := sub(slot2, slot0)
            slot3 := average(slot8, slot5)
            slot2 := average(slot7, slot0)
            slot1 := average(slot6, slot5)
            slot0 := average(slot4, slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, slot6, slot4))
            slot2 := average(slot6, varLoad(10))
            slot1 := getFieldData_sub_bits(24, 8, 0x38, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot9, slot4)
            slot0 := mul(slot1, slot0)
            slot5 := add(slot2, slot0)
            slot2 := average(slot4, slot9)
            slot1 := getFieldData_sub_bits(24, 8, 0x38, loadMemoryWord(21))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(varLoad(10), slot6)
            slot0 := mul(slot1, slot0)
            slot0 := sub(slot2, slot0)
            slot3 := average(slot6, slot5)
            slot2 := average(slot4, slot0)
            slot1 := average(varLoad(10), slot5)
            slot0 := average(slot9, slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, varLoad(10), slot9))
            writeOutput_text(4341)
            slot1 := 0
            slot0 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            writeOutput(vertex(slot1, slot0))
            slot2 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot1 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            writeOutput(bezierVertex(varLoad(22), slot2, varLoad(21), varLoad(19), slot1, slot0))
            slot1 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot3 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot4 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(60, 8, 0x30, loadMemoryWord(20))
            slot0 := 0x64
            slot2 := sdiv(slot1, slot0)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot5 := add(slot3, slot0)
            slot1 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot6 := sub(slot4, slot0)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot3 := sub(slot3, slot0)
            slot1 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot2 := add(slot4, slot0)
            slot1 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x38, loadMemoryWord(20))
            slot0 := lerp_100(slot5, slot3, slot0)
            slot7 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x38, loadMemoryWord(20))
            slot0 := lerp_100(slot6, slot2, slot0)
            slot8 := average(slot1, slot0)
            slot1 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := 0x64
            slot0 := lerp_100(slot3, slot5, slot0)
            slot5 := average(slot1, slot0)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := 0x64
            slot0 := lerp_100(slot2, slot6, slot0)
            slot6 := average(slot1, slot0)
            slot1 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := getFieldData_byte(0x20, loadMemoryWord(20))
            writeOutput(bezierVertex(slot7, slot8, slot5, slot6, slot1, slot0))
            slot2 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot1 := 0
            slot0 := getFieldData_byte(0x28, loadMemoryWord(20))
            writeOutput(bezierVertex(varLoad(25), varLoad(23), varLoad(24), slot2, slot1, slot0))
            slot4 := sub(0, varLoad(24))
            slot3 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot2 := sub(0, varLoad(25))
            slot0 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot1 := sub(0, slot0)
            slot0 := getFieldData_byte(0x20, loadMemoryWord(20))
            writeOutput(bezierVertex(slot4, slot3, slot2, varLoad(23), slot1, slot0))
            slot3 := sub(0, slot5)
            slot2 := sub(0, slot7)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(20))
            slot1 := sub(0, slot0)
            slot0 := getFieldData_sub_bits(30, 8, 0x10, loadMemoryWord(20))
            writeOutput(bezierVertex(slot3, slot6, slot2, slot8, slot1, slot0))
            slot4 := sub(0, varLoad(21))
            slot3 := sub(0, varLoad(22))
            slot2 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot0 := 0
            slot1 := sub(0, slot0)
            slot0 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            writeOutput(bezierVertex(slot4, varLoad(19), slot3, slot2, slot1, slot0))
            writeOutput_text(4708)
            slot2 := getFieldData_bitFlag(0x01, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(4833)
            slot1 := 0x25
            slot0 := getFieldData_sub_bits(13, 8, 0x40, loadMemoryWord(22))
            varStore(11, add(slot1, slot0))
            slot0 := 0x3c
            slot0 := add(varLoad(11), slot0)
            writeOutput_int(slot0)
            writeOutput_text(4878)
            slot2 := getFieldData_bitFlag(0x04, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(4914)
            writeOutput_int(varLoad(11))
            writeOutput_text(5025)
            slot0 := 0x64
            slot0 := add(varLoad(11), slot0)
            writeOutput_int(slot0)
            writeOutput_text(5032)
            writeOutput_int(slot0)
            writeOutput_text(3281)
            slot2 := getFieldData_bitFlag(0x05, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5038)
            slot0 := 0x06
            slot0 := add(varLoad(11), slot0)
            writeOutput_int(slot0)
            writeOutput_text(5084)
            writeOutput_int(slot0)
            writeOutput_text(5148)
            slot2 := getFieldData_bitFlag(0x06, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5184)
            writeOutput(vertex(varLoad(16), varLoad(15)))
            slot0 := 0x14
            slot3 := sub(varLoad(17), slot0)
            slot0 := 0x0f
            slot2 := add(varLoad(18), slot0)
            slot0 := 0x0f
            slot1 := add(varLoad(17), slot0)
            slot0 := 0x0f
            slot0 := add(varLoad(18), slot0)
            writeOutput(bezierVertex(slot3, slot2, slot1, slot0, varLoad(14), varLoad(12)))
            writeOutput_text(5218)
            slot2 := getFieldData_bitFlag(0x07, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5248)
            slot1 := getFieldData_byte(0x08, loadMemoryWord(22))
            slot0 := 0x48
            slot0 := sub(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(5295)
            slot2 := getFieldData_bitFlag(0x03, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5332)
            slot0 := 0x05
            slot0 := add(varLoad(11), slot0)
            writeOutput_int(slot0)
            writeOutput_text(5446)
            writeOutput_int(slot0)
            writeOutput_text(2778)
            slot2 := 0x28
            slot1 := 0x0a
            slot0 := getFieldData_byte(0x50, loadMemoryWord(20))
            slot2 := lerp_100(slot2, slot1, slot0)
            writeOutput_int(slot2)
            writeOutput_text(2776)
            slot0 := 0x50
            slot1 := add(varLoad(11), slot0)
            writeOutput_int(slot1)
            writeOutput_text(2778)
            slot0 := sub(0, slot2)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            writeOutput_int(slot1)
            writeOutput_text(3281)
            slot2 := getFieldData_bitFlag(0x02, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5451)
            slot0 := 0x05
            slot0 := add(varLoad(11), slot0)
            writeOutput_int(slot0)
            writeOutput_text(5446)
            writeOutput_int(slot0)
            writeOutput_text(3281)
            slot2 := getFieldData_bitFlag(0x00, loadMemoryWord(29))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5569)
            slot0 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            writeOutput_int(slot0)
            writeOutput_text(5614)
            slot1 := getFieldData_byte(0x08, loadMemoryWord(22))
            slot0 := 0x32
            slot0 := sub(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(5679)
            writeOutput_int(slot0)
            writeOutput_text(5743)
            slot0 := 0x0f
            slot1 := getRvsValue(slot0)
            slot0 := getBreedData_b_tabbyFaceOdds(varLoad(20))
            slot2 := not(sgt(slot1, slot0))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(5786)
            slot1 := getFieldData_byte(0x18, loadMemoryWord(20))
            slot0 := 0x1e
            slot0 := add(slot1, slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(20))
            slot0 := 0x05
            slot0 := sub(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(5841)
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(6189)
            slot1 := getFieldData_sub_bits(55, 8, 0x00, loadMemoryWord(20))
            slot0 := 0x1e
            slot0 := sub(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6248)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6431)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6445)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6448)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6538)
            slot4 := getFieldData_sub_bits(64, 8, 0x28, loadMemoryWord(22))
            slot3 := 0xb4
            slot2 := 0x64
            slot1 := 0x64
            slot0 := 0x013a
            slot0 := sdiv(slot1, slot0)
            slot0 := sdiv(slot2, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := mul(slot4, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6559)
            slot0 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot6 := sub(0, slot0)
            slot0 := 0
            slot1 := sub(slot6, slot0)
            slot0 := 0
            varStore(12, vertex(slot1, slot0))
            writeOutput(varLoad(12))
            slot0 := getFieldData_sub_bits(3, 8, 0x18, loadMemoryWord(22))
            slot3 := sub(0, slot0)
            slot2 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot1 := 0
            slot0 := 0x64
            slot0 := mul(slot1, slot0)
            varStore(13, lerp_100(slot3, slot2, slot0))
            slot0 := sdiv(0x32, 0x64)
            varStore(18, mul(slot6, slot0))
            slot0 := sdiv(0x32, 0x64)
            slot1 := mul(varLoad(13), slot0)
            slot0 := 0
            varStore(10, bezierVertex(slot6, slot1, varLoad(18), varLoad(13), slot0, varLoad(13)))
            writeOutput(varLoad(10))
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := sdiv(0x32, 0x64)
            varStore(19, mul(slot1, slot0))
            slot3 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := sdiv(0x32, 0x64)
            slot2 := mul(varLoad(13), slot0)
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := 0x04
            slot1 := add(slot1, slot0)
            slot0 := 0
            slot9 := bezierVertex(varLoad(19), varLoad(13), slot3, slot2, slot1, slot0)
            writeOutput(slot9)
            slot3 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot0 := getFieldData_sub_bits(3, 8, 0x18, loadMemoryWord(22))
            slot2 := sub(0, slot0)
            slot1 := 0
            slot0 := 0x64
            slot0 := mul(slot1, slot0)
            slot7 := lerp_100(slot3, slot2, slot0)
            slot0 := sdiv(0x32, 0x64)
            varStore(17, mul(slot7, slot0))
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := sdiv(0x32, 0x64)
            varStore(16, mul(slot1, slot0))
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := 0
            slot8 := bezierVertex(slot1, varLoad(17), varLoad(16), slot7, slot0, slot7)
            writeOutput(slot8)
            slot0 := sdiv(0x32, 0x64)
            varStore(14, mul(slot6, slot0))
            slot0 := sdiv(0x32, 0x64)
            varStore(15, mul(slot7, slot0))
            slot0 := 0
            slot1 := sub(slot6, slot0)
            slot0 := 0
            slot5 := bezierVertex(varLoad(14), slot7, slot6, varLoad(15), slot1, slot0)
            writeOutput(slot5)
            writeOutput_text(6566)
            writeOutput(varLoad(12))
            writeOutput_text(6678)
            writeOutput(varLoad(10))
            writeOutput_text(6678)
            writeOutput(slot9)
            writeOutput_text(6678)
            writeOutput(slot8)
            writeOutput_text(6678)
            writeOutput(slot5)
            writeOutput_text(6680)
            writeOutput(varLoad(12))
            writeOutput_text(6678)
            writeOutput(varLoad(10))
            writeOutput_text(6678)
            writeOutput(slot9)
            writeOutput_text(6678)
            writeOutput(slot8)
            writeOutput_text(6678)
            writeOutput(slot5)
            writeOutput_text(6680)
            slot0 := 0
            slot1 := sub(slot6, slot0)
            slot0 := 0
            writeOutput(vertex(slot1, slot0))
            writeOutput_text(6678)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot0 := 0x02
            slot4 := sdiv(slot1, slot0)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot0 := 0x01
            slot3 := sdiv(slot1, slot0)
            slot2 := 0
            slot1 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot0 := 0x01
            slot0 := sdiv(slot1, slot0)
            writeOutput(bezierVertex(slot6, slot4, varLoad(18), slot3, slot2, slot0))
            writeOutput_text(6678)
            slot1 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot0 := 0x01
            slot4 := sdiv(slot1, slot0)
            slot3 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot1 := getFieldData_byte(0x20, loadMemoryWord(22))
            slot0 := 0x02
            slot2 := sdiv(slot1, slot0)
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := 0x04
            slot1 := add(slot1, slot0)
            slot0 := 0
            writeOutput(bezierVertex(varLoad(19), slot4, slot3, slot2, slot1, slot0))
            writeOutput_text(6678)
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := 0
            writeOutput(bezierVertex(slot1, varLoad(17), varLoad(16), slot7, slot0, slot7))
            writeOutput_text(6678)
            slot0 := 0
            slot1 := sub(slot6, slot0)
            slot0 := 0
            writeOutput(bezierVertex(varLoad(14), slot7, slot6, varLoad(15), slot1, slot0))
            writeOutput_text(6680)
            writeOutput(varLoad(12))
            writeOutput_text(6678)
            writeOutput(varLoad(10))
            writeOutput_text(6678)
            writeOutput(slot9)
            writeOutput_text(6678)
            writeOutput(slot8)
            writeOutput_text(6678)
            writeOutput(slot5)
            writeOutput_text(6680)
            writeOutput(varLoad(12))
            writeOutput_text(6678)
            writeOutput(varLoad(10))
            writeOutput_text(6678)
            writeOutput(slot9)
            writeOutput_text(6678)
            writeOutput(slot8)
            writeOutput_text(6678)
            writeOutput(slot5)
            writeOutput_text(6685)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6854)
            slot0 := getFieldData_sub_bits(8, 8, 0x30, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6906)
            slot0 := getFieldData_sub_bits(8, 8, 0x38, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6913)
            slot1 := getFieldData_byte(0x00, loadMemoryWord(23))
            slot0 := 0x02
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6920)
            slot1 := getFieldData_byte(0x08, loadMemoryWord(23))
            slot0 := 0x02
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6927)
            slot2 := 0
            slot1 := getFieldData_byte(0x10, loadMemoryWord(22))
            slot0 := getFieldData_sub_bits(8, 8, 0x30, loadMemoryWord(22))
            slot0 := add(slot1, slot0)
            slot1 := add(slot2, slot0)
            slot0 := 0x03
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot1 := 0
            slot0 := getFieldData_sub_bits(8, 8, 0x38, loadMemoryWord(22))
            slot0 := add(slot1, slot0)
            slot1 := add(varLoad(13), slot0)
            slot0 := 0x03
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(7059)
            slot1 := 0
            slot0 := getFieldData_sub_bits(8, 8, 0x30, loadMemoryWord(22))
            slot0 := add(slot1, slot0)
            slot1 := add(slot6, slot0)
            slot0 := 0x03
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot1 := 0
            slot0 := getFieldData_sub_bits(8, 8, 0x38, loadMemoryWord(22))
            slot0 := add(slot7, slot0)
            slot1 := add(slot1, slot0)
            slot0 := 0x03
            slot0 := sdiv(slot1, slot0)
            writeOutput_int(slot0)
            writeOutput_text(7171)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(7394)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(6445)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(7407)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := getFieldData_byte(0x08, loadMemoryWord(22))
            writeOutput_int(slot0)
            writeOutput_text(7603)
            writeOutput_int(varLoad(11))
            writeOutput_text(7733)
            slot0 := getFieldData_byte(0x00, loadMemoryWord(24))
            slot1 := add(varLoad(11), slot0)
            slot0 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot4 := constrain(slot1, varLoad(11), slot0)
            slot3 := 0
            slot2 := sub(varLoad(11), varLoad(11))
            slot1 := 0
            slot0 := sub(slot4, varLoad(11))
            writeOutput(line(slot3, slot2, slot1, slot0))
            writeOutput_text(7858)
            slot0 := getFieldData_sub_bits(2, 8, 0x10, loadMemoryWord(24))
            slot1 := add(slot4, slot0)
            slot0 := getFieldData_byte(0x28, loadMemoryWord(20))
            slot5 := constrain(slot1, varLoad(11), slot0)
            slot1 := 0
            slot0 := getFieldData_byte(0x08, loadMemoryWord(24))
            slot2 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(17, 8, 0x18, loadMemoryWord(24))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := sub(slot5, slot4)
            slot0 := mul(slot1, slot0)
            slot3 := sub(slot2, slot0)
            slot6 := average(slot4, slot5)
            slot1 := getFieldData_sub_bits(17, 8, 0x18, loadMemoryWord(24))
            slot0 := 0x64
            slot2 := sdiv(slot1, slot0)
            slot1 := getFieldData_byte(0x08, loadMemoryWord(24))
            slot0 := 0
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot1 := add(slot6, slot0)
            slot8 := 0
            slot7 := sub(slot4, varLoad(11))
            slot0 := 0
            slot6 := average(slot0, slot3)
            slot0 := average(slot4, slot1)
            slot4 := sub(slot0, varLoad(11))
            slot0 := getFieldData_byte(0x08, loadMemoryWord(24))
            slot3 := average(slot0, slot3)
            slot0 := average(slot5, slot1)
            slot2 := sub(slot0, varLoad(11))
            slot1 := getFieldData_byte(0x08, loadMemoryWord(24))
            slot0 := sub(slot5, varLoad(11))
            writeOutput_bezier(slot8, slot7, slot6, slot4, slot3, slot2, slot1, slot0)
            writeOutput_text(7932)
            slot2 := getBreedData_f_whiskers(varLoad(20))
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(7996)
            slot0 := getFieldData_byte(0x10, loadMemoryWord(25))
            slot2 := sub(0, slot0)
            slot1 := 0x05
            slot0 := 0x0a
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot2, slot0)
            writeOutput_int(slot0)
            writeOutput_text(2776)
            slot0 := getFieldData_byte(0x18, loadMemoryWord(25))
            writeOutput_int(slot0)
            writeOutput_text(8059)
            slot0 := 0x11
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6559)
            slot1 := getFieldData_byte(0x10, loadMemoryWord(25))
            slot0 := sdiv(0x96, 0x64)
            slot5 := mul(slot1, slot0)
            slot0 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot3 := average(slot5, slot0)
            slot1 := getFieldData_sub_bits(18, 8, 0x30, loadMemoryWord(25))
            slot0 := 0x64
            slot2 := sdiv(slot1, slot0)
            slot1 := getFieldData_byte(0x28, loadMemoryWord(25))
            slot0 := 0
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot2 := add(slot3, slot0)
            slot1 := 0
            slot0 := getFieldData_byte(0x28, loadMemoryWord(25))
            slot3 := average(slot1, slot0)
            slot1 := getFieldData_sub_bits(18, 8, 0x30, loadMemoryWord(25))
            slot0 := 0x64
            slot1 := sdiv(slot1, slot0)
            slot0 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot0 := sub(slot0, slot5)
            slot0 := mul(slot1, slot0)
            slot1 := sub(slot3, slot0)
            slot9 := average(slot5, slot2)
            slot0 := 0
            slot8 := average(slot0, slot1)
            slot0 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot6 := average(slot0, slot2)
            slot0 := getFieldData_byte(0x28, loadMemoryWord(25))
            slot7 := average(slot0, slot1)
            slot2 := 0
            slot1 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot0 := getFieldData_byte(0x28, loadMemoryWord(25))
            writeOutput_bezier(slot5, slot2, slot9, slot8, slot6, slot7, slot1, slot0)
            writeOutput_text(8139)
            slot4 := 0x11
            slot3 := getFieldData_byte(0x08, loadMemoryWord(25))
            slot2 := 0x02
            slot1 := 0x39
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6559)
            slot4 := 0
            slot1 := 0x09
            slot0 := 0x0a
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot6, slot0)
            slot2 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot1 := 0x09
            slot0 := 0x0a
            slot0 := sdiv(slot1, slot0)
            slot1 := mul(slot2, slot0)
            slot0 := getFieldData_byte(0x28, loadMemoryWord(25))
            writeOutput_bezier(slot5, slot4, slot9, slot8, slot3, slot7, slot1, slot0)
            writeOutput_text(8219)
            slot1 := getFieldData_byte(0x00, loadMemoryWord(25))
            slot0 := 0x02
            slot2 := sgt(slot1, slot0)
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(8290)
            slot4 := 0x11
            slot3 := getFieldData_byte(0x08, loadMemoryWord(25))
            slot2 := 0x01
            slot1 := 0x39
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6559)
            slot2 := 0
            slot1 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot0 := getFieldData_byte(0x28, loadMemoryWord(25))
            writeOutput_bezier(slot5, slot2, slot9, slot8, slot6, slot7, slot1, slot0)
            writeOutput_text(8219)
            slot1 := getFieldData_byte(0x00, loadMemoryWord(25))
            slot0 := 0x03
            slot2 := sgt(slot1, slot0)
            slot1 := 0x01
            slot0 := 0
            slot0 := ternary(slot2, slot0, slot1)
            writeOutput_int(slot0)
            writeOutput_text(8290)
            slot4 := 0x11
            slot3 := getFieldData_byte(0x08, loadMemoryWord(25))
            slot2 := 0x03
            slot1 := 0x39
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot0 := mul(slot3, slot0)
            slot0 := add(slot4, slot0)
            slot0 := sub(0, slot0)
            writeOutput_int(slot0)
            writeOutput_text(6559)
            slot4 := 0
            slot1 := 0x4b
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot3 := mul(slot6, slot0)
            slot2 := getFieldData_byte(0x20, loadMemoryWord(25))
            slot1 := 0x4b
            slot0 := 0x64
            slot0 := sdiv(slot1, slot0)
            slot1 := mul(slot2, slot0)
            slot0 := getFieldData_byte(0x28, loadMemoryWord(25))
            writeOutput_bezier(slot5, slot4, slot9, slot8, slot3, slot7, slot1, slot0)
            writeOutput_text(8311)
            slot0 := 0
            writeOutput(vertex(slot0, varLoad(11)))
            slot0 := 0x09
            slot6 := sub(0, slot0)
            slot0 := 0x0b
            slot8 := sub(varLoad(11), slot0)
            slot0 := 0
            slot2 := average(slot0, slot6)
            slot1 := sdiv(0x14, 0x64)
            slot0 := sub(slot8, varLoad(11))
            slot0 := mul(slot1, slot0)
            slot2 := add(slot2, slot0)
            slot3 := average(varLoad(11), slot8)
            slot1 := sdiv(0x14, 0x64)
            slot0 := 0
            slot0 := sub(slot6, slot0)
            slot0 := mul(slot1, slot0)
            slot1 := sub(slot3, slot0)
            slot0 := 0
            varStore(13, average(slot0, slot2))
            varStore(14, average(varLoad(11), slot1))
            varStore(10, average(slot6, slot2))
            varStore(12, average(slot8, slot1))
            writeOutput(bezierVertex(varLoad(13), varLoad(14), varLoad(10), varLoad(12), slot6, slot8))
            slot0 := 0x0b
            slot3 := sub(varLoad(11), slot0)
            slot0 := 0x09
            slot2 := average(slot6, slot0)
            slot1 := sdiv(0x14, 0x64)
            slot0 := sub(slot3, slot8)
            slot0 := mul(slot1, slot0)
            slot2 := add(slot2, slot0)
            slot4 := average(slot8, slot3)
            slot1 := sdiv(0x14, 0x64)
            slot0 := 0x09
            slot0 := sub(slot0, slot6)
            slot0 := mul(slot1, slot0)
            slot1 := sub(slot4, slot0)
            slot5 := average(slot6, slot2)
            slot4 := average(slot8, slot1)
            slot0 := 0x09
            slot2 := average(slot0, slot2)
            slot1 := average(slot3, slot1)
            slot0 := 0x09
            writeOutput(bezierVertex(slot5, slot4, slot2, slot1, slot0, slot3))
            slot1 := 0x09
            slot0 := 0
            slot2 := average(slot1, slot0)
            slot1 := sdiv(0x14, 0x64)
            slot0 := sub(varLoad(11), slot3)
            slot0 := mul(slot1, slot0)
            slot4 := add(slot2, slot0)
            slot5 := average(slot3, varLoad(11))
            slot2 := sdiv(0x14, 0x64)
            slot1 := 0
            slot0 := 0x09
            slot0 := sub(slot1, slot0)
            slot0 := mul(slot2, slot0)
            slot1 := sub(slot5, slot0)
            slot0 := 0x09
            slot5 := average(slot0, slot4)
            slot3 := average(slot3, slot1)
            slot0 := 0
            slot2 := average(slot0, slot4)
            slot1 := average(varLoad(11), slot1)
            slot0 := 0
            writeOutput(bezierVertex(slot5, slot3, slot2, slot1, slot0, varLoad(11)))
            writeOutput_text(8499)
            slot1 := 0
            slot0 := 0x14
            slot4 := bezierPoint_100(slot1, varLoad(13), varLoad(10), slot6, slot0)
            slot0 := 0x14
            slot2 := bezierPoint_100(varLoad(11), varLoad(14), varLoad(12), slot8, slot0)
            slot0 := 0x01
            slot9 := add(slot4, slot0)
            slot1 := 0x09
            slot0 := sdiv(0x28, 0x64)
            slot0 := mul(slot1, slot0)
            slot7 := sub(slot2, slot0)
            slot1 := 0x09
            slot0 := sdiv(0x28, 0x64)
            slot0 := mul(slot1, slot0)
            slot5 := add(slot4, slot0)
            slot1 := 0x0b
            slot0 := sdiv(0x3c, 0x64)
            slot0 := mul(slot1, slot0)
            slot3 := sub(slot2, slot0)
            slot1 := 0
            slot0 := 0x50
            slot1 := bezierPoint_100(slot1, varLoad(13), varLoad(10), slot6, slot0)
            slot0 := 0x50
            slot0 := bezierPoint_100(varLoad(11), varLoad(14), varLoad(12), slot8, slot0)
            writeOutput_bezier(slot4, slot2, slot9, slot7, slot5, slot3, slot1, slot0)
            writeOutput_text(8599)
        }
        generateSvgInner()

        // Finalize output
        output := getMemoryWordAddress(4096)
        // Set actual string length (pOutput - output - uint256 length))
        mstore(output, sub(sub(mload(0x00), getMemoryWordAddress(4096)), 0x20))
        // Set free memory pointer to after string
        mstore(0x40, mload(0x00))

// --- END ---    
        }

        return output;
    }
}