  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function generateSvg(uint _rvs) public pure returns (string memory) {
        string memory output;

        assembly {
// START ---    


            function getRvsValue(rvs, bitShift) -> value {
                value := and(0xff, shr(bitShift, rvs))
            }
    

            // Select Breed Data from rvs value
            function selectBreed(rvs) -> breedData {
                let rvs_breed        := getRvsValue(rvs, 0x00)
                let rvs_body         := getRvsValue(rvs, 0x08)
                let rvs_face         := getRvsValue(rvs, 0x10)
                let rvs_palette      := getRvsValue(rvs, 0x18)
                let rvs_eyeColor     := getRvsValue(rvs, 0x68)

                
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
            
    

            // Colors
            function getColor(index) -> color {
                color := 0

                // 460 bytes (uncompressed)
                // ~40 bytes + 140 * 3 raw bytes/case (13 colors each case, with 1 byte index)
                // let pVarPaletteDataOffset = 0x42
                // color := mload(add(mload(0x40),add(0x42,index)))

                // 2704 bytes (indexes only)
                // ~19.3 bytes per case (3 actual bytes of data per case)
                switch index
                
                case 0 { color := 0xb8deff }
                case 1 { color := 0x1a1b1e }
                case 2 { color := 0xcfd2de }
                case 3 { color := 0xfafafa }
                case 4 { color := 0x0f0f10 }
                case 5 { color := 0x874f60 }
                case 6 { color := 0x000000 }
                case 7 { color := 0xf09d9d }
                case 8 { color := 0x2d1f16 }
                case 9 { color := 0xa06a6a }
                case 10 { color := 0xededed }
                case 11 { color := 0x8b92e9 }
                case 12 { color := 0x121212 }
                case 13 { color := 0x050505 }
                case 14 { color := 0xf6f6f6 }
                case 15 { color := 0xf3b4d9 }
                case 16 { color := 0x383838 }
                case 17 { color := 0xffc2d4 }
                case 18 { color := 0x822673 }
                case 19 { color := 0x3c252e }
                case 20 { color := 0x5d7bb1 }
                case 21 { color := 0xffae70 }
                case 22 { color := 0xecddd5 }
                case 23 { color := 0xfcfcfc }
                case 24 { color := 0xe98649 }
                case 25 { color := 0xf7a464 }
                case 26 { color := 0xffede0 }
                case 27 { color := 0x8a400f }
                case 28 { color := 0xce5f5f }
                case 29 { color := 0x32271f }
                case 30 { color := 0x4b291b }
                case 31 { color := 0x6f3f2a }
                case 32 { color := 0x7e849a }
                case 33 { color := 0xd2d2db }
                case 34 { color := 0x555463 }
                case 35 { color := 0x6a6e7c }
                case 36 { color := 0xf5c7df }
                case 37 { color := 0x3d3d3d }
                case 38 { color := 0xf5b2d4 }
                case 39 { color := 0x703e57 }
                case 40 { color := 0xf0f0f0 }
                case 41 { color := 0x815d41 }
                case 42 { color := 0xded1c9 }
                case 43 { color := 0xf2dfce }
                case 44 { color := 0x40301c }
                case 45 { color := 0x6e4e35 }
                case 46 { color := 0xdd9797 }
                case 47 { color := 0x492c18 }
                case 48 { color := 0xf08e8e }
                case 49 { color := 0x752f40 }
                case 50 { color := 0x2f2323 }
                case 51 { color := 0x5e6373 }
                case 52 { color := 0xcdd0d5 }
                case 53 { color := 0xdadce7 }
                case 54 { color := 0x4d516a }
                case 55 { color := 0x505568 }
                case 56 { color := 0xdca7c1 }
                case 57 { color := 0x26242d }
                case 58 { color := 0x13121c }
                case 59 { color := 0x575757 }
                case 60 { color := 0x191a1f }
                case 61 { color := 0x171617 }
                case 62 { color := 0xe7e2de }
                case 63 { color := 0xe2843c }
                case 64 { color := 0xf39696 }
                case 65 { color := 0x6b1e62 }
                case 66 { color := 0x6d4040 }
                case 67 { color := 0x262626 }
                case 68 { color := 0xe1d0c6 }
                case 69 { color := 0xe3d6ce }
                case 70 { color := 0x2e2520 }
                case 71 { color := 0xbfa89b }
                case 72 { color := 0x5f4534 }
                case 73 { color := 0x43352d }
                case 74 { color := 0x795944 }
                case 75 { color := 0x292929 }
                case 76 { color := 0x5e4c9a }
                case 77 { color := 0xffb8ee }
                case 78 { color := 0xf1dfef }
                case 79 { color := 0xfff0fe }
                case 80 { color := 0xd373be }
                case 81 { color := 0xfbb1ea }
                case 82 { color := 0xd56dbe }
                case 83 { color := 0x5c2e52 }
                case 84 { color := 0xa84d94 }
                case 85 { color := 0x3e1829 }
                case 86 { color := 0x602957 }
                case 87 { color := 0x341b36 }
                case 88 { color := 0xb8f4ff }
                case 89 { color := 0xcedcdf }
                case 90 { color := 0xebf8ff }
                case 91 { color := 0x6da4c0 }
                case 92 { color := 0xa0ebf8 }
                case 93 { color := 0x599bb1 }
                case 94 { color := 0x385561 }
                case 95 { color := 0x6891b1 }
                case 96 { color := 0x24223f }
                case 97 { color := 0x182a35 }
                case 98 { color := 0x151e23 }
                case 99 { color := 0x566a8f }
                case 100 { color := 0x7ca269 }
                case 101 { color := 0xceded6 }
                case 102 { color := 0x507141 }
                case 103 { color := 0x375845 }
                case 104 { color := 0x7a9a6a }
                case 105 { color := 0x355744 }
                case 106 { color := 0x1f2320 }
                case 107 { color := 0x343a31 }
                case 108 { color := 0x242e1f }
                case 109 { color := 0xf3d8d8 }
                case 110 { color := 0xf2e9e9 }
                case 111 { color := 0xffebeb }
                case 112 { color := 0xecb6b6 }
                case 113 { color := 0xf3cece }
                case 114 { color := 0xd38897 }
                case 115 { color := 0xb47979 }
                case 116 { color := 0xf0a8a8 }
                case 117 { color := 0x5e4040 }
                case 118 { color := 0xa97575 }
                case 119 { color := 0xf5f5f5 }
                case 120 { color := 0xe4c7b4 }
                case 121 { color := 0xefe0d7 }
                case 122 { color := 0xc19d8a }
                case 123 { color := 0xd7b8a3 }
                case 124 { color := 0xba8882 }
                case 125 { color := 0x603e3e }
                case 126 { color := 0x7b5656 }
                case 127 { color := 0x3a2727 }
                case 128 { color := 0x6f5858 }
                case 129 { color := 0xf09475 }
                case 130 { color := 0xdecadc }
                case 131 { color := 0x49241d }
                case 132 { color := 0x38251f }
                case 133 { color := 0xd491bb }
                case 134 { color := 0x371515 }
                case 135 { color := 0x808080 }
                case 136 { color := 0xd6f9ff }
                case 137 { color := 0xf9e9ae }
                case 138 { color := 0xcafaa3 }
                case 139 { color := 0xff9c66 }
                case 140 { color := 0xef0902 }
            }

            
            // head - Select Data

            function selectData_head(rvs, breedData) -> data {
                data := 0

                
                let rvs_head         := getBreedData_b_head(breedData) 
                if not(rvs_head) { rvs_head := getRvsValue(rvs, 0x20) }

                // data := mod(15, rvs_head)

                // 215 bytes (uncompressed)
                // ~11 bytes + 17 * 12 raw bytes/case
                // let pVarHeadDataOffset = 0x42
                // data := mload(add(mload(0x40),add(0x42,mod(15, rvs_head))))

                // 503 bytes
                // ~29.6 bytes per case (12 actual bytes of data per case)
                switch mod(15, rvs_head)
                

                // offset:   [55,0,30,0,0,0,60,0,100,0,0,0]
                // scale:    [1,1,1,1,1,1,1,1,1,1,1,1]
                // decimal:  [1,1,1,1,1,1,1,1,1,1,1,1]

                
                case 0 { 
                    // head: round
                    // {"name":"round","fhy":-55,"tplx":73,"tply":-29,"chkx":86,"chky":23,"chny":91,"chkc_100":1,"chko_100":0,"chnc_100":-100,"chno_100":44,"bw_100":55.00000000000001,"eeo_100":0}
                    // [-55,73,-29,86,23,91,1,0,-100,44,55,0]
                    // [0,73,1,86,23,91,61,0,0,44,55,0]
                    data := 0x00490156175b3d00002c3700
                }
                
                case 1 { 
                    // head: oval
                    // {"name":"oval","fhy":-50,"tplx":78,"tply":-29,"chkx":80,"chky":28,"chny":88,"chkc_100":3,"chko_100":0,"chnc_100":-100,"chno_100":35,"bw_100":51,"eeo_100":0}
                    // [-50,78,-29,80,28,88,3,0,-100,35,51,0]
                    // [5,78,1,80,28,88,63,0,0,35,51,0]
                    data := 0x054e01501c583f0000233300
                }
                
                case 2 { 
                    // head: diamond
                    // {"name":"diamond","fhy":-54,"tplx":79,"tply":-24,"chkx":96,"chky":25,"chny":86,"chkc_100":11,"chko_100":63,"chnc_100":-74,"chno_100":6,"bw_100":47,"eeo_100":0}
                    // [-54,79,-24,96,25,86,11,63,-74,6,47,0]
                    // [1,79,6,96,25,86,71,63,26,6,47,0]
                    data := 0x014f06601956473f1a062f00
                }
                
                case 3 { 
                    // head: squarish
                    // {"name":"squarish","fhy":-52,"tplx":77,"tply":-25,"chkx":95,"chky":47,"chny":86,"chkc_100":-1,"chko_100":0,"chnc_100":-100,"chno_100":32,"bw_100":52,"eeo_100":0}
                    // [-52,77,-25,95,47,86,-1,0,-100,32,52,0]
                    // [3,77,5,95,47,86,59,0,0,32,52,0]
                    data := 0x034d055f2f563b0000203400
                }
                
                case 4 { 
                    // head: fluffy
                    // {"name":"fluffy","fhy":-50,"tplx":70,"tply":-26,"chkx":100,"chky":25,"chny":90,"chkc_100":-60,"chko_100":95,"chnc_100":-100,"chno_100":20,"bw_100":50,"eeo_100":0}
                    // [-50,70,-26,100,25,90,-60,95,-100,20,50,0]
                    // [5,70,4,100,25,90,0,95,0,20,50,0]
                    data := 0x05460464195a005f00143200
                }
                
                case 5 { 
                    // head: scruffy
                    // {"name":"scruffy","fhy":-50,"tplx":77,"tply":-25,"chkx":91,"chky":38,"chny":79,"chkc_100":39,"chko_100":89,"chnc_100":14.000000000000002,"chno_100":48,"bw_100":54,"eeo_100":0}
                    // [-50,77,-25,91,38,79,39,89,14,48,54,0]
                    // [5,77,5,91,38,79,99,89,114,48,54,0]
                    data := 0x054d055b264f635972303600
                }
                
                case 6 { 
                    // head: plain
                    // {"name":"plain","fhy":-55,"tplx":79,"tply":-27,"chkx":89,"chky":37,"chny":88,"chkc_100":-6,"chko_100":0,"chnc_100":-36,"chno_100":43,"bw_100":52,"eeo_100":0}
                    // [-55,79,-27,89,37,88,-6,0,-36,43,52,0]
                    // [0,79,3,89,37,88,54,0,64,43,52,0]
                    data := 0x004f035925583600402b3400
                }
                
                case 7 { 
                    // head: chonker
                    // {"name":"chonker","fhy":-47,"tplx":70,"tply":-24,"chkx":99,"chky":21,"chny":92,"chkc_100":-26,"chko_100":63,"chnc_100":-100,"chno_100":49,"bw_100":56.00000000000001,"eeo_100":0}
                    // [-47,70,-24,99,21,92,-26,63,-100,49,56,0]
                    // [8,70,6,99,21,92,34,63,0,49,56,0]
                    data := 0x08460663155c223f00313800
                }
                
                case 8 { 
                    // head: slick
                    // {"name":"slick","fhy":-51,"tplx":73,"tply":-5,"chkx":102,"chky":20,"chny":84,"chkc_100":-60,"chko_100":26,"chnc_100":-100,"chno_100":37,"bw_100":59,"eeo_100":13}
                    // [-51,73,-5,102,20,84,-60,26,-100,37,59,13]
                    // [4,73,25,102,20,84,0,26,0,37,59,13]
                    data := 0x044919661454001a00253b0d
                }
                
                case 9 { 
                    // head: rectangular
                    // {"name":"rectangular","fhy":-52,"tplx":86,"tply":-13,"chkx":91,"chky":55,"chny":80,"chkc_100":12,"chko_100":76,"chnc_100":85,"chno_100":33,"bw_100":50,"eeo_100":0}
                    // [-52,86,-13,91,55,80,12,76,85,33,50,0]
                    // [3,86,17,91,55,80,72,76,185,33,50,0]
                    data := 0x0356115b3750484cb9213200
                }
                
                case 10 { 
                    // head: teeny
                    // {"name":"teeny","fhy":-48,"tplx":75,"tply":-30,"chkx":89,"chky":33,"chny":79,"chkc_100":4,"chko_100":0,"chnc_100":-36,"chno_100":48,"bw_100":56.00000000000001,"eeo_100":0}
                    // [-48,75,-30,89,33,79,4,0,-36,48,56,0]
                    // [7,75,0,89,33,79,64,0,64,48,56,0]
                    data := 0x074b0059214f400040303800
                }
                
                case 11 { 
                    // head: cheeky
                    // {"name":"cheeky","fhy":-50,"tplx":70,"tply":-28,"chkx":92,"chky":41,"chny":84,"chkc_100":-28.999999999999996,"chko_100":30,"chnc_100":-54,"chno_100":37,"bw_100":53,"eeo_100":0}
                    // [-50,70,-28,92,41,84,-29,30,-54,37,53,0]
                    // [5,70,2,92,41,84,31,30,46,37,53,0]
                    data := 0x0546025c29541f1e2e253500
                }
                
                case 12 { 
                    // head: lemon
                    // {"name":"lemon","fhy":-49,"tplx":80,"tply":-1,"chkx":97,"chky":24,"chny":84,"chkc_100":-3,"chko_100":0,"chnc_100":-100,"chno_100":37,"bw_100":56.00000000000001,"eeo_100":15}
                    // [-49,80,-1,97,24,84,-3,0,-100,37,56,15]
                    // [6,80,29,97,24,84,57,0,0,37,56,15]
                    data := 0x06501d61185439000025380f
                }
                
                case 13 { 
                    // head: silky
                    // {"name":"silky","fhy":-50,"tplx":70,"tply":-10,"chkx":99,"chky":41,"chny":85,"chkc_100":-60,"chko_100":100,"chnc_100":14.000000000000002,"chno_100":36,"bw_100":55.00000000000001,"eeo_100":13}
                    // [-50,70,-10,99,41,85,-60,100,14,36,55,13]
                    // [5,70,20,99,41,85,0,100,114,36,55,13]
                    data := 0x05461463295500647224370d
                }
                
                case 14 { 
                    // head: chubby
                    // {"name":"chubby","fhy":-53,"tplx":74,"tply":-6,"chkx":88,"chky":39,"chny":83,"chkc_100":60,"chko_100":0,"chnc_100":-100,"chno_100":40,"bw_100":55.00000000000001,"eeo_100":15}
                    // [-53,74,-6,88,39,83,60,0,-100,40,55,15]
                    // [2,74,24,88,39,83,120,0,0,40,55,15]
                    data := 0x024a1858275378000028370f
                }
                
                case 15 { 
                    // head: skinny
                    // {"name":"skinny","fhy":-44,"tplx":77,"tply":-19,"chkx":68,"chky":31,"chny":83,"chkc_100":60,"chko_100":43,"chnc_100":76,"chno_100":50,"bw_100":50,"eeo_100":0}
                    // [-44,77,-19,68,31,83,60,43,76,50,50,0]
                    // [11,77,11,68,31,83,120,43,176,50,50,0]
                    data := 0x0b4d0b441f53782bb0323200
                }
                
                case 16 { 
                    // head: wide
                    // {"name":"wide","fhy":-54,"tplx":98,"tply":-19,"chkx":87,"chky":40,"chny":81,"chkc_100":-1,"chko_100":0,"chnc_100":0,"chno_100":30,"bw_100":45,"eeo_100":0}
                    // [-54,98,-19,87,40,81,-1,0,0,30,45,0]
                    // [1,98,11,87,40,81,59,0,100,30,45,0]
                    data := 0x01620b5728513b00641e2d00
                }
                
                case 17 { 
                    // head: blocky
                    // {"name":"blocky","fhy":-52,"tplx":80,"tply":-26,"chkx":98,"chky":53,"chny":87,"chkc_100":4,"chko_100":0,"chnc_100":-100,"chno_100":32,"bw_100":50,"eeo_100":0}
                    // [-52,80,-26,98,53,87,4,0,-100,32,50,0]
                    // [3,80,4,98,53,87,64,0,0,32,50,0]
                    data := 0x035004623557400000203200
                }
                
            }

            // head - Get Data
            
            function getFieldValue_head_fhy(headData) -> value {                
                // [0] -55 = 0 * 1 - 55                
                // [1] -50 = 5 * 1 - 55                
                // [2] -54 = 1 * 1 - 55                
                // [3] -52 = 3 * 1 - 55                
                // [4] -50 = 5 * 1 - 55                
                // [5] -50 = 5 * 1 - 55                
                // [6] -55 = 0 * 1 - 55                
                // [7] -47 = 8 * 1 - 55                
                // [8] -51 = 4 * 1 - 55                
                // [9] -52 = 3 * 1 - 55                
                // [10] -48 = 7 * 1 - 55                
                // [11] -50 = 5 * 1 - 55                
                // [12] -49 = 6 * 1 - 55                
                // [13] -50 = 5 * 1 - 55                
                // [14] -53 = 2 * 1 - 55                
                // [15] -44 = 11 * 1 - 55                
                // [16] -54 = 1 * 1 - 55                
                // [17] -52 = 3 * 1 - 55
                value := and(0xff, shr(0x00, headData))
                value := sub(value, 55)
            }
            
            function getFieldValue_head_tplx(headData) -> value {                
                // [0] 73 = 73 * 1 - 0                
                // [1] 78 = 78 * 1 - 0                
                // [2] 79 = 79 * 1 - 0                
                // [3] 77 = 77 * 1 - 0                
                // [4] 70 = 70 * 1 - 0                
                // [5] 77 = 77 * 1 - 0                
                // [6] 79 = 79 * 1 - 0                
                // [7] 70 = 70 * 1 - 0                
                // [8] 73 = 73 * 1 - 0                
                // [9] 86 = 86 * 1 - 0                
                // [10] 75 = 75 * 1 - 0                
                // [11] 70 = 70 * 1 - 0                
                // [12] 80 = 80 * 1 - 0                
                // [13] 70 = 70 * 1 - 0                
                // [14] 74 = 74 * 1 - 0                
                // [15] 77 = 77 * 1 - 0                
                // [16] 98 = 98 * 1 - 0                
                // [17] 80 = 80 * 1 - 0
                value := and(0xff, shr(0x08, headData))
            }
            
            function getFieldValue_head_tply(headData) -> value {                
                // [0] -29 = 1 * 1 - 30                
                // [1] -29 = 1 * 1 - 30                
                // [2] -24 = 6 * 1 - 30                
                // [3] -25 = 5 * 1 - 30                
                // [4] -26 = 4 * 1 - 30                
                // [5] -25 = 5 * 1 - 30                
                // [6] -27 = 3 * 1 - 30                
                // [7] -24 = 6 * 1 - 30                
                // [8] -5 = 25 * 1 - 30                
                // [9] -13 = 17 * 1 - 30                
                // [10] -30 = 0 * 1 - 30                
                // [11] -28 = 2 * 1 - 30                
                // [12] -1 = 29 * 1 - 30                
                // [13] -10 = 20 * 1 - 30                
                // [14] -6 = 24 * 1 - 30                
                // [15] -19 = 11 * 1 - 30                
                // [16] -19 = 11 * 1 - 30                
                // [17] -26 = 4 * 1 - 30
                value := and(0xff, shr(0x10, headData))
                value := sub(value, 30)
            }
            
            function getFieldValue_head_chkx(headData) -> value {                
                // [0] 86 = 86 * 1 - 0                
                // [1] 80 = 80 * 1 - 0                
                // [2] 96 = 96 * 1 - 0                
                // [3] 95 = 95 * 1 - 0                
                // [4] 100 = 100 * 1 - 0                
                // [5] 91 = 91 * 1 - 0                
                // [6] 89 = 89 * 1 - 0                
                // [7] 99 = 99 * 1 - 0                
                // [8] 102 = 102 * 1 - 0                
                // [9] 91 = 91 * 1 - 0                
                // [10] 89 = 89 * 1 - 0                
                // [11] 92 = 92 * 1 - 0                
                // [12] 97 = 97 * 1 - 0                
                // [13] 99 = 99 * 1 - 0                
                // [14] 88 = 88 * 1 - 0                
                // [15] 68 = 68 * 1 - 0                
                // [16] 87 = 87 * 1 - 0                
                // [17] 98 = 98 * 1 - 0
                value := and(0xff, shr(0x18, headData))
            }
            
            function getFieldValue_head_chky(headData) -> value {                
                // [0] 23 = 23 * 1 - 0                
                // [1] 28 = 28 * 1 - 0                
                // [2] 25 = 25 * 1 - 0                
                // [3] 47 = 47 * 1 - 0                
                // [4] 25 = 25 * 1 - 0                
                // [5] 38 = 38 * 1 - 0                
                // [6] 37 = 37 * 1 - 0                
                // [7] 21 = 21 * 1 - 0                
                // [8] 20 = 20 * 1 - 0                
                // [9] 55 = 55 * 1 - 0                
                // [10] 33 = 33 * 1 - 0                
                // [11] 41 = 41 * 1 - 0                
                // [12] 24 = 24 * 1 - 0                
                // [13] 41 = 41 * 1 - 0                
                // [14] 39 = 39 * 1 - 0                
                // [15] 31 = 31 * 1 - 0                
                // [16] 40 = 40 * 1 - 0                
                // [17] 53 = 53 * 1 - 0
                value := and(0xff, shr(0x20, headData))
            }
            
            function getFieldValue_head_chny(headData) -> value {                
                // [0] 91 = 91 * 1 - 0                
                // [1] 88 = 88 * 1 - 0                
                // [2] 86 = 86 * 1 - 0                
                // [3] 86 = 86 * 1 - 0                
                // [4] 90 = 90 * 1 - 0                
                // [5] 79 = 79 * 1 - 0                
                // [6] 88 = 88 * 1 - 0                
                // [7] 92 = 92 * 1 - 0                
                // [8] 84 = 84 * 1 - 0                
                // [9] 80 = 80 * 1 - 0                
                // [10] 79 = 79 * 1 - 0                
                // [11] 84 = 84 * 1 - 0                
                // [12] 84 = 84 * 1 - 0                
                // [13] 85 = 85 * 1 - 0                
                // [14] 83 = 83 * 1 - 0                
                // [15] 83 = 83 * 1 - 0                
                // [16] 81 = 81 * 1 - 0                
                // [17] 87 = 87 * 1 - 0
                value := and(0xff, shr(0x28, headData))
            }
            
            function getFieldValue_head_chkc_100(headData) -> value {                
                // [0] 1 = 61 * 1 - 60                
                // [1] 3 = 63 * 1 - 60                
                // [2] 11 = 71 * 1 - 60                
                // [3] -1 = 59 * 1 - 60                
                // [4] -60 = 0 * 1 - 60                
                // [5] 39 = 99 * 1 - 60                
                // [6] -6 = 54 * 1 - 60                
                // [7] -26 = 34 * 1 - 60                
                // [8] -60 = 0 * 1 - 60                
                // [9] 12 = 72 * 1 - 60                
                // [10] 4 = 64 * 1 - 60                
                // [11] -29 = 31 * 1 - 60                
                // [12] -3 = 57 * 1 - 60                
                // [13] -60 = 0 * 1 - 60                
                // [14] 60 = 120 * 1 - 60                
                // [15] 60 = 120 * 1 - 60                
                // [16] -1 = 59 * 1 - 60                
                // [17] 4 = 64 * 1 - 60
                value := and(0xff, shr(0x30, headData))
                value := sub(value, 60)
            }
            
            function getFieldValue_head_chko_100(headData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 63 = 63 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 95 = 95 * 1 - 0                
                // [5] 89 = 89 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 63 = 63 * 1 - 0                
                // [8] 26 = 26 * 1 - 0                
                // [9] 76 = 76 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 30 = 30 * 1 - 0                
                // [12] 0 = 0 * 1 - 0                
                // [13] 100 = 100 * 1 - 0                
                // [14] 0 = 0 * 1 - 0                
                // [15] 43 = 43 * 1 - 0                
                // [16] 0 = 0 * 1 - 0                
                // [17] 0 = 0 * 1 - 0
                value := and(0xff, shr(0x38, headData))
            }
            
            function getFieldValue_head_chnc_100(headData) -> value {                
                // [0] -100 = 0 * 1 - 100                
                // [1] -100 = 0 * 1 - 100                
                // [2] -74 = 26 * 1 - 100                
                // [3] -100 = 0 * 1 - 100                
                // [4] -100 = 0 * 1 - 100                
                // [5] 14 = 114 * 1 - 100                
                // [6] -36 = 64 * 1 - 100                
                // [7] -100 = 0 * 1 - 100                
                // [8] -100 = 0 * 1 - 100                
                // [9] 85 = 185 * 1 - 100                
                // [10] -36 = 64 * 1 - 100                
                // [11] -54 = 46 * 1 - 100                
                // [12] -100 = 0 * 1 - 100                
                // [13] 14 = 114 * 1 - 100                
                // [14] -100 = 0 * 1 - 100                
                // [15] 76 = 176 * 1 - 100                
                // [16] 0 = 100 * 1 - 100                
                // [17] -100 = 0 * 1 - 100
                value := and(0xff, shr(0x40, headData))
                value := sub(value, 100)
            }
            
            function getFieldValue_head_chno_100(headData) -> value {                
                // [0] 44 = 44 * 1 - 0                
                // [1] 35 = 35 * 1 - 0                
                // [2] 6 = 6 * 1 - 0                
                // [3] 32 = 32 * 1 - 0                
                // [4] 20 = 20 * 1 - 0                
                // [5] 48 = 48 * 1 - 0                
                // [6] 43 = 43 * 1 - 0                
                // [7] 49 = 49 * 1 - 0                
                // [8] 37 = 37 * 1 - 0                
                // [9] 33 = 33 * 1 - 0                
                // [10] 48 = 48 * 1 - 0                
                // [11] 37 = 37 * 1 - 0                
                // [12] 37 = 37 * 1 - 0                
                // [13] 36 = 36 * 1 - 0                
                // [14] 40 = 40 * 1 - 0                
                // [15] 50 = 50 * 1 - 0                
                // [16] 30 = 30 * 1 - 0                
                // [17] 32 = 32 * 1 - 0
                value := and(0xff, shr(0x48, headData))
            }
            
            function getFieldValue_head_bw_100(headData) -> value {                
                // [0] 55 = 55 * 1 - 0                
                // [1] 51 = 51 * 1 - 0                
                // [2] 47 = 47 * 1 - 0                
                // [3] 52 = 52 * 1 - 0                
                // [4] 50 = 50 * 1 - 0                
                // [5] 54 = 54 * 1 - 0                
                // [6] 52 = 52 * 1 - 0                
                // [7] 56 = 56 * 1 - 0                
                // [8] 59 = 59 * 1 - 0                
                // [9] 50 = 50 * 1 - 0                
                // [10] 56 = 56 * 1 - 0                
                // [11] 53 = 53 * 1 - 0                
                // [12] 56 = 56 * 1 - 0                
                // [13] 55 = 55 * 1 - 0                
                // [14] 55 = 55 * 1 - 0                
                // [15] 50 = 50 * 1 - 0                
                // [16] 45 = 45 * 1 - 0                
                // [17] 50 = 50 * 1 - 0
                value := and(0xff, shr(0x50, headData))
            }
            
            function getFieldValue_head_eeo_100(headData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 13 = 13 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 15 = 15 * 1 - 0                
                // [13] 13 = 13 * 1 - 0                
                // [14] 15 = 15 * 1 - 0                
                // [15] 0 = 0 * 1 - 0                
                // [16] 0 = 0 * 1 - 0                
                // [17] 0 = 0 * 1 - 0
                value := and(0xff, shr(0x58, headData))
            }
            

            

        
            // ear - Select Data

            function selectData_ear(rvs, breedData) -> data {
                data := 0

                
                let rvs_ear          := getBreedData_b_ear(breedData) 
                if not(rvs_ear) { rvs_ear := getRvsValue(rvs, 0x28) }
                switch mod(11, rvs_ear)
                

                // offset:   [0,41,0,0,50,4,0,24,34,0,0,0,405]
                // scale:    [1,1,1,1,1,1,1,1,1,1,1,1,4]
                // decimal:  [1,1,1,1,1,1,1,1,1,1,1,1,1]

                
                case 0 { 
                    // ear: plain
                    // {"name":"plain","eso_100":27,"etox":-1,"etoy":52,"eb_100":7.000000000000001,"ebr_100":0,"esc_100":19,"etc_100":49,"eec_100":13,"eitc_100":53,"esi_100":25,"eti_100":80,"eei_100":10,"eito_100":0}
                    // [27,-1,52,7,0,19,49,13,53,25,80,10,0]
                    // [27,40,52,7,50,23,49,37,87,25,80,10,101]
                    data := 0x1b283407321731255719500a65
                }
                
                case 1 { 
                    // ear: upright
                    // {"name":"upright","eso_100":28.999999999999996,"etox":-21,"etoy":70,"eb_100":20,"ebr_100":0,"esc_100":-4,"etc_100":16,"eec_100":22,"eitc_100":16,"esi_100":30,"eti_100":80,"eei_100":10,"eito_100":0}
                    // [29,-21,70,20,0,-4,16,22,16,30,80,10,0]
                    // [29,20,70,20,50,0,16,46,50,30,80,10,101]
                    data := 0x1d1446143200102e321e500a65
                }
                
                case 2 { 
                    // ear: alert
                    // {"name":"alert","eso_100":23,"etox":-41,"etoy":69,"eb_100":17,"ebr_100":0,"esc_100":-3,"etc_100":17,"eec_100":20,"eitc_100":23,"esi_100":30,"eti_100":77,"eei_100":13,"eito_100":0}
                    // [23,-41,69,17,0,-3,17,20,23,30,77,13,0]
                    // [23,0,69,17,50,1,17,44,57,30,77,13,101]
                    data := 0x170045113201112c391e4d0d65
                }
                
                case 3 { 
                    // ear: pointy
                    // {"name":"pointy","eso_100":28.999999999999996,"etox":-9,"etoy":53,"eb_100":0,"ebr_100":0,"esc_100":10,"etc_100":10,"eec_100":10,"eitc_100":10,"esi_100":30,"eti_100":76,"eei_100":10,"eito_100":95}
                    // [29,-9,53,0,0,10,10,10,10,30,76,10,95]
                    // [29,32,53,0,50,14,10,34,44,30,76,10,125]
                    data := 0x1d203500320e0a222c1e4c0a7d
                }
                
                case 4 { 
                    // ear: teeny
                    // {"name":"teeny","eso_100":30,"etox":-19,"etoy":50,"eb_100":10,"ebr_100":2,"esc_100":9,"etc_100":11,"eec_100":26,"eitc_100":21,"esi_100":30,"eti_100":73,"eei_100":10,"eito_100":119}
                    // [30,-19,50,10,2,9,11,26,21,30,73,10,119]
                    // [30,22,50,10,52,13,11,50,55,30,73,10,131]
                    data := 0x1e16320a340d0b32371e490a83
                }
                
                case 5 { 
                    // ear: curved
                    // {"name":"curved","eso_100":28.000000000000004,"etox":-4,"etoy":50,"eb_100":17,"ebr_100":0,"esc_100":25,"etc_100":28.999999999999996,"eec_100":4,"eitc_100":37,"esi_100":30,"eti_100":80,"eei_100":10,"eito_100":0}
                    // [28,-4,50,17,0,25,29,4,37,30,80,10,0]
                    // [28,37,50,17,50,29,29,28,71,30,80,10,101]
                    data := 0x1c253211321d1d1c471e500a65
                }
                
                case 6 { 
                    // ear: slanted
                    // {"name":"slanted","eso_100":25,"etox":10,"etoy":39,"eb_100":0,"ebr_100":0,"esc_100":10,"etc_100":10,"eec_100":10,"eitc_100":10,"esi_100":52,"eti_100":81,"eei_100":6,"eito_100":0}
                    // [25,10,39,0,0,10,10,10,10,52,81,6,0]
                    // [25,51,39,0,50,14,10,34,44,52,81,6,101]
                    data := 0x19332700320e0a222c34510665
                }
                
                case 7 { 
                    // ear: folded
                    // {"name":"folded","eso_100":25,"etox":10,"etoy":70,"eb_100":62,"ebr_100":74,"esc_100":18,"etc_100":3,"eec_100":30,"eitc_100":-34,"esi_100":20,"eti_100":63,"eei_100":6,"eito_100":-405}
                    // [25,10,70,62,74,18,3,30,-34,20,63,6,-405]
                    // [25,51,70,62,124,22,3,54,0,20,63,6,0]
                    data := 0x1933463e7c16033600143f0600
                }
                
                case 8 { 
                    // ear: floppy
                    // {"name":"floppy","eso_100":25,"etox":16,"etoy":51,"eb_100":50,"ebr_100":12,"esc_100":19,"etc_100":24,"eec_100":-24,"eitc_100":24,"esi_100":44,"eti_100":63,"eei_100":12,"eito_100":-357}
                    // [25,16,51,50,12,19,24,-24,24,44,63,12,-357]
                    // [25,57,51,50,62,23,24,0,58,44,63,12,12]
                    data := 0x193933323e1718003a2c3f0c0c
                }
                
                case 9 { 
                    // ear: sideways
                    // {"name":"sideways","eso_100":25,"etox":-1,"etoy":51,"eb_100":0,"ebr_100":-50,"esc_100":9,"etc_100":10,"eec_100":10,"eitc_100":10,"esi_100":64,"eti_100":76,"eei_100":6,"eito_100":-24}
                    // [25,-1,51,0,-50,9,10,10,10,64,76,6,-24]
                    // [25,40,51,0,0,13,10,34,44,64,76,6,95]
                    data := 0x19283300000d0a222c404c065f
                }
                
                case 10 { 
                    // ear: perky
                    // {"name":"perky","eso_100":27,"etox":-1,"etoy":58,"eb_100":5,"ebr_100":0,"esc_100":1,"etc_100":26,"eec_100":13,"eitc_100":53,"esi_100":35,"eti_100":80,"eei_100":10,"eito_100":0}
                    // [27,-1,58,5,0,1,26,13,53,35,80,10,0]
                    // [27,40,58,5,50,5,26,37,87,35,80,10,101]
                    data := 0x1b283a0532051a255723500a65
                }
                
                case 11 { 
                    // ear: sphynx
                    // {"name":"sphynx","eso_100":25,"etox":1,"etoy":84,"eb_100":14.000000000000002,"ebr_100":95,"esc_100":14.000000000000002,"etc_100":36,"eec_100":30,"eitc_100":33,"esi_100":18,"eti_100":80,"eei_100":13,"eito_100":-119}
                    // [25,1,84,14,95,14,36,30,33,18,80,13,-119]
                    // [25,42,84,14,145,18,36,54,67,18,80,13,72]
                    data := 0x192a540e911224364312500d48
                }
                
                case 12 { 
                    // ear: wide
                    // {"name":"wide","eso_100":25,"etox":-16,"etoy":80,"eb_100":10,"ebr_100":2,"esc_100":4,"etc_100":47,"eec_100":8,"eitc_100":49,"esi_100":30,"eti_100":80,"eei_100":10,"eito_100":0}
                    // [25,-16,80,10,2,4,47,8,49,30,80,10,0]
                    // [25,25,80,10,52,8,47,32,83,30,80,10,101]
                    data := 0x1919500a34082f20531e500a65
                }
                
                case 13 { 
                    // ear: round
                    // {"name":"round","eso_100":25,"etox":-4,"etoy":55,"eb_100":37,"ebr_100":-5,"esc_100":10,"etc_100":46,"eec_100":30,"eitc_100":43,"esi_100":26,"eti_100":84,"eei_100":6,"eito_100":143}
                    // [25,-4,55,37,-5,10,46,30,43,26,84,6,143]
                    // [25,37,55,37,45,14,46,54,77,26,84,6,137]
                    data := 0x192537252d0e2e364d1a540689
                }
                
            }

            // ear - Get Data
            
            function getFieldValue_ear_eso_100(earData) -> value {                
                // [0] 27 = 27 * 1 - 0                
                // [1] 29 = 29 * 1 - 0                
                // [2] 23 = 23 * 1 - 0                
                // [3] 29 = 29 * 1 - 0                
                // [4] 30 = 30 * 1 - 0                
                // [5] 28 = 28 * 1 - 0                
                // [6] 25 = 25 * 1 - 0                
                // [7] 25 = 25 * 1 - 0                
                // [8] 25 = 25 * 1 - 0                
                // [9] 25 = 25 * 1 - 0                
                // [10] 27 = 27 * 1 - 0                
                // [11] 25 = 25 * 1 - 0                
                // [12] 25 = 25 * 1 - 0                
                // [13] 25 = 25 * 1 - 0
                value := and(0xff, shr(0x00, earData))
            }
            
            function getFieldValue_ear_etox(earData) -> value {                
                // [0] -1 = 40 * 1 - 41                
                // [1] -21 = 20 * 1 - 41                
                // [2] -41 = 0 * 1 - 41                
                // [3] -9 = 32 * 1 - 41                
                // [4] -19 = 22 * 1 - 41                
                // [5] -4 = 37 * 1 - 41                
                // [6] 10 = 51 * 1 - 41                
                // [7] 10 = 51 * 1 - 41                
                // [8] 16 = 57 * 1 - 41                
                // [9] -1 = 40 * 1 - 41                
                // [10] -1 = 40 * 1 - 41                
                // [11] 1 = 42 * 1 - 41                
                // [12] -16 = 25 * 1 - 41                
                // [13] -4 = 37 * 1 - 41
                value := and(0xff, shr(0x08, earData))
                value := sub(value, 41)
            }
            
            function getFieldValue_ear_etoy(earData) -> value {                
                // [0] 52 = 52 * 1 - 0                
                // [1] 70 = 70 * 1 - 0                
                // [2] 69 = 69 * 1 - 0                
                // [3] 53 = 53 * 1 - 0                
                // [4] 50 = 50 * 1 - 0                
                // [5] 50 = 50 * 1 - 0                
                // [6] 39 = 39 * 1 - 0                
                // [7] 70 = 70 * 1 - 0                
                // [8] 51 = 51 * 1 - 0                
                // [9] 51 = 51 * 1 - 0                
                // [10] 58 = 58 * 1 - 0                
                // [11] 84 = 84 * 1 - 0                
                // [12] 80 = 80 * 1 - 0                
                // [13] 55 = 55 * 1 - 0
                value := and(0xff, shr(0x10, earData))
            }
            
            function getFieldValue_ear_eb_100(earData) -> value {                
                // [0] 7 = 7 * 1 - 0                
                // [1] 20 = 20 * 1 - 0                
                // [2] 17 = 17 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 10 = 10 * 1 - 0                
                // [5] 17 = 17 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 62 = 62 * 1 - 0                
                // [8] 50 = 50 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 5 = 5 * 1 - 0                
                // [11] 14 = 14 * 1 - 0                
                // [12] 10 = 10 * 1 - 0                
                // [13] 37 = 37 * 1 - 0
                value := and(0xff, shr(0x18, earData))
            }
            
            function getFieldValue_ear_ebr_100(earData) -> value {                
                // [0] 0 = 50 * 1 - 50                
                // [1] 0 = 50 * 1 - 50                
                // [2] 0 = 50 * 1 - 50                
                // [3] 0 = 50 * 1 - 50                
                // [4] 2 = 52 * 1 - 50                
                // [5] 0 = 50 * 1 - 50                
                // [6] 0 = 50 * 1 - 50                
                // [7] 74 = 124 * 1 - 50                
                // [8] 12 = 62 * 1 - 50                
                // [9] -50 = 0 * 1 - 50                
                // [10] 0 = 50 * 1 - 50                
                // [11] 95 = 145 * 1 - 50                
                // [12] 2 = 52 * 1 - 50                
                // [13] -5 = 45 * 1 - 50
                value := and(0xff, shr(0x20, earData))
                value := sub(value, 50)
            }
            
            function getFieldValue_ear_esc_100(earData) -> value {                
                // [0] 19 = 23 * 1 - 4                
                // [1] -4 = 0 * 1 - 4                
                // [2] -3 = 1 * 1 - 4                
                // [3] 10 = 14 * 1 - 4                
                // [4] 9 = 13 * 1 - 4                
                // [5] 25 = 29 * 1 - 4                
                // [6] 10 = 14 * 1 - 4                
                // [7] 18 = 22 * 1 - 4                
                // [8] 19 = 23 * 1 - 4                
                // [9] 9 = 13 * 1 - 4                
                // [10] 1 = 5 * 1 - 4                
                // [11] 14 = 18 * 1 - 4                
                // [12] 4 = 8 * 1 - 4                
                // [13] 10 = 14 * 1 - 4
                value := and(0xff, shr(0x28, earData))
                value := sub(value, 4)
            }
            
            function getFieldValue_ear_etc_100(earData) -> value {                
                // [0] 49 = 49 * 1 - 0                
                // [1] 16 = 16 * 1 - 0                
                // [2] 17 = 17 * 1 - 0                
                // [3] 10 = 10 * 1 - 0                
                // [4] 11 = 11 * 1 - 0                
                // [5] 29 = 29 * 1 - 0                
                // [6] 10 = 10 * 1 - 0                
                // [7] 3 = 3 * 1 - 0                
                // [8] 24 = 24 * 1 - 0                
                // [9] 10 = 10 * 1 - 0                
                // [10] 26 = 26 * 1 - 0                
                // [11] 36 = 36 * 1 - 0                
                // [12] 47 = 47 * 1 - 0                
                // [13] 46 = 46 * 1 - 0
                value := and(0xff, shr(0x30, earData))
            }
            
            function getFieldValue_ear_eec_100(earData) -> value {                
                // [0] 13 = 37 * 1 - 24                
                // [1] 22 = 46 * 1 - 24                
                // [2] 20 = 44 * 1 - 24                
                // [3] 10 = 34 * 1 - 24                
                // [4] 26 = 50 * 1 - 24                
                // [5] 4 = 28 * 1 - 24                
                // [6] 10 = 34 * 1 - 24                
                // [7] 30 = 54 * 1 - 24                
                // [8] -24 = 0 * 1 - 24                
                // [9] 10 = 34 * 1 - 24                
                // [10] 13 = 37 * 1 - 24                
                // [11] 30 = 54 * 1 - 24                
                // [12] 8 = 32 * 1 - 24                
                // [13] 30 = 54 * 1 - 24
                value := and(0xff, shr(0x38, earData))
                value := sub(value, 24)
            }
            
            function getFieldValue_ear_eitc_100(earData) -> value {                
                // [0] 53 = 87 * 1 - 34                
                // [1] 16 = 50 * 1 - 34                
                // [2] 23 = 57 * 1 - 34                
                // [3] 10 = 44 * 1 - 34                
                // [4] 21 = 55 * 1 - 34                
                // [5] 37 = 71 * 1 - 34                
                // [6] 10 = 44 * 1 - 34                
                // [7] -34 = 0 * 1 - 34                
                // [8] 24 = 58 * 1 - 34                
                // [9] 10 = 44 * 1 - 34                
                // [10] 53 = 87 * 1 - 34                
                // [11] 33 = 67 * 1 - 34                
                // [12] 49 = 83 * 1 - 34                
                // [13] 43 = 77 * 1 - 34
                value := and(0xff, shr(0x40, earData))
                value := sub(value, 34)
            }
            
            function getFieldValue_ear_esi_100(earData) -> value {                
                // [0] 25 = 25 * 1 - 0                
                // [1] 30 = 30 * 1 - 0                
                // [2] 30 = 30 * 1 - 0                
                // [3] 30 = 30 * 1 - 0                
                // [4] 30 = 30 * 1 - 0                
                // [5] 30 = 30 * 1 - 0                
                // [6] 52 = 52 * 1 - 0                
                // [7] 20 = 20 * 1 - 0                
                // [8] 44 = 44 * 1 - 0                
                // [9] 64 = 64 * 1 - 0                
                // [10] 35 = 35 * 1 - 0                
                // [11] 18 = 18 * 1 - 0                
                // [12] 30 = 30 * 1 - 0                
                // [13] 26 = 26 * 1 - 0
                value := and(0xff, shr(0x48, earData))
            }
            
            function getFieldValue_ear_eti_100(earData) -> value {                
                // [0] 80 = 80 * 1 - 0                
                // [1] 80 = 80 * 1 - 0                
                // [2] 77 = 77 * 1 - 0                
                // [3] 76 = 76 * 1 - 0                
                // [4] 73 = 73 * 1 - 0                
                // [5] 80 = 80 * 1 - 0                
                // [6] 81 = 81 * 1 - 0                
                // [7] 63 = 63 * 1 - 0                
                // [8] 63 = 63 * 1 - 0                
                // [9] 76 = 76 * 1 - 0                
                // [10] 80 = 80 * 1 - 0                
                // [11] 80 = 80 * 1 - 0                
                // [12] 80 = 80 * 1 - 0                
                // [13] 84 = 84 * 1 - 0
                value := and(0xff, shr(0x50, earData))
            }
            
            function getFieldValue_ear_eei_100(earData) -> value {                
                // [0] 10 = 10 * 1 - 0                
                // [1] 10 = 10 * 1 - 0                
                // [2] 13 = 13 * 1 - 0                
                // [3] 10 = 10 * 1 - 0                
                // [4] 10 = 10 * 1 - 0                
                // [5] 10 = 10 * 1 - 0                
                // [6] 6 = 6 * 1 - 0                
                // [7] 6 = 6 * 1 - 0                
                // [8] 12 = 12 * 1 - 0                
                // [9] 6 = 6 * 1 - 0                
                // [10] 10 = 10 * 1 - 0                
                // [11] 13 = 13 * 1 - 0                
                // [12] 10 = 10 * 1 - 0                
                // [13] 6 = 6 * 1 - 0
                value := and(0xff, shr(0x58, earData))
            }
            
            function getFieldValue_ear_eito_100(earData) -> value {                
                // [0] 0 = 101 * 4 - 405                
                // [1] 0 = 101 * 4 - 405                
                // [2] 0 = 101 * 4 - 405                
                // [3] 95 = 125 * 4 - 405                
                // [4] 119 = 131 * 4 - 405                
                // [5] 0 = 101 * 4 - 405                
                // [6] 0 = 101 * 4 - 405                
                // [7] -405 = 0 * 4 - 405                
                // [8] -357 = 12 * 4 - 405                
                // [9] -24 = 95 * 4 - 405                
                // [10] 0 = 101 * 4 - 405                
                // [11] -119 = 72 * 4 - 405                
                // [12] 0 = 101 * 4 - 405                
                // [13] 143 = 137 * 4 - 405
                value := and(0xff, shr(0x60, earData))
                value := mul(value, 4)
                value := sub(value, 405)
            }
            

            

        
            // eye - Select Data

            function selectData_eye(rvs, breedData) -> data {
                data := 0

                
                let rvs_eye          := getRvsValue(rvs, 0x30)
                switch mod(14, rvs_eye)
                

                // offset:   [0,0,0,3,0,64,8,8,13]
                // scale:    [1,1,1,1,1,1,1,1,1]
                // decimal:  [1,1,1,1,1,1,1,1,1]

                
                case 0 { 
                    // eye: round
                    // {"name":"round","eyox":40,"eyoy":4,"eyw":20,"eyt":18,"eyb":18,"eyr_100":-4,"eypox":-4,"eypoy":0,"no":-3}
                    // [40,4,20,18,18,-4,-4,0,-3]
                    // [40,4,20,21,18,60,4,8,10]
                    data := 0x28041415123c04080a
                }
                
                case 1 { 
                    // eye: fierce
                    // {"name":"fierce","eyox":40,"eyoy":5,"eyw":21,"eyt":12,"eyb":18,"eyr_100":-44,"eypox":-4,"eypoy":0,"no":-1}
                    // [40,5,21,12,18,-44,-4,0,-1]
                    // [40,5,21,15,18,20,4,8,12]
                    data := 0x2805150f121404080c
                }
                
                case 2 { 
                    // eye: squinting
                    // {"name":"squinting","eyox":40,"eyoy":5,"eyw":20,"eyt":15,"eyb":7,"eyr_100":-24,"eypox":-3,"eypoy":0,"no":-7}
                    // [40,5,20,15,7,-24,-3,0,-7]
                    // [40,5,20,18,7,40,5,8,6]
                    data := 0x280514120728050806
                }
                
                case 3 { 
                    // eye: sullen
                    // {"name":"sullen","eyox":38,"eyoy":1,"eyw":21,"eyt":2,"eyb":17,"eyr_100":36,"eypox":-3,"eypoy":5,"no":-5}
                    // [38,1,21,2,17,36,-3,5,-5]
                    // [38,1,21,5,17,100,5,13,8]
                    data := 0x260115051164050d08
                }
                
                case 4 { 
                    // eye: meek
                    // {"name":"meek","eyox":40,"eyoy":5,"eyw":21,"eyt":13,"eyb":18,"eyr_100":26,"eypox":-4,"eypoy":0,"no":-4}
                    // [40,5,21,13,18,26,-4,0,-4]
                    // [40,5,21,16,18,90,4,8,9]
                    data := 0x28051510125a040809
                }
                
                case 5 { 
                    // eye: stern
                    // {"name":"stern","eyox":37,"eyoy":8,"eyw":20,"eyt":7,"eyb":18,"eyr_100":-64,"eypox":-2,"eypoy":0,"no":4}
                    // [37,8,20,7,18,-64,-2,0,4]
                    // [37,8,20,10,18,0,6,8,17]
                    data := 0x2508140a1200060811
                }
                
                case 6 { 
                    // eye: mean
                    // {"name":"mean","eyox":37,"eyoy":4,"eyw":20,"eyt":-1,"eyb":17,"eyr_100":-14.000000000000002,"eypox":-2,"eypoy":2,"no":-2}
                    // [37,4,20,-1,17,-14,-2,2,-2]
                    // [37,4,20,2,17,50,6,10,11]
                    data := 0x250414021132060a0b
                }
                
                case 7 { 
                    // eye: droopy
                    // {"name":"droopy","eyox":40,"eyoy":2,"eyw":20,"eyt":-3,"eyb":22,"eyr_100":26,"eypox":-4,"eypoy":5,"no":-1}
                    // [40,2,20,-3,22,26,-4,5,-1]
                    // [40,2,20,0,22,90,4,13,12]
                    data := 0x28021400165a040d0c
                }
                
                case 8 { 
                    // eye: cross
                    // {"name":"cross","eyox":40,"eyoy":3,"eyw":19,"eyt":14,"eyb":16,"eyr_100":-24,"eypox":-8,"eypoy":0,"no":-4}
                    // [40,3,19,14,16,-24,-8,0,-4]
                    // [40,3,19,17,16,40,0,8,9]
                    data := 0x280313111028000809
                }
                
                case 9 { 
                    // eye: almond
                    // {"name":"almond","eyox":40,"eyoy":5,"eyw":19,"eyt":13,"eyb":14,"eyr_100":-4,"eypox":-4,"eypoy":0,"no":-4}
                    // [40,5,19,13,14,-4,-4,0,-4]
                    // [40,5,19,16,14,60,4,8,9]
                    data := 0x280513100e3c040809
                }
                
                case 10 { 
                    // eye: doe
                    // {"name":"doe","eyox":40,"eyoy":4,"eyw":21,"eyt":12,"eyb":18,"eyr_100":-14.000000000000002,"eypox":-4,"eypoy":0,"no":-1}
                    // [40,4,21,12,18,-14,-4,0,-1]
                    // [40,4,21,15,18,50,4,8,12]
                    data := 0x2804150f123204080c
                }
                
                case 11 { 
                    // eye: glaring
                    // {"name":"glaring","eyox":40,"eyoy":2,"eyw":21,"eyt":19,"eyb":2,"eyr_100":-14.000000000000002,"eypox":-4,"eypoy":1,"no":-13}
                    // [40,2,21,19,2,-14,-4,1,-13]
                    // [40,2,21,22,2,50,4,9,0]
                    data := 0x280215160232040900
                }
                
                case 12 { 
                    // eye: sleepy
                    // {"name":"sleepy","eyox":40,"eyoy":8,"eyw":20,"eyt":12,"eyb":3,"eyr_100":6,"eypox":-4,"eypoy":-3,"no":-7}
                    // [40,8,20,12,3,6,-4,-3,-7]
                    // [40,8,20,15,3,70,4,5,6]
                    data := 0x2808140f0346040506
                }
                
                case 13 { 
                    // eye: pleading
                    // {"name":"pleading","eyox":40,"eyoy":11,"eyw":22,"eyt":14,"eyb":15,"eyr_100":36,"eypox":-7,"eypoy":-8,"no":-1}
                    // [40,11,22,14,15,36,-7,-8,-1]
                    // [40,11,22,17,15,100,1,0,12]
                    data := 0x280b16110f6401000c
                }
                
            }

            // eye - Get Data
            
            function getFieldValue_eye_eyox(eyeData) -> value {                
                // [0] 40 = 40 * 1 - 0                
                // [1] 40 = 40 * 1 - 0                
                // [2] 40 = 40 * 1 - 0                
                // [3] 38 = 38 * 1 - 0                
                // [4] 40 = 40 * 1 - 0                
                // [5] 37 = 37 * 1 - 0                
                // [6] 37 = 37 * 1 - 0                
                // [7] 40 = 40 * 1 - 0                
                // [8] 40 = 40 * 1 - 0                
                // [9] 40 = 40 * 1 - 0                
                // [10] 40 = 40 * 1 - 0                
                // [11] 40 = 40 * 1 - 0                
                // [12] 40 = 40 * 1 - 0                
                // [13] 40 = 40 * 1 - 0
                value := and(0xff, shr(0x00, eyeData))
            }
            
            function getFieldValue_eye_eyoy(eyeData) -> value {                
                // [0] 4 = 4 * 1 - 0                
                // [1] 5 = 5 * 1 - 0                
                // [2] 5 = 5 * 1 - 0                
                // [3] 1 = 1 * 1 - 0                
                // [4] 5 = 5 * 1 - 0                
                // [5] 8 = 8 * 1 - 0                
                // [6] 4 = 4 * 1 - 0                
                // [7] 2 = 2 * 1 - 0                
                // [8] 3 = 3 * 1 - 0                
                // [9] 5 = 5 * 1 - 0                
                // [10] 4 = 4 * 1 - 0                
                // [11] 2 = 2 * 1 - 0                
                // [12] 8 = 8 * 1 - 0                
                // [13] 11 = 11 * 1 - 0
                value := and(0xff, shr(0x08, eyeData))
            }
            
            function getFieldValue_eye_eyw(eyeData) -> value {                
                // [0] 20 = 20 * 1 - 0                
                // [1] 21 = 21 * 1 - 0                
                // [2] 20 = 20 * 1 - 0                
                // [3] 21 = 21 * 1 - 0                
                // [4] 21 = 21 * 1 - 0                
                // [5] 20 = 20 * 1 - 0                
                // [6] 20 = 20 * 1 - 0                
                // [7] 20 = 20 * 1 - 0                
                // [8] 19 = 19 * 1 - 0                
                // [9] 19 = 19 * 1 - 0                
                // [10] 21 = 21 * 1 - 0                
                // [11] 21 = 21 * 1 - 0                
                // [12] 20 = 20 * 1 - 0                
                // [13] 22 = 22 * 1 - 0
                value := and(0xff, shr(0x10, eyeData))
            }
            
            function getFieldValue_eye_eyt(eyeData) -> value {                
                // [0] 18 = 21 * 1 - 3                
                // [1] 12 = 15 * 1 - 3                
                // [2] 15 = 18 * 1 - 3                
                // [3] 2 = 5 * 1 - 3                
                // [4] 13 = 16 * 1 - 3                
                // [5] 7 = 10 * 1 - 3                
                // [6] -1 = 2 * 1 - 3                
                // [7] -3 = 0 * 1 - 3                
                // [8] 14 = 17 * 1 - 3                
                // [9] 13 = 16 * 1 - 3                
                // [10] 12 = 15 * 1 - 3                
                // [11] 19 = 22 * 1 - 3                
                // [12] 12 = 15 * 1 - 3                
                // [13] 14 = 17 * 1 - 3
                value := and(0xff, shr(0x18, eyeData))
                value := sub(value, 3)
            }
            
            function getFieldValue_eye_eyb(eyeData) -> value {                
                // [0] 18 = 18 * 1 - 0                
                // [1] 18 = 18 * 1 - 0                
                // [2] 7 = 7 * 1 - 0                
                // [3] 17 = 17 * 1 - 0                
                // [4] 18 = 18 * 1 - 0                
                // [5] 18 = 18 * 1 - 0                
                // [6] 17 = 17 * 1 - 0                
                // [7] 22 = 22 * 1 - 0                
                // [8] 16 = 16 * 1 - 0                
                // [9] 14 = 14 * 1 - 0                
                // [10] 18 = 18 * 1 - 0                
                // [11] 2 = 2 * 1 - 0                
                // [12] 3 = 3 * 1 - 0                
                // [13] 15 = 15 * 1 - 0
                value := and(0xff, shr(0x20, eyeData))
            }
            
            function getFieldValue_eye_eyr_100(eyeData) -> value {                
                // [0] -4 = 60 * 1 - 64                
                // [1] -44 = 20 * 1 - 64                
                // [2] -24 = 40 * 1 - 64                
                // [3] 36 = 100 * 1 - 64                
                // [4] 26 = 90 * 1 - 64                
                // [5] -64 = 0 * 1 - 64                
                // [6] -14 = 50 * 1 - 64                
                // [7] 26 = 90 * 1 - 64                
                // [8] -24 = 40 * 1 - 64                
                // [9] -4 = 60 * 1 - 64                
                // [10] -14 = 50 * 1 - 64                
                // [11] -14 = 50 * 1 - 64                
                // [12] 6 = 70 * 1 - 64                
                // [13] 36 = 100 * 1 - 64
                value := and(0xff, shr(0x28, eyeData))
                value := sub(value, 64)
            }
            
            function getFieldValue_eye_eypox(eyeData) -> value {                
                // [0] -4 = 4 * 1 - 8                
                // [1] -4 = 4 * 1 - 8                
                // [2] -3 = 5 * 1 - 8                
                // [3] -3 = 5 * 1 - 8                
                // [4] -4 = 4 * 1 - 8                
                // [5] -2 = 6 * 1 - 8                
                // [6] -2 = 6 * 1 - 8                
                // [7] -4 = 4 * 1 - 8                
                // [8] -8 = 0 * 1 - 8                
                // [9] -4 = 4 * 1 - 8                
                // [10] -4 = 4 * 1 - 8                
                // [11] -4 = 4 * 1 - 8                
                // [12] -4 = 4 * 1 - 8                
                // [13] -7 = 1 * 1 - 8
                value := and(0xff, shr(0x30, eyeData))
                value := sub(value, 8)
            }
            
            function getFieldValue_eye_eypoy(eyeData) -> value {                
                // [0] 0 = 8 * 1 - 8                
                // [1] 0 = 8 * 1 - 8                
                // [2] 0 = 8 * 1 - 8                
                // [3] 5 = 13 * 1 - 8                
                // [4] 0 = 8 * 1 - 8                
                // [5] 0 = 8 * 1 - 8                
                // [6] 2 = 10 * 1 - 8                
                // [7] 5 = 13 * 1 - 8                
                // [8] 0 = 8 * 1 - 8                
                // [9] 0 = 8 * 1 - 8                
                // [10] 0 = 8 * 1 - 8                
                // [11] 1 = 9 * 1 - 8                
                // [12] -3 = 5 * 1 - 8                
                // [13] -8 = 0 * 1 - 8
                value := and(0xff, shr(0x38, eyeData))
                value := sub(value, 8)
            }
            
            function getFieldValue_eye_no(eyeData) -> value {                
                // [0] -3 = 10 * 1 - 13                
                // [1] -1 = 12 * 1 - 13                
                // [2] -7 = 6 * 1 - 13                
                // [3] -5 = 8 * 1 - 13                
                // [4] -4 = 9 * 1 - 13                
                // [5] 4 = 17 * 1 - 13                
                // [6] -2 = 11 * 1 - 13                
                // [7] -1 = 12 * 1 - 13                
                // [8] -4 = 9 * 1 - 13                
                // [9] -4 = 9 * 1 - 13                
                // [10] -1 = 12 * 1 - 13                
                // [11] -13 = 0 * 1 - 13                
                // [12] -7 = 6 * 1 - 13                
                // [13] -1 = 12 * 1 - 13
                value := and(0xff, shr(0x40, eyeData))
                value := sub(value, 13)
            }
            

            

        
            // pupil - Select Data

            function selectData_pupil(rvs, breedData) -> data {
                data := 0

                
                let rvs_pupil        := getRvsValue(rvs, 0x38)
                switch mod(6, rvs_pupil)
                

                // offset:   [0,0]
                // scale:    [1,1]
                // decimal:  [1,1]

                
                case 0 { 
                    // pupil: thin
                    // {"name":"thin","eypw":12,"eyph":30}
                    // [12,30]
                    // [12,30]
                    data := 0x0c1e
                }
                
                case 1 { 
                    // pupil: big
                    // {"name":"big","eypw":21,"eyph":28}
                    // [21,28]
                    // [21,28]
                    data := 0x151c
                }
                
                case 2 { 
                    // pupil: huge
                    // {"name":"huge","eypw":29,"eyph":30}
                    // [29,30]
                    // [29,30]
                    data := 0x1d1e
                }
                
                case 3 { 
                    // pupil: normal
                    // {"name":"normal","eypw":15,"eyph":22}
                    // [15,22]
                    // [15,22]
                    data := 0x0f16
                }
                
                case 4 { 
                    // pupil: small
                    // {"name":"small","eypw":13,"eyph":13}
                    // [13,13]
                    // [13,13]
                    data := 0x0d0d
                }
                
                case 5 { 
                    // pupil: thinnest
                    // {"name":"thinnest","eypw":7,"eyph":30}
                    // [7,30]
                    // [7,30]
                    data := 0x071e
                }
                
            }

            // pupil - Get Data
            
            function getFieldValue_pupil_eypw(pupilData) -> value {                
                // [0] 12 = 12 * 1 - 0                
                // [1] 21 = 21 * 1 - 0                
                // [2] 29 = 29 * 1 - 0                
                // [3] 15 = 15 * 1 - 0                
                // [4] 13 = 13 * 1 - 0                
                // [5] 7 = 7 * 1 - 0
                value := and(0xff, shr(0x00, pupilData))
            }
            
            function getFieldValue_pupil_eyph(pupilData) -> value {                
                // [0] 30 = 30 * 1 - 0                
                // [1] 28 = 28 * 1 - 0                
                // [2] 30 = 30 * 1 - 0                
                // [3] 22 = 22 * 1 - 0                
                // [4] 13 = 13 * 1 - 0                
                // [5] 30 = 30 * 1 - 0
                value := and(0xff, shr(0x08, pupilData))
            }
            

            

        
            // mouth - Select Data

            function selectData_mouth(rvs, breedData) -> data {
                data := 0

                
                let rvs_mouth        := getRvsValue(rvs, 0x40)
                switch mod(9, rvs_mouth)
                

                // offset:   [0,0,2,17,50,0]
                // scale:    [1,1,1,1,4,1]
                // decimal:  [1,1,1,1,1,1]

                
                case 0 { 
                    // mouth: neutral
                    // {"name":"neutral","mh":11,"mox":10,"moy":6,"mc_100":50,"tngo_100":500,"tng":true}
                    // [11,10,6,50,500,1]
                    // [11,10,8,67,138,1]
                    data := 0x0b0a08438a01
                }
                
                case 1 { 
                    // mouth: pursed
                    // {"name":"pursed","mh":8,"mox":5,"moy":8,"mc_100":50,"tngo_100":800,"tng":false}
                    // [8,5,8,50,800,0]
                    // [8,5,10,67,213,0]
                    data := 0x08050a43d500
                }
                
                case 2 { 
                    // mouth: pleased
                    // {"name":"pleased","mh":12,"mox":15,"moy":4,"mc_100":50,"tngo_100":340,"tng":true}
                    // [12,15,4,50,340,1]
                    // [12,15,6,67,98,1]
                    data := 0x0c0f06436201
                }
                
                case 3 { 
                    // mouth: pouting
                    // {"name":"pouting","mh":11,"mox":5,"moy":12,"mc_100":5,"tngo_100":800,"tng":false}
                    // [11,5,12,5,800,0]
                    // [11,5,14,22,213,0]
                    data := 0x0b050e16d500
                }
                
                case 4 { 
                    // mouth: drooping
                    // {"name":"drooping","mh":12,"mox":10,"moy":12,"mc_100":-17,"tngo_100":430,"tng":false}
                    // [12,10,12,-17,430,0]
                    // [12,10,14,0,120,0]
                    data := 0x0c0a0e007800
                }
                
                case 5 { 
                    // mouth: displeased
                    // {"name":"displeased","mh":13,"mox":11,"moy":6,"mc_100":-14.000000000000002,"tngo_100":120,"tng":true}
                    // [13,11,6,-14,120,1]
                    // [13,11,8,3,43,1]
                    data := 0x0d0b08032b01
                }
                
                case 6 { 
                    // mouth: impartial
                    // {"name":"impartial","mh":10,"mox":10,"moy":13,"mc_100":21,"tngo_100":800,"tng":false}
                    // [10,10,13,21,800,0]
                    // [10,10,15,38,213,0]
                    data := 0x0a0a0f26d500
                }
                
                case 7 { 
                    // mouth: dull
                    // {"name":"dull","mh":13,"mox":8,"moy":1,"mc_100":2,"tngo_100":-50,"tng":true}
                    // [13,8,1,2,-50,1]
                    // [13,8,3,19,0,1]
                    data := 0x0d0803130001
                }
                
                case 8 { 
                    // mouth: smiling
                    // {"name":"smiling","mh":13,"mox":14,"moy":-2,"mc_100":71,"tngo_100":150,"tng":true}
                    // [13,14,-2,71,150,1]
                    // [13,14,0,88,50,1]
                    data := 0x0d0e00583201
                }
                
            }

            // mouth - Get Data
            
            function getFieldValue_mouth_mh(mouthData) -> value {                
                // [0] 11 = 11 * 1 - 0                
                // [1] 8 = 8 * 1 - 0                
                // [2] 12 = 12 * 1 - 0                
                // [3] 11 = 11 * 1 - 0                
                // [4] 12 = 12 * 1 - 0                
                // [5] 13 = 13 * 1 - 0                
                // [6] 10 = 10 * 1 - 0                
                // [7] 13 = 13 * 1 - 0                
                // [8] 13 = 13 * 1 - 0
                value := and(0xff, shr(0x00, mouthData))
            }
            
            function getFieldValue_mouth_mox(mouthData) -> value {                
                // [0] 10 = 10 * 1 - 0                
                // [1] 5 = 5 * 1 - 0                
                // [2] 15 = 15 * 1 - 0                
                // [3] 5 = 5 * 1 - 0                
                // [4] 10 = 10 * 1 - 0                
                // [5] 11 = 11 * 1 - 0                
                // [6] 10 = 10 * 1 - 0                
                // [7] 8 = 8 * 1 - 0                
                // [8] 14 = 14 * 1 - 0
                value := and(0xff, shr(0x08, mouthData))
            }
            
            function getFieldValue_mouth_moy(mouthData) -> value {                
                // [0] 6 = 8 * 1 - 2                
                // [1] 8 = 10 * 1 - 2                
                // [2] 4 = 6 * 1 - 2                
                // [3] 12 = 14 * 1 - 2                
                // [4] 12 = 14 * 1 - 2                
                // [5] 6 = 8 * 1 - 2                
                // [6] 13 = 15 * 1 - 2                
                // [7] 1 = 3 * 1 - 2                
                // [8] -2 = 0 * 1 - 2
                value := and(0xff, shr(0x10, mouthData))
                value := sub(value, 2)
            }
            
            function getFieldValue_mouth_mc_100(mouthData) -> value {                
                // [0] 50 = 67 * 1 - 17                
                // [1] 50 = 67 * 1 - 17                
                // [2] 50 = 67 * 1 - 17                
                // [3] 5 = 22 * 1 - 17                
                // [4] -17 = 0 * 1 - 17                
                // [5] -14 = 3 * 1 - 17                
                // [6] 21 = 38 * 1 - 17                
                // [7] 2 = 19 * 1 - 17                
                // [8] 71 = 88 * 1 - 17
                value := and(0xff, shr(0x18, mouthData))
                value := sub(value, 17)
            }
            
            function getFieldValue_mouth_tngo_100(mouthData) -> value {                
                // [0] 500 = 138 * 4 - 50                
                // [1] 800 = 213 * 4 - 50                
                // [2] 340 = 98 * 4 - 50                
                // [3] 800 = 213 * 4 - 50                
                // [4] 430 = 120 * 4 - 50                
                // [5] 120 = 43 * 4 - 50                
                // [6] 800 = 213 * 4 - 50                
                // [7] -50 = 0 * 4 - 50                
                // [8] 150 = 50 * 4 - 50
                value := and(0xff, shr(0x20, mouthData))
                value := mul(value, 4)
                value := sub(value, 50)
            }
            
            function getFieldValue_mouth_tng(mouthData) -> value {                
                // [0] 1 = 1 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 1 = 1 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 1 = 1 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 1 = 1 * 1 - 0                
                // [8] 1 = 1 * 1 - 0
                value := and(0xff, shr(0x28, mouthData))
            }
            

            

        
            // whisker - Select Data

            function selectData_whisker(rvs, breedData) -> data {
                data := 0

                
                let rvs_whisker      := getRvsValue(rvs, 0x48)
                switch mod(4, rvs_whisker)
                

                // offset:   [0,0,0,0,0,0,18]
                // scale:    [1,1,1,1,1,1,1]
                // decimal:  [1,1,1,1,1,1,1]

                
                case 0 { 
                    // whisker: downward
                    // {"name":"downward","whl":4,"wha_100":18,"whox":7,"whoy":4,"wheox":100,"wheoy":30,"whc_100":15}
                    // [4,18,7,4,100,30,15]
                    // [4,18,7,4,100,30,33]
                    data := 0x04120704641e21
                }
                
                case 1 { 
                    // whisker: downwardShort
                    // {"name":"downwardShort","whl":3,"wha_100":18,"whox":7,"whoy":4,"wheox":100,"wheoy":30,"whc_100":15}
                    // [3,18,7,4,100,30,15]
                    // [3,18,7,4,100,30,33]
                    data := 0x03120704641e21
                }
                
                case 2 { 
                    // whisker: upward
                    // {"name":"upward","whl":4,"wha_100":20,"whox":7,"whoy":4,"wheox":102,"wheoy":0,"whc_100":-18}
                    // [4,20,7,4,102,0,-18]
                    // [4,20,7,4,102,0,0]
                    data := 0x04140704660000
                }
                
                case 3 { 
                    // whisker: upwardShort
                    // {"name":"upwardShort","whl":3,"wha_100":20,"whox":7,"whoy":4,"wheox":102,"wheoy":0,"whc_100":-18}
                    // [3,20,7,4,102,0,-18]
                    // [3,20,7,4,102,0,0]
                    data := 0x03140704660000
                }
                
            }

            // whisker - Get Data
            
            function getFieldValue_whisker_whl(whiskerData) -> value {                
                // [0] 4 = 4 * 1 - 0                
                // [1] 3 = 3 * 1 - 0                
                // [2] 4 = 4 * 1 - 0                
                // [3] 3 = 3 * 1 - 0
                value := and(0xff, shr(0x00, whiskerData))
            }
            
            function getFieldValue_whisker_wha_100(whiskerData) -> value {                
                // [0] 18 = 18 * 1 - 0                
                // [1] 18 = 18 * 1 - 0                
                // [2] 20 = 20 * 1 - 0                
                // [3] 20 = 20 * 1 - 0
                value := and(0xff, shr(0x08, whiskerData))
            }
            
            function getFieldValue_whisker_whox(whiskerData) -> value {                
                // [0] 7 = 7 * 1 - 0                
                // [1] 7 = 7 * 1 - 0                
                // [2] 7 = 7 * 1 - 0                
                // [3] 7 = 7 * 1 - 0
                value := and(0xff, shr(0x10, whiskerData))
            }
            
            function getFieldValue_whisker_whoy(whiskerData) -> value {                
                // [0] 4 = 4 * 1 - 0                
                // [1] 4 = 4 * 1 - 0                
                // [2] 4 = 4 * 1 - 0                
                // [3] 4 = 4 * 1 - 0
                value := and(0xff, shr(0x18, whiskerData))
            }
            
            function getFieldValue_whisker_wheox(whiskerData) -> value {                
                // [0] 100 = 100 * 1 - 0                
                // [1] 100 = 100 * 1 - 0                
                // [2] 102 = 102 * 1 - 0                
                // [3] 102 = 102 * 1 - 0
                value := and(0xff, shr(0x20, whiskerData))
            }
            
            function getFieldValue_whisker_wheoy(whiskerData) -> value {                
                // [0] 30 = 30 * 1 - 0                
                // [1] 30 = 30 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0
                value := and(0xff, shr(0x28, whiskerData))
            }
            
            function getFieldValue_whisker_whc_100(whiskerData) -> value {                
                // [0] 15 = 33 * 1 - 18                
                // [1] 15 = 33 * 1 - 18                
                // [2] -18 = 0 * 1 - 18                
                // [3] -18 = 0 * 1 - 18
                value := and(0xff, shr(0x30, whiskerData))
                value := sub(value, 18)
            }
            

            

        
            // palette - Select Data

            function selectData_palette(rvs, breedData) -> data {
                data := 0

                
                let rvs_palette      := getRvsValue(rvs, 0x18)

                // 186 bytes (uncompressed)
                // 17 bytes + 13 * 13 raw bytes/case (13 colors each case, with 1 byte index)
                // let pVarPaletteDataOffset = 0x42
                // data := mload(add(mload(0x40),add(0x42,mod(4, rvs_palette))))

                // 434 bytes (indexes only)
                // ~31.25 bytes per case (13 actual bytes of data per case)
                switch mod(4, rvs_palette)
                

                // offset:   [0,0,0,0,0,0,0,0,0,0,0,0,0]
                // scale:    [1,1,1,1,1,1,1,1,1,1,1,1,1]
                // decimal:  [1,1,1,1,1,1,1,1,1,1,1,1,1]

                
 
                
                case 0 { 
                    // palette: black
                    // {"name":"black","c_bg":"#b8deff","c_body":"#1a1b1e","c_neck":"#cfd2de","c_face":"#1a1b1e","c_prim":"#fafafa","c_sec":"#fafafa","c_ear":"#0f0f10","c_earIn":"#874f60","c_eyeline":"#000000","c_nose":"#f09d9d","c_noseIn":"#2d1f16","c_mouth":"#a06a6a","c_whiskers":"#ededed"}
                    // [0,1,2,1,3,3,4,5,6,7,8,9,10]
                    // [0,1,2,1,3,3,4,5,6,7,8,9,10]
                    data := 0x0001020103030405060708090a
                }
                
                case 1 { 
                    // palette: white
                    // {"name":"white","c_bg":"#8b92e9","c_body":"#fafafa","c_neck":"#ededed","c_face":"#fafafa","c_prim":"#121212","c_sec":"#050505","c_ear":"#f6f6f6","c_earIn":"#f3b4d9","c_eyeline":"#383838","c_nose":"#ffc2d4","c_noseIn":"#822673","c_mouth":"#3c252e","c_whiskers":"#050505"}
                    // [11,3,10,3,12,13,14,15,16,17,18,19,13]
                    // [11,3,10,3,12,13,14,15,16,17,18,19,13]
                    data := 0x0b030a030c0d0e0f101112130d
                }
                
                case 2 { 
                    // palette: ginger
                    // {"name":"ginger","c_bg":"#5d7bb1","c_body":"#ffae70","c_neck":"#ecddd5","c_face":"#ffae70","c_prim":"#fcfcfc","c_sec":"#e98649","c_ear":"#f7a464","c_earIn":"#ffede0","c_eyeline":"#8a400f","c_nose":"#ce5f5f","c_noseIn":"#32271f","c_mouth":"#4b291b","c_whiskers":"#6f3f2a"}
                    // [20,21,22,21,23,24,25,26,27,28,29,30,31]
                    // [20,21,22,21,23,24,25,26,27,28,29,30,31]
                    data := 0x141516151718191a1b1c1d1e1f
                }
                
                case 3 { 
                    // palette: gray
                    // {"name":"gray","c_bg":"#b8deff","c_body":"#7e849a","c_neck":"#d2d2db","c_face":"#7e849a","c_prim":"#fcfcfc","c_sec":"#555463","c_ear":"#6a6e7c","c_earIn":"#f5c7df","c_eyeline":"#3d3d3d","c_nose":"#f5b2d4","c_noseIn":"#703e57","c_mouth":"#383838","c_whiskers":"#383838"}
                    // [0,32,33,32,23,34,35,36,37,38,39,16,16]
                    // [0,32,33,32,23,34,35,36,37,38,39,16,16]
                    data := 0x00202120172223242526271010
                }
                
                case 4 { 
                    // palette: brown
                    // {"name":"brown","c_bg":"#f0f0f0","c_body":"#815d41","c_neck":"#ded1c9","c_face":"#815d41","c_prim":"#f2dfce","c_sec":"#40301c","c_ear":"#6e4e35","c_earIn":"#dd9797","c_eyeline":"#492c18","c_nose":"#f08e8e","c_noseIn":"#752f40","c_mouth":"#2f2323","c_whiskers":"#121212"}
                    // [40,41,42,41,43,44,45,46,47,48,49,50,12]
                    // [40,41,42,41,43,44,45,46,47,48,49,50,12]
                    data := 0x28292a292b2c2d2e2f3031320c
                }
                
                case 5 { 
                    // palette: british blue
                    // {"name":"british blue","c_bg":"#f0f0f0","c_body":"#5e6373","c_neck":"#cdd0d5","c_face":"#5e6373","c_prim":"#dadce7","c_sec":"#4d516a","c_ear":"#505568","c_earIn":"#dca7c1","c_eyeline":"#26242d","c_nose":"#13121c","c_noseIn":"#575757","c_mouth":"#191a1f","c_whiskers":"#171617"}
                    // [40,51,52,51,53,54,55,56,57,58,59,60,61]
                    // [40,51,52,51,53,54,55,56,57,58,59,60,61]
                    data := 0x2833343335363738393a3b3c3d
                }
                
                case 6 { 
                    // palette: calico
                    // {"name":"calico","c_bg":"#b8deff","c_body":"#fcfcfc","c_neck":"#e7e2de","c_face":"#fcfcfc","c_prim":"#1a1b1e","c_sec":"#e2843c","c_ear":"#1a1b1e","c_earIn":"#ffede0","c_eyeline":"#8a400f","c_nose":"#f39696","c_noseIn":"#6b1e62","c_mouth":"#6d4040","c_whiskers":"#262626"}
                    // [0,23,62,23,1,63,1,26,27,64,65,66,67]
                    // [0,23,62,23,1,63,1,26,27,64,65,66,67]
                    data := 0x00173e17013f011a1b40414243
                }
                
                case 7 { 
                    // palette: creamy
                    // {"name":"creamy","c_bg":"#f0f0f0","c_body":"#e1d0c6","c_neck":"#e3d6ce","c_face":"#e1d0c6","c_prim":"#2e2520","c_sec":"#bfa89b","c_ear":"#2e2520","c_earIn":"#5f4534","c_eyeline":"#43352d","c_nose":"#5f4534","c_noseIn":"#000000","c_mouth":"#795944","c_whiskers":"#292929"}
                    // [40,68,69,68,70,71,70,72,73,72,6,74,75]
                    // [40,68,69,68,70,71,70,72,73,72,6,74,75]
                    data := 0x28444544464746484948064a4b
                }
                
                case 8 { 
                    // palette: pink
                    // {"name":"pink","c_bg":"#5e4c9a","c_body":"#ffb8ee","c_neck":"#f1dfef","c_face":"#ffb8ee","c_prim":"#fff0fe","c_sec":"#d373be","c_ear":"#fbb1ea","c_earIn":"#d56dbe","c_eyeline":"#5c2e52","c_nose":"#a84d94","c_noseIn":"#3e1829","c_mouth":"#602957","c_whiskers":"#341b36"}
                    // [76,77,78,77,79,80,81,82,83,84,85,86,87]
                    // [76,77,78,77,79,80,81,82,83,84,85,86,87]
                    data := 0x4c4d4e4d4f5051525354555657
                }
                
                case 9 { 
                    // palette: cyan
                    // {"name":"cyan","c_bg":"#5e4c9a","c_body":"#b8f4ff","c_neck":"#cedcdf","c_face":"#b8f4ff","c_prim":"#ebf8ff","c_sec":"#6da4c0","c_ear":"#a0ebf8","c_earIn":"#599bb1","c_eyeline":"#385561","c_nose":"#6891b1","c_noseIn":"#24223f","c_mouth":"#182a35","c_whiskers":"#151e23"}
                    // [76,88,89,88,90,91,92,93,94,95,96,97,98]
                    // [76,88,89,88,90,91,92,93,94,95,96,97,98]
                    data := 0x4c5859585a5b5c5d5e5f606162
                }
                
                case 10 { 
                    // palette: green
                    // {"name":"green","c_bg":"#566a8f","c_body":"#7ca269","c_neck":"#ceded6","c_face":"#7ca269","c_prim":"#507141","c_sec":"#375845","c_ear":"#7a9a6a","c_earIn":"#355744","c_eyeline":"#1f2320","c_nose":"#343a31","c_noseIn":"#000000","c_mouth":"#242e1f","c_whiskers":"#ededed"}
                    // [99,100,101,100,102,103,104,105,106,107,6,108,10]
                    // [99,100,101,100,102,103,104,105,106,107,6,108,10]
                    data := 0x63646564666768696a6b066c0a
                }
                
                case 11 { 
                    // palette: fleshy
                    // {"name":"fleshy","c_bg":"#5d7bb1","c_body":"#f3d8d8","c_neck":"#f2e9e9","c_face":"#f3d8d8","c_prim":"#ffebeb","c_sec":"#ecb6b6","c_ear":"#f3cece","c_earIn":"#d38897","c_eyeline":"#b47979","c_nose":"#f0a8a8","c_noseIn":"#5e4040","c_mouth":"#a97575","c_whiskers":"#f5f5f5"}
                    // [20,109,110,109,111,112,113,114,115,116,117,118,119]
                    // [20,109,110,109,111,112,113,114,115,116,117,118,119]
                    data := 0x146d6e6d6f7071727374757677
                }
                
                case 12 { 
                    // palette: sand
                    // {"name":"sand","c_bg":"#f0f0f0","c_body":"#e4c7b4","c_neck":"#efe0d7","c_face":"#e4c7b4","c_prim":"#ffede0","c_sec":"#c19d8a","c_ear":"#d7b8a3","c_earIn":"#ba8882","c_eyeline":"#603e3e","c_nose":"#7b5656","c_noseIn":"#000000","c_mouth":"#3a2727","c_whiskers":"#6f5858"}
                    // [40,120,121,120,26,122,123,124,125,126,6,127,128]
                    // [40,120,121,120,26,122,123,124,125,126,6,127,128]
                    data := 0x287879781a7a7b7c7d7e067f80
                }
                
                case 13 { 
                    // palette: toyger
                    // {"name":"toyger","c_bg":"#5d7bb1","c_body":"#f09475","c_neck":"#decadc","c_face":"#f09475","c_prim":"#fff0fe","c_sec":"#49241d","c_ear":"#38251f","c_earIn":"#d491bb","c_eyeline":"#000000","c_nose":"#371515","c_noseIn":"#808080","c_mouth":"#000000","c_whiskers":"#000000"}
                    // [20,129,130,129,79,131,132,133,6,134,135,6,6]
                    // [20,129,130,129,79,131,132,133,6,134,135,6,6]
                    data := 0x148182814f8384850686870606
                }
                
            }

            // palette - Get Data
            
            function getFieldValue_palette_c_bg(paletteData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 11 = 11 * 1 - 0                
                // [2] 20 = 20 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 40 = 40 * 1 - 0                
                // [5] 40 = 40 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 40 = 40 * 1 - 0                
                // [8] 76 = 76 * 1 - 0                
                // [9] 76 = 76 * 1 - 0                
                // [10] 99 = 99 * 1 - 0                
                // [11] 20 = 20 * 1 - 0                
                // [12] 40 = 40 * 1 - 0                
                // [13] 20 = 20 * 1 - 0
                value := and(0xff, shr(0x00, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_body(paletteData) -> value {                
                // [0] 1 = 1 * 1 - 0                
                // [1] 3 = 3 * 1 - 0                
                // [2] 21 = 21 * 1 - 0                
                // [3] 32 = 32 * 1 - 0                
                // [4] 41 = 41 * 1 - 0                
                // [5] 51 = 51 * 1 - 0                
                // [6] 23 = 23 * 1 - 0                
                // [7] 68 = 68 * 1 - 0                
                // [8] 77 = 77 * 1 - 0                
                // [9] 88 = 88 * 1 - 0                
                // [10] 100 = 100 * 1 - 0                
                // [11] 109 = 109 * 1 - 0                
                // [12] 120 = 120 * 1 - 0                
                // [13] 129 = 129 * 1 - 0
                value := and(0xff, shr(0x08, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_neck(paletteData) -> value {                
                // [0] 2 = 2 * 1 - 0                
                // [1] 10 = 10 * 1 - 0                
                // [2] 22 = 22 * 1 - 0                
                // [3] 33 = 33 * 1 - 0                
                // [4] 42 = 42 * 1 - 0                
                // [5] 52 = 52 * 1 - 0                
                // [6] 62 = 62 * 1 - 0                
                // [7] 69 = 69 * 1 - 0                
                // [8] 78 = 78 * 1 - 0                
                // [9] 89 = 89 * 1 - 0                
                // [10] 101 = 101 * 1 - 0                
                // [11] 110 = 110 * 1 - 0                
                // [12] 121 = 121 * 1 - 0                
                // [13] 130 = 130 * 1 - 0
                value := and(0xff, shr(0x10, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_face(paletteData) -> value {                
                // [0] 1 = 1 * 1 - 0                
                // [1] 3 = 3 * 1 - 0                
                // [2] 21 = 21 * 1 - 0                
                // [3] 32 = 32 * 1 - 0                
                // [4] 41 = 41 * 1 - 0                
                // [5] 51 = 51 * 1 - 0                
                // [6] 23 = 23 * 1 - 0                
                // [7] 68 = 68 * 1 - 0                
                // [8] 77 = 77 * 1 - 0                
                // [9] 88 = 88 * 1 - 0                
                // [10] 100 = 100 * 1 - 0                
                // [11] 109 = 109 * 1 - 0                
                // [12] 120 = 120 * 1 - 0                
                // [13] 129 = 129 * 1 - 0
                value := and(0xff, shr(0x18, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_prim(paletteData) -> value {                
                // [0] 3 = 3 * 1 - 0                
                // [1] 12 = 12 * 1 - 0                
                // [2] 23 = 23 * 1 - 0                
                // [3] 23 = 23 * 1 - 0                
                // [4] 43 = 43 * 1 - 0                
                // [5] 53 = 53 * 1 - 0                
                // [6] 1 = 1 * 1 - 0                
                // [7] 70 = 70 * 1 - 0                
                // [8] 79 = 79 * 1 - 0                
                // [9] 90 = 90 * 1 - 0                
                // [10] 102 = 102 * 1 - 0                
                // [11] 111 = 111 * 1 - 0                
                // [12] 26 = 26 * 1 - 0                
                // [13] 79 = 79 * 1 - 0
                value := and(0xff, shr(0x20, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_sec(paletteData) -> value {                
                // [0] 3 = 3 * 1 - 0                
                // [1] 13 = 13 * 1 - 0                
                // [2] 24 = 24 * 1 - 0                
                // [3] 34 = 34 * 1 - 0                
                // [4] 44 = 44 * 1 - 0                
                // [5] 54 = 54 * 1 - 0                
                // [6] 63 = 63 * 1 - 0                
                // [7] 71 = 71 * 1 - 0                
                // [8] 80 = 80 * 1 - 0                
                // [9] 91 = 91 * 1 - 0                
                // [10] 103 = 103 * 1 - 0                
                // [11] 112 = 112 * 1 - 0                
                // [12] 122 = 122 * 1 - 0                
                // [13] 131 = 131 * 1 - 0
                value := and(0xff, shr(0x28, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_ear(paletteData) -> value {                
                // [0] 4 = 4 * 1 - 0                
                // [1] 14 = 14 * 1 - 0                
                // [2] 25 = 25 * 1 - 0                
                // [3] 35 = 35 * 1 - 0                
                // [4] 45 = 45 * 1 - 0                
                // [5] 55 = 55 * 1 - 0                
                // [6] 1 = 1 * 1 - 0                
                // [7] 70 = 70 * 1 - 0                
                // [8] 81 = 81 * 1 - 0                
                // [9] 92 = 92 * 1 - 0                
                // [10] 104 = 104 * 1 - 0                
                // [11] 113 = 113 * 1 - 0                
                // [12] 123 = 123 * 1 - 0                
                // [13] 132 = 132 * 1 - 0
                value := and(0xff, shr(0x30, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_earIn(paletteData) -> value {                
                // [0] 5 = 5 * 1 - 0                
                // [1] 15 = 15 * 1 - 0                
                // [2] 26 = 26 * 1 - 0                
                // [3] 36 = 36 * 1 - 0                
                // [4] 46 = 46 * 1 - 0                
                // [5] 56 = 56 * 1 - 0                
                // [6] 26 = 26 * 1 - 0                
                // [7] 72 = 72 * 1 - 0                
                // [8] 82 = 82 * 1 - 0                
                // [9] 93 = 93 * 1 - 0                
                // [10] 105 = 105 * 1 - 0                
                // [11] 114 = 114 * 1 - 0                
                // [12] 124 = 124 * 1 - 0                
                // [13] 133 = 133 * 1 - 0
                value := and(0xff, shr(0x38, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_eyeline(paletteData) -> value {                
                // [0] 6 = 6 * 1 - 0                
                // [1] 16 = 16 * 1 - 0                
                // [2] 27 = 27 * 1 - 0                
                // [3] 37 = 37 * 1 - 0                
                // [4] 47 = 47 * 1 - 0                
                // [5] 57 = 57 * 1 - 0                
                // [6] 27 = 27 * 1 - 0                
                // [7] 73 = 73 * 1 - 0                
                // [8] 83 = 83 * 1 - 0                
                // [9] 94 = 94 * 1 - 0                
                // [10] 106 = 106 * 1 - 0                
                // [11] 115 = 115 * 1 - 0                
                // [12] 125 = 125 * 1 - 0                
                // [13] 6 = 6 * 1 - 0
                value := and(0xff, shr(0x40, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_nose(paletteData) -> value {                
                // [0] 7 = 7 * 1 - 0                
                // [1] 17 = 17 * 1 - 0                
                // [2] 28 = 28 * 1 - 0                
                // [3] 38 = 38 * 1 - 0                
                // [4] 48 = 48 * 1 - 0                
                // [5] 58 = 58 * 1 - 0                
                // [6] 64 = 64 * 1 - 0                
                // [7] 72 = 72 * 1 - 0                
                // [8] 84 = 84 * 1 - 0                
                // [9] 95 = 95 * 1 - 0                
                // [10] 107 = 107 * 1 - 0                
                // [11] 116 = 116 * 1 - 0                
                // [12] 126 = 126 * 1 - 0                
                // [13] 134 = 134 * 1 - 0
                value := and(0xff, shr(0x48, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_noseIn(paletteData) -> value {                
                // [0] 8 = 8 * 1 - 0                
                // [1] 18 = 18 * 1 - 0                
                // [2] 29 = 29 * 1 - 0                
                // [3] 39 = 39 * 1 - 0                
                // [4] 49 = 49 * 1 - 0                
                // [5] 59 = 59 * 1 - 0                
                // [6] 65 = 65 * 1 - 0                
                // [7] 6 = 6 * 1 - 0                
                // [8] 85 = 85 * 1 - 0                
                // [9] 96 = 96 * 1 - 0                
                // [10] 6 = 6 * 1 - 0                
                // [11] 117 = 117 * 1 - 0                
                // [12] 6 = 6 * 1 - 0                
                // [13] 135 = 135 * 1 - 0
                value := and(0xff, shr(0x50, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_mouth(paletteData) -> value {                
                // [0] 9 = 9 * 1 - 0                
                // [1] 19 = 19 * 1 - 0                
                // [2] 30 = 30 * 1 - 0                
                // [3] 16 = 16 * 1 - 0                
                // [4] 50 = 50 * 1 - 0                
                // [5] 60 = 60 * 1 - 0                
                // [6] 66 = 66 * 1 - 0                
                // [7] 74 = 74 * 1 - 0                
                // [8] 86 = 86 * 1 - 0                
                // [9] 97 = 97 * 1 - 0                
                // [10] 108 = 108 * 1 - 0                
                // [11] 118 = 118 * 1 - 0                
                // [12] 127 = 127 * 1 - 0                
                // [13] 6 = 6 * 1 - 0
                value := and(0xff, shr(0x58, paletteData))
                value := getColor(value)
            }
            
            function getFieldValue_palette_c_whiskers(paletteData) -> value {                
                // [0] 10 = 10 * 1 - 0                
                // [1] 13 = 13 * 1 - 0                
                // [2] 31 = 31 * 1 - 0                
                // [3] 16 = 16 * 1 - 0                
                // [4] 12 = 12 * 1 - 0                
                // [5] 61 = 61 * 1 - 0                
                // [6] 67 = 67 * 1 - 0                
                // [7] 75 = 75 * 1 - 0                
                // [8] 87 = 87 * 1 - 0                
                // [9] 98 = 98 * 1 - 0                
                // [10] 10 = 10 * 1 - 0                
                // [11] 119 = 119 * 1 - 0                
                // [12] 128 = 128 * 1 - 0                
                // [13] 6 = 6 * 1 - 0
                value := and(0xff, shr(0x60, paletteData))
                value := getColor(value)
            }
            

            

        
            // eyeColor - Select Data

            function selectData_eyeColor(iValue) -> data {
                data := 0

                
                switch iValue
                

                // offset:   [0]
                // scale:    [1]
                // decimal:  [1]

                
                case 0 { 
                    // eyeColor: blue
                    // {"name":"blue","c_eye":"#d6f9ff"}
                    // [136]
                    // [136]
                    data := 0x88
                }
                
                case 1 { 
                    // eyeColor: yellow
                    // {"name":"yellow","c_eye":"#f9e9ae"}
                    // [137]
                    // [137]
                    data := 0x89
                }
                
                case 2 { 
                    // eyeColor: green
                    // {"name":"green","c_eye":"#cafaa3"}
                    // [138]
                    // [138]
                    data := 0x8a
                }
                
                case 3 { 
                    // eyeColor: orange
                    // {"name":"orange","c_eye":"#ff9c66"}
                    // [139]
                    // [139]
                    data := 0x8b
                }
                
                case 4 { 
                    // eyeColor: black
                    // {"name":"black","c_eye":"#000000"}
                    // [6]
                    // [6]
                    data := 0x06
                }
                
                case 5 { 
                    // eyeColor: white
                    // {"name":"white","c_eye":"#ef0902"}
                    // [140]
                    // [140]
                    data := 0x8c
                }
                
            }

            // eyeColor - Get Data
            

            
            function getFieldValue_eyeColor_c_eye(iValue) -> value {
                value := selectData_eyeColor(iValue)
                value := getColor(value)
            }
            

        
            // bodyParts - Select Data

            function selectData_bodyParts(iValue) -> data {
                data := 0

                
                switch iValue
                

                // offset:   [0,0,0,0,0]
                // scale:    [1,1,1,1,1]
                // decimal:  [1,1,1,1,1]

                
                case 0 { 
                    // bodyParts: 0
                    // {"name":"0","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                    // [0,0,0,0,0]
                    // [0,0,0,0,0]
                    data := 0x00
                }
                
                case 1 { 
                    // bodyParts: 1
                    // {"name":"1","bodyParts_tabby":true,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                    // [1,0,0,0,0]
                    // [1,0,0,0,0]
                    data := 0x01
                }
                
                case 2 { 
                    // bodyParts: 3
                    // {"name":"3","bodyParts_tabby":true,"bodyParts_belly":true,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                    // [1,1,0,0,0]
                    // [1,1,0,0,0]
                    data := 0x03
                }
                
                case 3 { 
                    // bodyParts: 5
                    // {"name":"5","bodyParts_tabby":true,"bodyParts_belly":false,"bodyParts_necktie":true,"bodyParts_corners":false,"bodyParts_stripes":false}
                    // [1,0,1,0,0]
                    // [1,0,1,0,0]
                    data := 0x05
                }
                
                case 4 { 
                    // bodyParts: 2
                    // {"name":"2","bodyParts_tabby":false,"bodyParts_belly":true,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":false}
                    // [0,1,0,0,0]
                    // [0,1,0,0,0]
                    data := 0x02
                }
                
                case 5 { 
                    // bodyParts: 4
                    // {"name":"4","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":true,"bodyParts_corners":false,"bodyParts_stripes":false}
                    // [0,0,1,0,0]
                    // [0,0,1,0,0]
                    data := 0x04
                }
                
                case 6 { 
                    // bodyParts: 8
                    // {"name":"8","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":true,"bodyParts_stripes":false}
                    // [0,0,0,1,0]
                    // [0,0,0,1,0]
                    data := 0x08
                }
                
                case 7 { 
                    // bodyParts: 16
                    // {"name":"16","bodyParts_tabby":false,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":false,"bodyParts_stripes":true}
                    // [0,0,0,0,1]
                    // [0,0,0,0,1]
                    data := 0x10
                }
                
                case 8 { 
                    // bodyParts: 9
                    // {"name":"9","bodyParts_tabby":true,"bodyParts_belly":false,"bodyParts_necktie":false,"bodyParts_corners":true,"bodyParts_stripes":false}
                    // [1,0,0,1,0]
                    // [1,0,0,1,0]
                    data := 0x09
                }
                
            }

            // bodyParts - Get Data
            
            function getFieldValue_bodyParts_bodyParts_tabby(bodyPartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 1 = 1 * 1 - 0                
                // [2] 1 = 1 * 1 - 0                
                // [3] 1 = 1 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 1 = 1 * 1 - 0
                value := and(0x01, shr(0x00, bodyPartsData))
            }
            
            function getFieldValue_bodyParts_bodyParts_belly(bodyPartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 1 = 1 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 1 = 1 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x01, bodyPartsData))
            }
            
            function getFieldValue_bodyParts_bodyParts_necktie(bodyPartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 1 = 1 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 1 = 1 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x02, bodyPartsData))
            }
            
            function getFieldValue_bodyParts_bodyParts_corners(bodyPartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 1 = 1 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 1 = 1 * 1 - 0
                value := and(0x01, shr(0x03, bodyPartsData))
            }
            
            function getFieldValue_bodyParts_bodyParts_stripes(bodyPartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 1 = 1 * 1 - 0                
                // [8] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x04, bodyPartsData))
            }
            

            

        
            // faceParts - Select Data

            function selectData_faceParts(iValue) -> data {
                data := 0

                
                switch iValue
                

                // offset:   [0,0,0,0,0,0,0,0]
                // scale:    [1,1,1,1,1,1,1,1]
                // decimal:  [1,1,1,1,1,1,1,1]

                
                case 0 { 
                    // faceParts: 0
                    // {"name":"0","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,0,0,0,0,0,0]
                    // [0,0,0,0,0,0,0,0]
                    data := 0x00
                }
                
                case 1 { 
                    // faceParts: 1
                    // {"name":"1","faceParts_mask":true,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                    // [1,0,0,0,0,0,0,0]
                    // [1,0,0,0,0,0,0,0]
                    data := 0x01
                }
                
                case 2 { 
                    // faceParts: 2
                    // {"name":"2","faceParts_mask":false,"faceParts_round":true,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,1,0,0,0,0,0,0]
                    // [0,1,0,0,0,0,0,0]
                    data := 0x02
                }
                
                case 3 { 
                    // faceParts: 6
                    // {"name":"6","faceParts_mask":false,"faceParts_round":true,"faceParts_nose":true,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,1,1,0,0,0,0,0]
                    // [0,1,1,0,0,0,0,0]
                    data := 0x06
                }
                
                case 4 { 
                    // faceParts: 12
                    // {"name":"12","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":true,"faceParts_chin":true,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,1,1,0,0,0,0]
                    // [0,0,1,1,0,0,0,0]
                    data := 0x0c
                }
                
                case 5 { 
                    // faceParts: 16
                    // {"name":"16","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":true,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,0,0,1,0,0,0]
                    // [0,0,0,0,1,0,0,0]
                    data := 0x10
                }
                
                case 6 { 
                    // faceParts: 48
                    // {"name":"48","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":true,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,0,0,1,1,0,0]
                    // [0,0,0,0,1,1,0,0]
                    data := 0x30
                }
                
                case 7 { 
                    // faceParts: 32
                    // {"name":"32","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,0,0,0,1,0,0]
                    // [0,0,0,0,0,1,0,0]
                    data := 0x20
                }
                
                case 8 { 
                    // faceParts: 36
                    // {"name":"36","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":true,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,1,0,0,1,0,0]
                    // [0,0,1,0,0,1,0,0]
                    data := 0x24
                }
                
                case 9 { 
                    // faceParts: 40
                    // {"name":"40","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":true,"faceParts_triangle":false,"faceParts_whiskers":true,"faceParts_ear":false,"faceParts_temple":false}
                    // [0,0,0,1,0,1,0,0]
                    // [0,0,0,1,0,1,0,0]
                    data := 0x28
                }
                
                case 10 { 
                    // faceParts: 64
                    // {"name":"64","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":true,"faceParts_temple":false}
                    // [0,0,0,0,0,0,1,0]
                    // [0,0,0,0,0,0,1,0]
                    data := 0x40
                }
                
                case 11 { 
                    // faceParts: 128
                    // {"name":"128","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":false,"faceParts_temple":true}
                    // [0,0,0,0,0,0,0,1]
                    // [0,0,0,0,0,0,0,1]
                    data := 0x80
                }
                
                case 12 { 
                    // faceParts: 192
                    // {"name":"192","faceParts_mask":false,"faceParts_round":false,"faceParts_nose":false,"faceParts_chin":false,"faceParts_triangle":false,"faceParts_whiskers":false,"faceParts_ear":true,"faceParts_temple":true}
                    // [0,0,0,0,0,0,1,1]
                    // [0,0,0,0,0,0,1,1]
                    data := 0xc0
                }
                
            }

            // faceParts - Get Data
            
            function getFieldValue_faceParts_faceParts_mask(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 1 = 1 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x00, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_round(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 1 = 1 * 1 - 0                
                // [3] 1 = 1 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x01, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_nose(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 1 = 1 * 1 - 0                
                // [4] 1 = 1 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 1 = 1 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x02, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_chin(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 1 = 1 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0                
                // [9] 1 = 1 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x03, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_triangle(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 1 = 1 * 1 - 0                
                // [6] 1 = 1 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x04, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_whiskers(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 1 = 1 * 1 - 0                
                // [7] 1 = 1 * 1 - 0                
                // [8] 1 = 1 * 1 - 0                
                // [9] 1 = 1 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 0 = 0 * 1 - 0
                value := and(0x01, shr(0x05, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_ear(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 1 = 1 * 1 - 0                
                // [11] 0 = 0 * 1 - 0                
                // [12] 1 = 1 * 1 - 0
                value := and(0x01, shr(0x06, facePartsData))
            }
            
            function getFieldValue_faceParts_faceParts_temple(facePartsData) -> value {                
                // [0] 0 = 0 * 1 - 0                
                // [1] 0 = 0 * 1 - 0                
                // [2] 0 = 0 * 1 - 0                
                // [3] 0 = 0 * 1 - 0                
                // [4] 0 = 0 * 1 - 0                
                // [5] 0 = 0 * 1 - 0                
                // [6] 0 = 0 * 1 - 0                
                // [7] 0 = 0 * 1 - 0                
                // [8] 0 = 0 * 1 - 0                
                // [9] 0 = 0 * 1 - 0                
                // [10] 0 = 0 * 1 - 0                
                // [11] 1 = 1 * 1 - 0                
                // [12] 1 = 1 * 1 - 0
                value := and(0x01, shr(0x07, facePartsData))
            }
            

            

        
    
            
            // function selectData_head(rvs, breedData)
            // function selectData_ear(rvs, breedData)
            // function selectData_eye(rvs, breedData)
            // function selectData_pupil(rvs, breedData)
            // function selectData_mouth(rvs, breedData)
            // function selectData_whisker(rvs, breedData)
            // function selectData_palette(rvs, breedData)
            // function selectData_eyeColor(iValue)
            // function selectData_bodyParts(iValue)
            // function selectData_faceParts(iValue)

            
            // function getFieldValue_head_fhy(headData)
            // function getFieldValue_head_tplx(headData)
            // function getFieldValue_head_tply(headData)
            // function getFieldValue_head_chkx(headData)
            // function getFieldValue_head_chky(headData)
            // function getFieldValue_head_chny(headData)
            // function getFieldValue_head_chkc_100(headData)
            // function getFieldValue_head_chko_100(headData)
            // function getFieldValue_head_chnc_100(headData)
            // function getFieldValue_head_chno_100(headData)
            // function getFieldValue_head_bw_100(headData)
            // function getFieldValue_head_eeo_100(headData)
            // function getFieldValue_ear_eso_100(earData)
            // function getFieldValue_ear_etox(earData)
            // function getFieldValue_ear_etoy(earData)
            // function getFieldValue_ear_eb_100(earData)
            // function getFieldValue_ear_ebr_100(earData)
            // function getFieldValue_ear_esc_100(earData)
            // function getFieldValue_ear_etc_100(earData)
            // function getFieldValue_ear_eec_100(earData)
            // function getFieldValue_ear_eitc_100(earData)
            // function getFieldValue_ear_esi_100(earData)
            // function getFieldValue_ear_eti_100(earData)
            // function getFieldValue_ear_eei_100(earData)
            // function getFieldValue_ear_eito_100(earData)
            // function getFieldValue_eye_eyox(eyeData)
            // function getFieldValue_eye_eyoy(eyeData)
            // function getFieldValue_eye_eyw(eyeData)
            // function getFieldValue_eye_eyt(eyeData)
            // function getFieldValue_eye_eyb(eyeData)
            // function getFieldValue_eye_eyr_100(eyeData)
            // function getFieldValue_eye_eypox(eyeData)
            // function getFieldValue_eye_eypoy(eyeData)
            // function getFieldValue_eye_no(eyeData)
            // function getFieldValue_pupil_eypw(pupilData)
            // function getFieldValue_pupil_eyph(pupilData)
            // function getFieldValue_mouth_mh(mouthData)
            // function getFieldValue_mouth_mox(mouthData)
            // function getFieldValue_mouth_moy(mouthData)
            // function getFieldValue_mouth_mc_100(mouthData)
            // function getFieldValue_mouth_tngo_100(mouthData)
            // function getFieldValue_mouth_tng(mouthData)
            // function getFieldValue_whisker_whl(whiskerData)
            // function getFieldValue_whisker_wha_100(whiskerData)
            // function getFieldValue_whisker_whox(whiskerData)
            // function getFieldValue_whisker_whoy(whiskerData)
            // function getFieldValue_whisker_wheox(whiskerData)
            // function getFieldValue_whisker_wheoy(whiskerData)
            // function getFieldValue_whisker_whc_100(whiskerData)
            // function getFieldValue_palette_c_bg(paletteData)
            // function getFieldValue_palette_c_body(paletteData)
            // function getFieldValue_palette_c_neck(paletteData)
            // function getFieldValue_palette_c_face(paletteData)
            // function getFieldValue_palette_c_prim(paletteData)
            // function getFieldValue_palette_c_sec(paletteData)
            // function getFieldValue_palette_c_ear(paletteData)
            // function getFieldValue_palette_c_earIn(paletteData)
            // function getFieldValue_palette_c_eyeline(paletteData)
            // function getFieldValue_palette_c_nose(paletteData)
            // function getFieldValue_palette_c_noseIn(paletteData)
            // function getFieldValue_palette_c_mouth(paletteData)
            // function getFieldValue_palette_c_whiskers(paletteData)
            // function getFieldValue_bodyParts_bodyParts_tabby(bodyPartsData)
            // function getFieldValue_bodyParts_bodyParts_belly(bodyPartsData)
            // function getFieldValue_bodyParts_bodyParts_necktie(bodyPartsData)
            // function getFieldValue_bodyParts_bodyParts_corners(bodyPartsData)
            // function getFieldValue_bodyParts_bodyParts_stripes(bodyPartsData)
            // function getFieldValue_faceParts_faceParts_mask(facePartsData)
            // function getFieldValue_faceParts_faceParts_round(facePartsData)
            // function getFieldValue_faceParts_faceParts_nose(facePartsData)
            // function getFieldValue_faceParts_faceParts_chin(facePartsData)
            // function getFieldValue_faceParts_faceParts_triangle(facePartsData)
            // function getFieldValue_faceParts_faceParts_whiskers(facePartsData)
            // function getFieldValue_faceParts_faceParts_ear(facePartsData)
            // function getFieldValue_faceParts_faceParts_temple(facePartsData)

            
            // function getFieldValue_eyeColor_c_eye(iValue)
    
    
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

// Main Function ---

            function generateSvgInner(rvs) -> pOutputStart {
                pOutputStart := mload(0x40)

                // First 32bits is length
                mstore(0x00, add(0x20, pOutputStart))

                // Place pVars after output (leaving plenty of space for max string length)
                let pVars := add(pOutputStart, 0xFFFFFF)
                let slot0 := 0
                let slot1 := 0
                let slot2 := 0
                let slot3 := 0
                let slot4 := 0
                let slot5 := 0
                let slot6 := 0
                let slot7 := 0
                let slot8 := 0

// START OUTPUT ---


        function writeOutput_text(textIndex) {                
            let p := mload(0x00)

            switch textIndex

            case 0 {
                mstore(p, "<?xml version='1.0' encoding='UT")      p := add(32, p)
                mstore(p, "F-8' standalone='no'?><svg width")      p := add(32, p)
                mstore(p, "='100%' height='100%' viewBox='0")      p := add(32, p)
                mstore(p, " 0 300 300' version='1.1' xmlns:")      p := add(32, p)
                mstore(p, "xlink='http://www.w3.org/1999/xl")      p := add(32, p)
                mstore(p, "ink' xmlns='http://www.w3.org/20")      p := add(32, p)
                mstore(p, "00/svg' xmlns:svg='http://www.w3")      p := add(32, p)
                mstore(p, ".org/2000/svg'><defs><linearGrad")      p := add(32, p)
                mstore(p, "ient id='x1'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 1 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x2'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 2 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x3'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 3 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x4'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 4 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x5'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 5 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x6'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 6 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x7'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 7 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x8'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 8 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x9'><stop style='stop-co")      p := add(32, p)
                mstore(p, "lor:#"                           )      p := add(5, p)
            }case 9 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x10'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 10 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x11'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 11 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x12'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 12 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x13'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 13 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x14'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 14 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x15'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 15 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x16'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 16 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x17'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 17 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x18'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 18 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x19'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 19 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent><stop style='stop-color:#"   )      p := add(29, p)
            }case 20 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x20'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 21 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x21'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 22 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x22'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 23 {
                mstore(p, "'/></linearGradient><linearGradi")      p := add(32, p)
                mstore(p, "ent id='x23'><stop style='stop-c")      p := add(32, p)
                mstore(p, "olor:#"                          )      p := add(6, p)
            }case 24 {
                mstore(p, "'/></linearGradient><filter id='")      p := add(32, p)
                mstore(p, "x24' style='color-interpolation-")      p := add(32, p)
                mstore(p, "filters:sRGB'><feGaussianBlur st")      p := add(32, p)
                mstore(p, "dDeviation='0 0' result='blur'/>")      p := add(32, p)
                mstore(p, "</filter><filter id='x25' style=")      p := add(32, p)
                mstore(p, "'color-interpolation-filters:sRG")      p := add(32, p)
                mstore(p, "B'><feGaussianBlur stdDeviation=")      p := add(32, p)
                mstore(p, "'0.5 0.5' result='blur'/></filte")      p := add(32, p)
                mstore(p, "r><filter id='x26' style='color-")      p := add(32, p)
                mstore(p, "interpolation-filters:sRGB'><feG")      p := add(32, p)
                mstore(p, "aussianBlur stdDeviation='5 5' r")      p := add(32, p)
                mstore(p, "esult='blur'/></filter><filter i")      p := add(32, p)
                mstore(p, "d='x27' style='color-interpolati")      p := add(32, p)
                mstore(p, "on-filters:sRGB'><feGaussianBlur")      p := add(32, p)
                mstore(p, " stdDeviation='3 3' result='blur")      p := add(32, p)
                mstore(p, "'/></filter></defs><rect x='-300")      p := add(32, p)
                mstore(p, "' y='-300' width='600' height='6")      p := add(32, p)
                mstore(p, "00' style='fill:url(#x1)'/><g tr")      p := add(32, p)
                mstore(p, "ansform='translate(150.0,150.0) ")      p := add(32, p)
                mstore(p, "scale(1)'><g style='filter:url(#")      p := add(32, p)
                mstore(p, "x24)'><animateMotion dur='17s' r")      p := add(32, p)
                mstore(p, "epeatCount='indefinite' path='M2")      p := add(32, p)
                mstore(p, ",5c0,-5,3,5,3,0c0,-5-3,5-3,0Z'/>")      p := add(32, p)
                mstore(p, "<clipPath id='x28' clipPathUnits")      p := add(32, p)
                mstore(p, "='userSpaceOnUse'><path d='M"    )      p := add(28, p)
            }case 25 {
                mstore(p, ","                               )      p := add(1, p)
            }case 26 {
                mstore(p, "L"                               )      p := add(1, p)
            }case 27 {
                mstore(p, "Z'/></clipPath><g clip-path='url")      p := add(32, p)
                mstore(p, "(#x28)'><rect x='-300' y='-300' ")      p := add(32, p)
                mstore(p, "width='600' height='600' style='")      p := add(32, p)
                mstore(p, "fill:url(#x2)'/><g opacity='"    )      p := add(28, p)
            }case 28 {
                mstore(p, "'><path id='x29' style='fill:non")      p := add(32, p)
                mstore(p, "e;stroke:url(#x5);stroke-width:1")      p := add(32, p)
                mstore(p, "4' d='"                          )      p := add(6, p)
            }case 29 {
                mstore(p, "'/><use xlink:href='#x29' transf")      p := add(32, p)
                mstore(p, "orm='translate(0, 27)'/><use xli")      p := add(32, p)
                mstore(p, "nk:href='#x29' transform='transl")      p := add(32, p)
                mstore(p, "ate(0, 54)'/><use xlink:href='#x")      p := add(32, p)
                mstore(p, "29' transform='translate(0, 81)'")      p := add(32, p)
                mstore(p, "/><use xlink:href='#x29' transfo")      p := add(32, p)
                mstore(p, "rm='translate(0, 108)'/></g><g o")      p := add(32, p)
                mstore(p, "pacity='"                        )      p := add(8, p)
            }case 30 {
                mstore(p, "'><path style='fill:url(#x7)' d=")      p := add(32, p)
                mstore(p, "'M"                              )      p := add(2, p)
            }case 31 {
                mstore(p, "Z'/><path style='fill:url(#x8)' ")      p := add(32, p)
                mstore(p, "d='M"                            )      p := add(4, p)
            }case 32 {
                mstore(p, "Z'/></g><g opacity='"            )      p := add(20, p)
            }case 33 {
                mstore(p, "'><g id='x30'><path id='x31' sty")      p := add(32, p)
                mstore(p, "le='fill:url(#x5);filter:url(#x2")      p := add(32, p)
                mstore(p, "5)' d='M"                        )      p := add(8, p)
            }case 34 {
                mstore(p, "c60,15,60,20,60,20c0,5-60,-10-60")      p := add(32, p)
                mstore(p, ",-10z'/><use xlink:href='#x31' t")      p := add(32, p)
                mstore(p, "ransform='translate( -4, 18)'/><")      p := add(32, p)
                mstore(p, "use xlink:href='#x31' transform=")      p := add(32, p)
                mstore(p, "'translate( -8,36)'/><use xlink:")      p := add(32, p)
                mstore(p, "href='#x31' transform='translate")      p := add(32, p)
                mstore(p, "(-12,54)'/></g><use xlink:href='")      p := add(32, p)
                mstore(p, "#x30' transform='scale(-1,1)'/><")      p := add(32, p)
                mstore(p, "/g><g opacity='"                 )      p := add(15, p)
            }case 35 {
                mstore(p, "'><path style='fill:url(#x4)' d=")      p := add(32, p)
                mstore(p, "'M"                              )      p := add(2, p)
            }case 36 {
                mstore(p, "H"                               )      p := add(1, p)
            }case 37 {
                mstore(p, "'><ellipse style='fill:url(#x4)'")      p := add(32, p)
                mstore(p, " cx='0' cy='165' rx='"           )      p := add(21, p)
            }case 38 {
                mstore(p, "' ry='50'/></g></g><g><path styl")      p := add(32, p)
                mstore(p, "e='fill:url(#x11);filter:url(#x2")      p := add(32, p)
                mstore(p, "6)' clip-path='url(#x28)' d='M-9")      p := add(32, p)
                mstore(p, "0,-5c0,0,40,-40,90,-40c50,0,90,4")      p := add(32, p)
                mstore(p, "0,90,40c0,0,10,50,10,70c-20,0,-7")      p := add(32, p)
                mstore(p, "0,30,-100,30c-30,0,-80,-30,-100,")      p := add(32, p)
                mstore(p, "-30c0,-20,10,-70,10,-70z'/></g><")      p := add(32, p)
                mstore(p, "/g><g><g transform='scale("      )      p := add(26, p)
            }case 39 {
                mstore(p, ",1)'><g><g><clipPath id='x32' cl")      p := add(32, p)
                mstore(p, "ipPathUnits='userSpaceOnUse'><pa")      p := add(32, p)
                mstore(p, "th d='"                          )      p := add(6, p)
            }case 40 {
                mstore(p, "S50,0,0,0Z'/></clipPath><rect x=")      p := add(32, p)
                mstore(p, "'-300' y='-300' width='600' heig")      p := add(32, p)
                mstore(p, "ht='600' style='fill:url(#x13)' ")      p := add(32, p)
                mstore(p, "clip-path='url(#x32)'/><g id='x3")      p := add(32, p)
                mstore(p, "3'><animateMotion dur='31s' repe")      p := add(32, p)
                mstore(p, "atCount='indefinite' path='M0,3c")      p := add(32, p)
                mstore(p, "0,-3,2,3,2,0c0,-3-2,3-2,0Z'/><cl")      p := add(32, p)
                mstore(p, "ipPath id='x34' clipPathUnits='u")      p := add(32, p)
                mstore(p, "serSpaceOnUse'><path d='"        )      p := add(24, p)
            }case 41 {
                mstore(p, "Z'/></clipPath><rect x='-300' y=")      p := add(32, p)
                mstore(p, "'-300' width='600' height='600' ")      p := add(32, p)
                mstore(p, "style='fill:url(#x14)' clip-path")      p := add(32, p)
                mstore(p, "='url(#x34)'/></g></g><g><g tran")      p := add(32, p)
                mstore(p, "sform='scale(-1,1)'><rect x='-30")      p := add(32, p)
                mstore(p, "0' y='-300' width='600' height='")      p := add(32, p)
                mstore(p, "600' style='fill:url(#x12)' clip")      p := add(32, p)
                mstore(p, "-path='url(#x32)'/><use xlink:hr")      p := add(32, p)
                mstore(p, "ef='#x33'/></g></g></g><g style=")      p := add(32, p)
                mstore(p, "'filter:url(#x24)'><clipPath id=")      p := add(32, p)
                mstore(p, "'x35' clipPathUnits='userSpaceOn")      p := add(32, p)
                mstore(p, "Use'><path d='"                  )      p := add(14, p)
            }case 42 {
                mstore(p, "z'/></clipPath><g clip-path='url")      p := add(32, p)
                mstore(p, "(#x35)'><rect x='-300' y='-300' ")      p := add(32, p)
                mstore(p, "width='600' height='600' style='")      p := add(32, p)
                mstore(p, "fill:url(#x3)'/><g opacity='"    )      p := add(28, p)
            }case 43 {
                mstore(p, "'><ellipse style='fill:url(#x4)'")      p := add(32, p)
                mstore(p, " cx='0' cy='"                    )      p := add(12, p)
            }case 44 {
                mstore(p, "' rx='60' ry='60'/></g><g opacit")      p := add(32, p)
                mstore(p, "y='"                             )      p := add(3, p)
            }case 45 {
                mstore(p, "'><path style='fill:url(#x4);str")      p := add(32, p)
                mstore(p, "oke:url(#x4);stroke-linejoin:rou")      p := add(32, p)
                mstore(p, "nd;stroke-linecap:round;stroke-w")      p := add(32, p)
                mstore(p, "idth:6' d='M0,"                  )      p := add(14, p)
            }case 46 {
                mstore(p, "L-124,"                          )      p := add(6, p)
            }case 47 {
                mstore(p, "L124,"                           )      p := add(5, p)
            }case 48 {
                mstore(p, "'><ellipse style='fill:url(#x4)'")      p := add(32, p)
                mstore(p, " cx='10' cy='"                   )      p := add(13, p)
            }case 49 {
                mstore(p, "' rx='11' ry='11'/><ellipse styl")      p := add(32, p)
                mstore(p, "e='fill:url(#x4)' cx='-10' cy='" )      p := add(31, p)
            }case 50 {
                mstore(p, "' rx='11' ry='11'/></g><g opacit")      p := add(32, p)
                mstore(p, "y='"                             )      p := add(3, p)
            }case 51 {
                mstore(p, "'><path style='fill:url(#x4)' d=")      p := add(32, p)
                mstore(p, "'"                               )      p := add(1, p)
            }case 52 {
                mstore(p, "L150,-150Z'/></g><g opacity='"   )      p := add(29, p)
            }case 53 {
                mstore(p, "'><ellipse style='fill:url(#x6)'")      p := add(32, p)
                mstore(p, " cx='-68' cy='"                  )      p := add(14, p)
            }case 54 {
                mstore(p, "' rx='75' ry='100'/></g><g opaci")      p := add(32, p)
                mstore(p, "ty='"                            )      p := add(4, p)
            }case 55 {
                mstore(p, "'><path style='fill:url(#x4);str")      p := add(32, p)
                mstore(p, "oke:url(#x4);stroke-linejoin:rou")      p := add(32, p)
                mstore(p, "nd;stroke-linecap:round;stroke-w")      p := add(32, p)
                mstore(p, "idth:12' d='M-16,"               )      p := add(17, p)
            }case 56 {
                mstore(p, "L16,"                            )      p := add(4, p)
            }case 57 {
                mstore(p, "'><path style='fill:url(#x4);str")      p := add(32, p)
                mstore(p, "oke:url(#x4);stroke-linejoin:rou")      p := add(32, p)
                mstore(p, "nd;stroke-linecap:round;stroke-w")      p := add(32, p)
                mstore(p, "idth:12' d='M0,5L-16,"           )      p := add(21, p)
            }case 58 {
                mstore(p, "'><ellipse style='fill:url(#x9)'")      p := add(32, p)
                mstore(p, " cx='0' cy='"                    )      p := add(12, p)
            }case 59 {
                mstore(p, "' rx='16' ry='35'/><ellipse styl")      p := add(32, p)
                mstore(p, "e='fill:url(#x10)' cx='-76' cy='")      p := add(32, p)
            }case 60 {
                mstore(p, "' rx='70' ry='100'/><ellipse sty")      p := add(32, p)
                mstore(p, "le='fill:url(#x9)' cx='76' cy='" )      p := add(31, p)
            }case 61 {
                mstore(p, "' rx='70' ry='100'/></g><g><path")      p := add(32, p)
                mstore(p, " opacity='"                      )      p := add(10, p)
            }case 62 {
                mstore(p, "' id='x36' style='fill:url(#x5);")      p := add(32, p)
                mstore(p, "filter:url(#x25)' d='M"          )      p := add(22, p)
            }case 63 {
                mstore(p, "c60,0,60,5,60,5c0,5,-60,5,-60,5z")      p := add(32, p)
                mstore(p, "'/><use xlink:href='#x36' transf")      p := add(32, p)
                mstore(p, "orm='translate(0,14)'/><use xlin")      p := add(32, p)
                mstore(p, "k:href='#x36' transform='transla")      p := add(32, p)
                mstore(p, "te(0,-14)'/><use xlink:href='#x3")      p := add(32, p)
                mstore(p, "6' transform='translate(0,0) sca")      p := add(32, p)
                mstore(p, "le(-1,1)'/><use xlink:href='#x36")      p := add(32, p)
                mstore(p, "' transform='translate(0,14) sca")      p := add(32, p)
                mstore(p, "le(-1,1)'/><use xlink:href='#x36")      p := add(32, p)
                mstore(p, "' transform='translate(0,-14) sc")      p := add(32, p)
                mstore(p, "ale(-1,1)'/><path opacity='"     )      p := add(27, p)
            }case 64 {
                mstore(p, "' id='x37' style='fill:url(#x5);")      p := add(32, p)
                mstore(p, "filter:url(#x25)' d='M-20,"      )      p := add(26, p)
            }case 65 {
                mstore(p, "c0,60,5,60,5,60c5,0,5,-60,5,-60z")      p := add(32, p)
                mstore(p, "'/><use xlink:href='#x37' transf")      p := add(32, p)
                mstore(p, "orm='translate(15,4)'/><use xlin")      p := add(32, p)
                mstore(p, "k:href='#x37' transform='transla")      p := add(32, p)
                mstore(p, "te(30,0)'/></g></g></g></g><g><g")      p := add(32, p)
                mstore(p, " transform='translate("          )      p := add(22, p)
            }case 66 {
                mstore(p, ") translate(-"                   )      p := add(13, p)
            }case 67 {
                mstore(p, ",-"                              )      p := add(2, p)
            }case 68 {
                mstore(p, ")'><clipPath id='x38' clipPathUn")      p := add(32, p)
                mstore(p, "its='userSpaceOnUse'><path id='x")      p := add(32, p)
                mstore(p, "39' transform='translate("       )      p := add(25, p)
            }case 69 {
                mstore(p, ") scale(1,1) rotate("            )      p := add(20, p)
            }case 70 {
                mstore(p, ")' d='"                          )      p := add(6, p)
            }case 71 {
                mstore(p, "z'><animate attributeName='d' ty")      p := add(32, p)
                mstore(p, "pe='xml' repeatCount='indefinite")      p := add(32, p)
                mstore(p, "' dur='4s' keyTimes='0;0.4;0.5;0")      p := add(32, p)
                mstore(p, ".6;1' values=' "                 )      p := add(15, p)
            }case 72 {
                mstore(p, " "                               )      p := add(1, p)
            }case 73 {
                mstore(p, " z; "                            )      p := add(4, p)
            }case 74 {
                mstore(p, " z '/></path></clipPath><rect x=")      p := add(32, p)
                mstore(p, "'-300' y='-300' width='600' heig")      p := add(32, p)
                mstore(p, "ht='600' style='fill:url(#x16)' ")      p := add(32, p)
                mstore(p, "clip-path='url(#x38)'/><g clip-p")      p := add(32, p)
                mstore(p, "ath='url(#x38)'><g transform='tr")      p := add(32, p)
                mstore(p, "anslate("                        )      p := add(8, p)
            }case 75 {
                mstore(p, ")'><g id='x40'><ellipse style='f")      p := add(32, p)
                mstore(p, "ill:url(#x18)' cx='"             )      p := add(19, p)
            }case 76 {
                mstore(p, "' cy='"                          )      p := add(6, p)
            }case 77 {
                mstore(p, "' rx='"                          )      p := add(6, p)
            }case 78 {
                mstore(p, "' ry='"                          )      p := add(6, p)
            }case 79 {
                mstore(p, "'><animateMotion dur='20s' repea")      p := add(32, p)
                mstore(p, "tCount='indefinite' path='M0,0c0")      p := add(32, p)
                mstore(p, ",-5,3,5,3,0c0,-10-6,10-6,0Z'/></")      p := add(32, p)
                mstore(p, "ellipse><g><g transform='transla")      p := add(32, p)
                mstore(p, "te("                             )      p := add(3, p)
            }case 80 {
                mstore(p, ")'><circle r='25' transform='sca")      p := add(32, p)
                mstore(p, "le(0.15)' style='fill:url(#x19);")      p := add(32, p)
                mstore(p, "filter:url(#x27)'/></g><g transf")      p := add(32, p)
                mstore(p, "orm='translate("                 )      p := add(15, p)
            }case 81 {
                mstore(p, ")'><circle r='15' transform='sca")      p := add(32, p)
                mstore(p, "le(0.15)' style='fill:url(#x19);")      p := add(32, p)
                mstore(p, "filter:url(#x27)'/></g></g></g><")      p := add(32, p)
                mstore(p, "/g></g><use id='x41' xlink:href=")      p := add(32, p)
                mstore(p, "'#x39' style='stroke-width:2;str")      p := add(32, p)
                mstore(p, "oke:url(#x17);fill:transparent'/")      p := add(32, p)
                mstore(p, "></g><g transform='translate(-"  )      p := add(30, p)
            }case 82 {
                mstore(p, ") translate("                    )      p := add(12, p)
            }case 83 {
                mstore(p, ")'><rect x='-300' y='-300' width")      p := add(32, p)
                mstore(p, "='600' height='600' transform='s")      p := add(32, p)
                mstore(p, "cale(-1,1)' style='fill:url(#x15")      p := add(32, p)
                mstore(p, ")' clip-path='url(#x38)'/><g cli")      p := add(32, p)
                mstore(p, "p-path='url(#x38)' transform='sc")      p := add(32, p)
                mstore(p, "ale(-1,1)'><g transform='transla")      p := add(32, p)
                mstore(p, "te("                             )      p := add(3, p)
            }case 84 {
                mstore(p, ") scale(-1,1)'><use xlink:href='")      p := add(32, p)
                mstore(p, "#x40'/></g></g><use xlink:href='")      p := add(32, p)
                mstore(p, "#x41' transform='scale(-1,1)'/><")      p := add(32, p)
                mstore(p, "/g></g><g transform='translate(0")      p := add(32, p)
                mstore(p, ","                               )      p := add(1, p)
            }case 85 {
                mstore(p, ")'><g transform='translate(0,0)'")      p := add(32, p)
                mstore(p, "><g transform='translate(0,0)'><")      p := add(32, p)
                mstore(p, "path style='fill:none;stroke:url")      p := add(32, p)
                mstore(p, "(#x20);stroke-width:1.5' d='"    )      p := add(28, p)
            }case 86 {
                mstore(p, "'/><path id='x42' style='fill:no")      p := add(32, p)
                mstore(p, "ne;stroke:url(#x20);stroke-width")      p := add(32, p)
                mstore(p, ":1.5' d='"                       )      p := add(9, p)
            }case 87 {
                mstore(p, "'/><use xlink:href='#x42' transf")      p := add(32, p)
                mstore(p, "orm='scale(-1,1)'/><g opacity='" )      p := add(31, p)
            }case 88 {
                mstore(p, "' transform='translate(0,0)'><g ")      p := add(32, p)
                mstore(p, "id='x43' transform='translate("  )      p := add(30, p)
            }case 89 {
                mstore(p, ")'><path style='fill:none;stroke")      p := add(32, p)
                mstore(p, ":url(#x23);stroke-width:0.8' tra")      p := add(32, p)
                mstore(p, "nsform='rotate("                 )      p := add(15, p)
            }case 90 {
                mstore(p, "'/><path style='fill:none;stroke")      p := add(32, p)
                mstore(p, ":url(#x23);stroke-width:0.8' tra")      p := add(32, p)
                mstore(p, "nsform='rotate("                 )      p := add(15, p)
            }case 91 {
                mstore(p, "'/><path style='fill:none;stroke")      p := add(32, p)
                mstore(p, ":url(#x23);stroke-width:0.8' opa")      p := add(32, p)
                mstore(p, "city='"                          )      p := add(6, p)
            }case 92 {
                mstore(p, "' transform='rotate("            )      p := add(20, p)
            }case 93 {
                mstore(p, "'/></g><use xlink:href='#x43' tr")      p := add(32, p)
                mstore(p, "ansform='scale(-1,1)'/></g></g><")      p := add(32, p)
                mstore(p, "/g></g><g transform='translate(0")      p := add(32, p)
                mstore(p, ",0)'><path style='fill:url(#x21)")      p := add(32, p)
                mstore(p, ";stroke:url(#x21);stroke-linejoi")      p := add(32, p)
                mstore(p, "n:round;stroke-width:1' d='"     )      p := add(27, p)
            }case 94 {
                mstore(p, "Z'/><path id='x44' style='fill:u")      p := add(32, p)
                mstore(p, "rl(#x22);stroke:url(#x21);stroke")      p := add(32, p)
                mstore(p, "-linejoin:round;stroke-width:1' ")      p := add(32, p)
                mstore(p, "d='"                             )      p := add(3, p)
            }case 95 {
                mstore(p, "'/><use xlink:href='#x44' transf")      p := add(32, p)
                mstore(p, "orm='scale(-1,1)'/></g></g></g><")      p := add(32, p)
                mstore(p, "/svg>"                           )      p := add(5, p)
            }

            mstore(0x00, p)
        }
    
writeOutput_text(0)
mstore(add(pVars, 0x03e0), selectBreed(rvs))
mstore(add(pVars, 0xa0), selectData_palette(rvs, mload(add(pVars, 0x03e0))))
writeOutput_color(getFieldValue_palette_c_bg(mload(add(pVars, 0xa0))))
writeOutput_text(1)
mstore(add(pVars, 0x0140), selectData_bodyParts(getBreedData_i_body(mload(add(pVars, 0x03e0)))))
mstore(add(pVars, 0x100), getBreedData_f_useBodyColorForCorner(mload(add(pVars, 0x03e0))))
mstore(add(pVars, 0xc0), and(slt(getRvsValue(rvs, 0x0b), 0x80), getBreedData_f_swapMarkColors(mload(add(pVars, 0x03e0)))))
mstore(add(pVars, 0x0120), getFieldValue_bodyParts_bodyParts_corners(mload(add(pVars, 0x0140))))

// 30 bytes (function + call)
// getFieldValue_palette_c_prim : JUMPDEST PUSH1 0xFF PUSH1 0x20 DUP3 SWAP1 SHR AND PUSH2 0x1983 DUP2 PUSH2 0x637 JUMP 
// call: JUMPDEST SWAP4 POP PUSH2 0x4CF3 PUSH1 0xA0 DUP8 ADD MLOAD PUSH2 0x19BC JUMP
slot1 := getFieldValue_palette_c_prim(mload(add(pVars, 0xa0)))

slot0 := getFieldValue_palette_c_sec(mload(add(pVars, 0xa0)))
mstore(add(pVars, 0xe0), getFieldValue_palette_c_body(mload(add(pVars, 0xa0))))
slot2 := ternary(mload(add(pVars, 0xc0)), slot1, slot0)
writeOutput_color(ternary(and(mload(add(pVars, 0x0120)), not(mload(add(pVars, 0x100)))), mload(add(pVars, 0xe0)), slot2))
writeOutput_text(2)
mstore(add(pVars, 0x0400), selectData_faceParts(getBreedData_i_face(mload(add(pVars, 0x03e0)))))
slot3 := getBreedData_f_calico(mload(add(pVars, 0x03e0)))
mstore(add(pVars, 0x04a0), getFieldValue_faceParts_faceParts_mask(mload(add(pVars, 0x0400))))
slot4 := getFieldValue_palette_c_face(mload(add(pVars, 0xa0)))
writeOutput_color(ternary(and(mload(add(pVars, 0x04a0)), not(slot3)), slot4, slot2))
writeOutput_text(3)
writeOutput_color(slot2)
writeOutput_text(4)
slot1 := ternary(mload(add(pVars, 0xc0)), slot0, slot1)
writeOutput_color(slot1)
writeOutput_text(5)
mstore(add(pVars, 0xc0), ternary(slot3, slot2, slot1))
writeOutput_color(mload(add(pVars, 0xc0)))
writeOutput_text(6)
slot0 := ternary(and(mload(add(pVars, 0x0120)), mload(add(pVars, 0x100))), mload(add(pVars, 0xe0)), slot2)
writeOutput_color(ternary(and(mload(add(pVars, 0x0120)), slot3), slot0, slot1))
writeOutput_text(7)
writeOutput_color(slot0)
writeOutput_text(8)
writeOutput_color(ternary(and(mload(add(pVars, 0x04a0)), slot3), slot4, slot2))
writeOutput_text(9)
writeOutput_color(ternary(and(mload(add(pVars, 0x04a0)), slot3), slot4, slot1))
writeOutput_text(10)
writeOutput_color(0x01000080)
writeOutput_text(11)
mstore(add(pVars, 0x04e0), getFieldValue_faceParts_faceParts_temple(mload(add(pVars, 0x0400))))
slot0 := getFieldValue_palette_c_ear(mload(add(pVars, 0xa0)))
writeOutput_color(ternary(slot3, ternary(mload(add(pVars, 0x04e0)), slot0, mload(add(pVars, 0xc0))), slot1))
writeOutput_text(12)
mstore(add(pVars, 0x04c0), getFieldValue_faceParts_faceParts_ear(mload(add(pVars, 0x0400))))
writeOutput_color(ternary(slot3, ternary(mload(add(pVars, 0x04c0)), slot0, slot2), slot2))
writeOutput_text(13)
writeOutput_color(getFieldValue_palette_c_earIn(mload(add(pVars, 0xa0))))
writeOutput_text(14)
slot3 := slt(getRvsValue(rvs, 0x0c), 0x0d)
slot4 := slt(getRvsValue(rvs, 0x0e), 0x80)
slot1 := getBreedData_i_eyeColorMain(mload(add(pVars, 0x03e0)))
slot0 := getBreedData_i_eyeColorHeterochromia(mload(add(pVars, 0x03e0)))
slot2 := getFieldValue_eyeColor_c_eye(ternary(and(sgt(slot0, 0), slot3), slot1, 0))
slot0 := getFieldValue_eyeColor_c_eye(ternary(and(sgt(slot0, 0), slot3), slot1, slot0))
writeOutput_color(ternary(slot4, slot0, slot2))
writeOutput_text(15)
writeOutput_color(ternary(slot4, slot2, slot0))
writeOutput_text(16)
writeOutput_color(getFieldValue_palette_c_eyeline(mload(add(pVars, 0xa0))))
writeOutput_text(17)
slot0 := getBreedData_f_zombieEyes(mload(add(pVars, 0x03e0)))
writeOutput_color(ternary(slot0, 0, 0xffffff))
writeOutput_text(18)
writeOutput_color(ternary(slot0, 0xffffff, 0xffffff00))
writeOutput_text(19)
writeOutput_color(0x333333)
writeOutput_text(20)
writeOutput_color(getFieldValue_palette_c_mouth(mload(add(pVars, 0xa0))))
writeOutput_text(19)
writeOutput_color(0xdb7093)
writeOutput_text(19)
writeOutput_color(0xe38fab)
writeOutput_text(21)
writeOutput_color(getFieldValue_palette_c_nose(mload(add(pVars, 0xa0))))
writeOutput_text(22)
writeOutput_color(getFieldValue_palette_c_noseIn(mload(add(pVars, 0xa0))))
writeOutput_text(23)
writeOutput_color(getFieldValue_palette_c_whiskers(mload(add(pVars, 0xa0))))
writeOutput_text(19)
writeOutput_color(0x505050)
writeOutput_text(24)
mstore(add(pVars, 0x02c0), selectData_head(rvs, mload(add(pVars, 0x03e0))))
mstore(add(pVars, 0x0320), getFieldValue_head_chkx(mload(add(pVars, 0x02c0))))
mstore(add(pVars, 0x0360), getFieldValue_head_chky(mload(add(pVars, 0x02c0))))
mstore(add(pVars, 0x03a0), getFieldValue_head_bw_100(mload(add(pVars, 0x02c0))))
mstore(add(pVars, 0x0420), getFieldValue_head_chny(mload(add(pVars, 0x02c0))))
slot1 := average(mload(add(pVars, 0x0360)), mload(add(pVars, 0x0420)))
slot0 := sdiv(sdiv(mul(getFieldValue_head_chnc_100(mload(add(pVars, 0x02c0))), sub(slot1, mload(add(pVars, 0x0360)))), 0x64), sub(0, mload(add(pVars, 0x0320))))
mstore(add(pVars, 0x0480), average(mload(add(pVars, 0x0320)), add(average(mload(add(pVars, 0x0320)), 0), mul(slot0, sub(mload(add(pVars, 0x0420)), mload(add(pVars, 0x0360)))))))
mstore(add(pVars, 0x0460), sdiv(mul(getFieldValue_head_chno_100(mload(add(pVars, 0x02c0))), mload(add(pVars, 0x0320))), 0x64))
slot3 := bezierPoint_100(mload(add(pVars, 0x0320)), mload(add(pVars, 0x0480)), mload(add(pVars, 0x0460)), 0, mload(add(pVars, 0x03a0)))
writeOutput_int(sub(0, add(slot3, 0x0a)))
writeOutput_text(25)
mstore(add(pVars, 0x0440), average(mload(add(pVars, 0x0360)), sub(slot1, mul(slot0, sub(0, mload(add(pVars, 0x0320)))))))
mstore(add(pVars, 0xa0), bezierPoint_100(mload(add(pVars, 0x0360)), mload(add(pVars, 0x0440)), mload(add(pVars, 0x0420)), mload(add(pVars, 0x0420)), mload(add(pVars, 0x03a0))))
slot0 := sub(mload(add(pVars, 0xa0)), 0x32)
writeOutput_int(slot0)
writeOutput_text(26)
writeOutput_int(sub(slot3, 0x0a))
writeOutput_text(25)
writeOutput_int(slot0)
writeOutput_text(26)
writeOutput_int(add(slot3, 0x1e))
writeOutput_text(25)
slot0 := add(mload(add(pVars, 0xa0)), 0x96)
writeOutput_int(slot0)
writeOutput_text(26)
writeOutput_int(sub(0, sub(slot3, 0x1e)))
writeOutput_text(25)
writeOutput_int(slot0)
writeOutput_text(27)
writeOutput_int(ternary(getFieldValue_bodyParts_bodyParts_stripes(mload(add(pVars, 0x0140))), 0, 0x1))
writeOutput_text(28)
slot1 := lerp_100(0x32, 0, mload(add(pVars, 0x03a0)))
slot2 := add(slot3, 0x1e)
slot0 := add(mload(add(pVars, 0xa0)), 0x07)
writeOutput_bezier(slot2, slot0, sdiv(mul(slot2, 0x04), 0x0a), add(slot0, mul(slot1, 0x02)), sdiv(mul(sub(0, slot2), 0x04), 0x0a), add(slot0, mul(slot1, 0x02)), sub(0, slot2), slot0)
writeOutput_text(29)
writeOutput_int(ternary(mload(add(pVars, 0x0120)), 0, 0x1))
writeOutput_text(30)
slot1 := lerp_100(slot3, add(slot3, 0x1e), lerp_100(0x28, 0x0a, mload(add(pVars, 0x03a0))))
writeOutput_int(sub(0, slot1))
writeOutput_text(25)
slot0 := lerp_100(mload(add(pVars, 0xa0)), add(mload(add(pVars, 0xa0)), 0x96), lerp_100(0x28, 0x0a, mload(add(pVars, 0x03a0))))
writeOutput_int(slot0)
writeOutput_text(26)
writeOutput_int(sub(0, add(slot1, 0x6e)))
writeOutput_text(25)
slot4 := add(slot0, 0x96)
writeOutput_int(slot4)
writeOutput_text(26)
writeOutput_int(sub(0, sub(slot1, 0x1e)))
writeOutput_text(25)
slot2 := add(slot0, 0x96)
writeOutput_int(slot2)
writeOutput_text(31)
writeOutput_int(slot1)
writeOutput_text(25)
writeOutput_int(slot0)
writeOutput_text(26)
writeOutput_int(sub(slot1, 0x6e))
writeOutput_text(25)
writeOutput_int(slot4)
writeOutput_text(26)
writeOutput_int(add(slot1, 0x1e))
writeOutput_text(25)
writeOutput_int(slot2)
writeOutput_text(32)
writeOutput_int(ternary(getFieldValue_bodyParts_bodyParts_tabby(mload(add(pVars, 0x0140))), 0, 0x1))
writeOutput_text(33)
writeOutput_int(sub(sub(0, add(slot3, sdiv(mul(mul(sub(0x1, sdiv(mload(add(pVars, 0x03a0)), 0x64)), 0x2a), 0x1e), 0x64))), 0x1a))
writeOutput_text(25)
writeOutput_int(sub(add(mload(add(pVars, 0xa0)), sdiv(mul(mul(sub(0x1, sdiv(mload(add(pVars, 0x03a0)), 0x64)), 0x2a), 0x96), 0x64)), 0x14))
writeOutput_text(34)
writeOutput_int(ternary(getFieldValue_bodyParts_bodyParts_necktie(mload(add(pVars, 0x0140))), 0, 0x1))
writeOutput_text(35)
slot0 := lerp_100(0x46, 0, mload(add(pVars, 0x03a0)))
writeOutput_int(sub(0, add(slot3, slot0)))
writeOutput_text(25)
writeOutput_int(mload(add(pVars, 0xa0)))
writeOutput_text(36)
writeOutput_int(sub(slot3, slot0))
writeOutput_text(26)
writeOutput_int(slot3)
writeOutput_text(25)
writeOutput_int(add(mload(add(pVars, 0xa0)), mul(slot0, 0x05)))
writeOutput_text(36)
writeOutput_int(sub(0, slot3))
writeOutput_text(32)
writeOutput_int(ternary(getFieldValue_bodyParts_bodyParts_belly(mload(add(pVars, 0x0140))), 0, 0x1))
writeOutput_text(37)
writeOutput_int(sdiv(lerp_100(0x64, 0x32, mload(add(pVars, 0x03a0))), 0x02))
writeOutput_text(38)
writeOutput_int(ternary(slt(getRvsValue(rvs, 0x0a), 0x80), 0x1, sub(0, 0x1)))
writeOutput_text(39)
mstore(add(pVars, 0x0120), selectData_ear(rvs, mload(add(pVars, 0x03e0))))
mstore(add(pVars, 0x0260), getFieldValue_head_fhy(mload(add(pVars, 0x02c0))))
slot2 := getFieldValue_ear_eso_100(mload(add(pVars, 0x0120)))
mstore(add(pVars, 0x01a0), getFieldValue_head_tplx(mload(add(pVars, 0x02c0))))
mstore(add(pVars, 0x01c0), getFieldValue_head_tply(mload(add(pVars, 0x02c0))))
slot1 := average(mload(add(pVars, 0x0260)), mload(add(pVars, 0x01c0)))
slot0 := sdiv(sub(slot1, mload(add(pVars, 0x0260))), sub(mload(add(pVars, 0x01a0)), 0))
mstore(add(pVars, 0x0340), sdiv(mul(mload(add(pVars, 0x01a0)), 0x04), 0x0a))
mstore(add(pVars, 0x0300), average(mload(add(pVars, 0x01a0)), add(average(0, mload(add(pVars, 0x01a0))), mul(slot0, sub(mload(add(pVars, 0x01c0)), mload(add(pVars, 0x0260)))))))
mstore(add(pVars, 0x02e0), average(mload(add(pVars, 0x01c0)), sub(slot1, mul(slot0, sub(mload(add(pVars, 0x01a0)), 0)))))
mstore(add(pVars, 0x02a0), bezierPoint_100(0, mload(add(pVars, 0x0340)), mload(add(pVars, 0x0300)), mload(add(pVars, 0x01a0)), slot2))
mstore(add(pVars, 0x0280), bezierPoint_100(mload(add(pVars, 0x0260)), mload(add(pVars, 0x0260)), mload(add(pVars, 0x02e0)), mload(add(pVars, 0x01c0)), slot2))
writeOutput(vertex(mload(add(pVars, 0x02a0)), mload(add(pVars, 0x0280))))
slot0 := getFieldValue_head_eeo_100(mload(add(pVars, 0x02c0)))
mstore(add(pVars, 0xa0), getFieldValue_ear_eb_100(mload(add(pVars, 0x0120))))
mstore(add(pVars, 0x0180), getFieldValue_ear_ebr_100(mload(add(pVars, 0x0120))))
mstore(add(pVars, 0x0200), getFieldValue_ear_esc_100(mload(add(pVars, 0x0120))))
mstore(add(pVars, 0x0240), bezierPoint_100(mload(add(pVars, 0x01a0)), mload(add(pVars, 0x0300)), mload(add(pVars, 0x0340)), 0, slot0))
mstore(add(pVars, 0x0220), bezierPoint_100(mload(add(pVars, 0x01c0)), mload(add(pVars, 0x02e0)), mload(add(pVars, 0x0260)), mload(add(pVars, 0x0260)), slot0))
mstore(add(pVars, 0x0140), add(mload(add(pVars, 0x0240)), getFieldValue_ear_etox(mload(add(pVars, 0x0120)))))
mstore(add(pVars, 0x0160), sub(mload(add(pVars, 0x0220)), getFieldValue_ear_etoy(mload(add(pVars, 0x0120)))))
mstore(add(pVars, 0xc0), lerp_100(mload(add(pVars, 0x0140)), mload(add(pVars, 0x02a0)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), sub(0, constrain(mload(add(pVars, 0x0180)), sub(0, 0x64), 0))), 0x64), 0x64))))
slot4 := lerp_100(mload(add(pVars, 0x0160)), mload(add(pVars, 0x0280)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), sub(0, constrain(mload(add(pVars, 0x0180)), sub(0, 0x64), 0))), 0x64), 0x64)))
slot1 := add(average(mload(add(pVars, 0x02a0)), mload(add(pVars, 0xc0))), sdiv(mul(mload(add(pVars, 0x0200)), sub(slot4, mload(add(pVars, 0x0280)))), 0x64))
slot0 := sub(average(mload(add(pVars, 0x0280)), slot4), sdiv(mul(mload(add(pVars, 0x0200)), sub(mload(add(pVars, 0xc0)), mload(add(pVars, 0x02a0)))), 0x64))
writeOutput(bezierVertex(average(mload(add(pVars, 0x02a0)), slot1), average(mload(add(pVars, 0x0280)), slot0), average(mload(add(pVars, 0xc0)), slot1), average(slot4, slot0), mload(add(pVars, 0xc0)), slot4))
slot0 := getFieldValue_ear_etc_100(mload(add(pVars, 0x0120)))
slot2 := lerp_100(mload(add(pVars, 0x0140)), mload(add(pVars, 0x0240)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), constrain(mload(add(pVars, 0x0180)), 0, 0x64)), 0x64), 0x64)))
slot1 := lerp_100(mload(add(pVars, 0x0160)), mload(add(pVars, 0x0220)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), constrain(mload(add(pVars, 0x0180)), 0, 0x64)), 0x64), 0x64)))
slot3 := add(average(mload(add(pVars, 0xc0)), slot2), sdiv(mul(slot0, sub(slot1, slot4)), 0x64))
slot0 := sub(average(slot4, slot1), sdiv(mul(slot0, sub(slot2, mload(add(pVars, 0xc0)))), 0x64))
writeOutput(bezierVertex(average(mload(add(pVars, 0xc0)), slot3), average(slot4, slot0), average(slot2, slot3), average(slot1, slot0), slot2, slot1))
mstore(add(pVars, 0x01e0), getFieldValue_ear_eec_100(mload(add(pVars, 0x0120))))
slot3 := add(average(slot2, mload(add(pVars, 0x0240))), sdiv(mul(mload(add(pVars, 0x01e0)), sub(mload(add(pVars, 0x0220)), slot1)), 0x64))
slot0 := sub(average(slot1, mload(add(pVars, 0x0220))), sdiv(mul(mload(add(pVars, 0x01e0)), sub(mload(add(pVars, 0x0240)), slot2)), 0x64))
writeOutput(bezierVertex(average(slot2, slot3), average(slot1, slot0), average(mload(add(pVars, 0x0240)), slot3), average(mload(add(pVars, 0x0220)), slot0), mload(add(pVars, 0x0240)), mload(add(pVars, 0x0220))))
writeOutput_text(40)
slot0 := getFieldValue_ear_esi_100(mload(add(pVars, 0x0120)))
mstore(add(pVars, 0xe0), lerp_100(mload(add(pVars, 0x02a0)), mload(add(pVars, 0x0240)), slot0))
slot3 := lerp_100(mload(add(pVars, 0x0280)), mload(add(pVars, 0x0220)), slot0)
writeOutput(vertex(mload(add(pVars, 0xe0)), slot3))
slot1 := getFieldValue_ear_eti_100(mload(add(pVars, 0x0120)))
slot0 := getFieldValue_ear_eei_100(mload(add(pVars, 0x0120)))
mstore(add(pVars, 0x100), lerp_100(mload(add(pVars, 0x02a0)), mload(add(pVars, 0x0240)), sub(0x64, slot0)))
mstore(add(pVars, 0xc0), lerp_100(mload(add(pVars, 0x0280)), mload(add(pVars, 0x0220)), sub(0x64, slot0)))
mstore(add(pVars, 0x03c0), average(mload(add(pVars, 0xe0)), mload(add(pVars, 0x100))))
mstore(add(pVars, 0x0380), average(slot3, mload(add(pVars, 0xc0))))
mstore(add(pVars, 0x0140), add(lerp_100(mload(add(pVars, 0x03c0)), mload(add(pVars, 0x0140)), slot1), sdiv(getFieldValue_ear_eito_100(mload(add(pVars, 0x0120))), 0x64)))
mstore(add(pVars, 0x0160), lerp_100(mload(add(pVars, 0x0380)), mload(add(pVars, 0x0160)), slot1))
slot4 := lerp_100(mload(add(pVars, 0x0140)), mload(add(pVars, 0xe0)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), sub(0, constrain(mload(add(pVars, 0x0180)), sub(0, 0x64), 0))), 0x64), 0x64)))
slot2 := lerp_100(mload(add(pVars, 0x0160)), slot3, add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), sub(0, constrain(mload(add(pVars, 0x0180)), sub(0, 0x64), 0))), 0x64), 0x64)))
slot1 := add(average(mload(add(pVars, 0xe0)), slot4), sdiv(mul(mload(add(pVars, 0x0200)), sub(slot2, slot3)), 0x64))
slot0 := sub(average(slot3, slot2), sdiv(mul(mload(add(pVars, 0x0200)), sub(slot4, mload(add(pVars, 0xe0)))), 0x64))
writeOutput(bezierVertex(average(mload(add(pVars, 0xe0)), slot1), average(slot3, slot0), average(slot4, slot1), average(slot2, slot0), slot4, slot2))
slot1 := getFieldValue_ear_eitc_100(mload(add(pVars, 0x0120)))
slot3 := lerp_100(mload(add(pVars, 0x0140)), mload(add(pVars, 0x100)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), constrain(mload(add(pVars, 0x0180)), 0, 0x64)), 0x64), 0x64)))
slot0 := lerp_100(mload(add(pVars, 0x0160)), mload(add(pVars, 0xc0)), add(mload(add(pVars, 0xa0)), sdiv(sdiv(mul(mul(ceil_100(mload(add(pVars, 0xa0))), sub(0x50, mload(add(pVars, 0xa0)))), constrain(mload(add(pVars, 0x0180)), 0, 0x64)), 0x64), 0x64)))
mstore(add(pVars, 0xa0), add(average(slot4, slot3), sdiv(mul(slot1, sub(slot0, slot2)), 0x64)))
slot1 := sub(average(slot2, slot0), sdiv(mul(slot1, sub(slot3, slot4)), 0x64))
writeOutput(bezierVertex(average(slot4, mload(add(pVars, 0xa0))), average(slot2, slot1), average(slot3, mload(add(pVars, 0xa0))), average(slot0, slot1), slot3, slot0))
slot2 := add(average(slot3, mload(add(pVars, 0x100))), sdiv(mul(mload(add(pVars, 0x01e0)), sub(mload(add(pVars, 0xc0)), slot0)), 0x64))
slot1 := sub(average(slot0, mload(add(pVars, 0xc0))), sdiv(mul(mload(add(pVars, 0x01e0)), sub(mload(add(pVars, 0x100)), slot3)), 0x64))
writeOutput(bezierVertex(average(slot3, slot2), average(slot0, slot1), average(mload(add(pVars, 0x100)), slot2), average(mload(add(pVars, 0xc0)), slot1), mload(add(pVars, 0x100)), mload(add(pVars, 0xc0))))
writeOutput_text(41)
writeOutput(vertex(0, mload(add(pVars, 0x0260))))
writeOutput(bezierVertex(mload(add(pVars, 0x0340)), mload(add(pVars, 0x0260)), mload(add(pVars, 0x0300)), mload(add(pVars, 0x02e0)), mload(add(pVars, 0x01a0)), mload(add(pVars, 0x01c0))))
mstore(add(pVars, 0xc0), getFieldValue_head_chko_100(mload(add(pVars, 0x02c0))))
slot1 := average(mload(add(pVars, 0x01a0)), mload(add(pVars, 0x0320)))
slot2 := average(mload(add(pVars, 0x01c0)), mload(add(pVars, 0x0360)))
slot0 := sdiv(getFieldValue_head_chkc_100(mload(add(pVars, 0x02c0))), 0x64)
slot3 := add(slot1, mul(slot0, sub(mload(add(pVars, 0x0360)), mload(add(pVars, 0x01c0)))))
slot4 := sub(slot2, mul(slot0, sub(mload(add(pVars, 0x0320)), mload(add(pVars, 0x01a0)))))
slot1 := sub(slot1, mul(slot0, sub(mload(add(pVars, 0x0360)), mload(add(pVars, 0x01c0)))))
slot0 := add(slot2, mul(slot0, sub(mload(add(pVars, 0x0320)), mload(add(pVars, 0x01a0)))))
mstore(add(pVars, 0xa0), average(mload(add(pVars, 0x01a0)), lerp_100(slot3, slot1, mload(add(pVars, 0xc0)))))
slot2 := average(mload(add(pVars, 0x01c0)), lerp_100(slot4, slot0, mload(add(pVars, 0xc0))))
slot1 := average(mload(add(pVars, 0x0320)), lerp_100(slot1, slot3, 0x64))
slot0 := average(mload(add(pVars, 0x0360)), lerp_100(slot0, slot4, 0x64))
writeOutput(bezierVertex(mload(add(pVars, 0xa0)), slot2, slot1, slot0, mload(add(pVars, 0x0320)), mload(add(pVars, 0x0360))))
writeOutput(bezierVertex(mload(add(pVars, 0x0480)), mload(add(pVars, 0x0440)), mload(add(pVars, 0x0460)), mload(add(pVars, 0x0420)), 0, mload(add(pVars, 0x0420))))
writeOutput(bezierVertex(sub(0, mload(add(pVars, 0x0460))), mload(add(pVars, 0x0420)), sub(0, mload(add(pVars, 0x0480))), mload(add(pVars, 0x0440)), sub(0, mload(add(pVars, 0x0320))), mload(add(pVars, 0x0360))))
writeOutput(bezierVertex(sub(0, slot1), slot0, sub(0, mload(add(pVars, 0xa0))), slot2, sub(0, mload(add(pVars, 0x01a0))), mload(add(pVars, 0x01c0))))
writeOutput(bezierVertex(sub(0, mload(add(pVars, 0x0300))), mload(add(pVars, 0x02e0)), sub(0, mload(add(pVars, 0x0340))), mload(add(pVars, 0x0260)), sub(0, 0), mload(add(pVars, 0x0260))))
writeOutput_text(42)
writeOutput_int(ternary(getFieldValue_faceParts_faceParts_round(mload(add(pVars, 0x0400))), 0, 0x1))
writeOutput_text(43)
mstore(add(pVars, 0x02c0), selectData_eye(rvs, mload(add(pVars, 0x03e0))))
mstore(add(pVars, 0x0140), add(getFieldValue_eye_no(mload(add(pVars, 0x02c0))), 0x25))
writeOutput_int(add(mload(add(pVars, 0x0140)), 0x3c))
writeOutput_text(44)
writeOutput_int(ternary(getFieldValue_faceParts_faceParts_triangle(mload(add(pVars, 0x0400))), 0, 0x1))
writeOutput_text(45)
writeOutput_int(mload(add(pVars, 0x0140)))
writeOutput_text(46)
slot0 := add(mload(add(pVars, 0x0140)), 0x64)
writeOutput_int(slot0)
writeOutput_text(47)
writeOutput_int(slot0)
writeOutput_text(32)
writeOutput_int(ternary(getFieldValue_faceParts_faceParts_whiskers(mload(add(pVars, 0x0400))), 0, 0x1))
writeOutput_text(48)
slot0 := add(mload(add(pVars, 0x0140)), 0x06)
writeOutput_int(slot0)
writeOutput_text(49)
writeOutput_int(slot0)
writeOutput_text(50)
writeOutput_int(ternary(mload(add(pVars, 0x04c0)), 0, 0x1))
writeOutput_text(51)
writeOutput(vertex(mload(add(pVars, 0x02a0)), mload(add(pVars, 0x0280))))
writeOutput(bezierVertex(sub(mload(add(pVars, 0x03c0)), 0x14), add(mload(add(pVars, 0x0380)), 0x0f), add(mload(add(pVars, 0x03c0)), 0x0f), add(mload(add(pVars, 0x0380)), 0x0f), mload(add(pVars, 0x0240)), mload(add(pVars, 0x0220))))
writeOutput_text(52)
writeOutput_int(ternary(mload(add(pVars, 0x04e0)), 0, 0x1))
writeOutput_text(53)
mstore(add(pVars, 0x0200), getFieldValue_eye_eyoy(mload(add(pVars, 0x02c0))))
writeOutput_int(sub(mload(add(pVars, 0x0200)), 0x48))
writeOutput_text(54)
writeOutput_int(ternary(getFieldValue_faceParts_faceParts_chin(mload(add(pVars, 0x0400))), 0, 0x1))
writeOutput_text(55)
slot0 := add(mload(add(pVars, 0x0140)), 0x05)
writeOutput_int(slot0)
writeOutput_text(56)
writeOutput_int(slot0)
writeOutput_text(26)
slot1 := lerp_100(0x28, 0x0a, mload(add(pVars, 0x03a0)))
writeOutput_int(slot1)
writeOutput_text(25)
slot0 := add(mload(add(pVars, 0x0140)), 0x50)
writeOutput_int(slot0)
writeOutput_text(26)
writeOutput_int(sub(0, slot1))
writeOutput_text(25)
writeOutput_int(slot0)
writeOutput_text(32)
writeOutput_int(ternary(getFieldValue_faceParts_faceParts_nose(mload(add(pVars, 0x0400))), 0, 0x1))
writeOutput_text(57)
slot0 := add(mload(add(pVars, 0x0140)), 0x05)
writeOutput_int(slot0)
writeOutput_text(56)
writeOutput_int(slot0)
writeOutput_text(32)
writeOutput_int(ternary(mload(add(pVars, 0x04a0)), 0, 0x1))
writeOutput_text(58)
writeOutput_int(mload(add(pVars, 0x0260)))
writeOutput_text(59)
slot0 := sub(mload(add(pVars, 0x0200)), 0x32)
writeOutput_int(slot0)
writeOutput_text(60)
writeOutput_int(slot0)
writeOutput_text(61)
slot0 := not(sgt(getRvsValue(rvs, 0x0f), getBreedData_b_tabbyFaceOdds(mload(add(pVars, 0x03e0)))))
writeOutput_int(ternary(slot0, 0, 0x1))
writeOutput_text(62)
writeOutput_int(sub(0, add(mload(add(pVars, 0x0320)), 0x1e)))
writeOutput_text(25)
writeOutput_int(sub(mload(add(pVars, 0x0360)), 0x05))
writeOutput_text(63)
writeOutput_int(ternary(slot0, 0, 0x1))
writeOutput_text(64)
writeOutput_int(sub(mload(add(pVars, 0x0260)), 0x1e))
writeOutput_text(65)
mstore(add(pVars, 0x01a0), getFieldValue_eye_eyox(mload(add(pVars, 0x02c0))))
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(25)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(66)
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(67)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(68)
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(25)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(69)
writeOutput_int(sdiv(mul(mul(mul(0x64, 0xb4), 0x013a), getFieldValue_eye_eyr_100(mload(add(pVars, 0x02c0)))), 0x64))
writeOutput_text(70)
slot4 := getFieldValue_eye_eyw(mload(add(pVars, 0x02c0)))
slot3 := sub(0, slot4)
mstore(add(pVars, 0x100), vertex(sub(slot3, 0), 0))
writeOutput(mload(add(pVars, 0x100)))
slot0 := getFieldValue_eye_eyt(mload(add(pVars, 0x02c0)))
slot1 := getFieldValue_eye_eyb(mload(add(pVars, 0x02c0)))
mstore(add(pVars, 0x0120), lerp_100(sub(0, slot0), slot1, mul(0, 0x64)))
mstore(add(pVars, 0x0240), sdiv(mul(0x32, slot3), 0x64))
mstore(add(pVars, 0xe0), bezierVertex(slot3, sdiv(mul(0x32, mload(add(pVars, 0x0120))), 0x64), mload(add(pVars, 0x0240)), mload(add(pVars, 0x0120)), 0, mload(add(pVars, 0x0120))))
writeOutput(mload(add(pVars, 0xe0)))
mstore(add(pVars, 0x0220), sdiv(mul(0x32, slot4), 0x64))
mstore(add(pVars, 0xc0), bezierVertex(mload(add(pVars, 0x0220)), mload(add(pVars, 0x0120)), slot4, sdiv(mul(0x32, mload(add(pVars, 0x0120))), 0x64), add(slot4, 0x04), 0))
writeOutput(mload(add(pVars, 0xc0)))
mstore(add(pVars, 0xa0), lerp_100(slot1, sub(0, slot0), mul(0, 0x64)))
mstore(add(pVars, 0x01e0), sdiv(mul(0x32, mload(add(pVars, 0xa0))), 0x64))
mstore(add(pVars, 0x01c0), sdiv(mul(0x32, slot4), 0x64))
slot2 := bezierVertex(slot4, mload(add(pVars, 0x01e0)), mload(add(pVars, 0x01c0)), mload(add(pVars, 0xa0)), 0, mload(add(pVars, 0xa0)))
writeOutput(slot2)
mstore(add(pVars, 0x0180), sdiv(mul(0x32, slot3), 0x64))
mstore(add(pVars, 0x0160), sdiv(mul(0x32, mload(add(pVars, 0xa0))), 0x64))
slot0 := bezierVertex(mload(add(pVars, 0x0180)), mload(add(pVars, 0xa0)), slot3, mload(add(pVars, 0x0160)), sub(slot3, 0), 0)
writeOutput(slot0)
writeOutput_text(71)
writeOutput(mload(add(pVars, 0x100)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xe0)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xc0)))
writeOutput_text(72)
writeOutput(slot2)
writeOutput_text(72)
writeOutput(slot0)
writeOutput_text(73)
writeOutput(mload(add(pVars, 0x100)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xe0)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xc0)))
writeOutput_text(72)
writeOutput(slot2)
writeOutput_text(72)
writeOutput(slot0)
writeOutput_text(73)
writeOutput(vertex(sub(slot3, 0), 0))
writeOutput_text(72)
writeOutput(bezierVertex(slot3, sdiv(slot1, 0x02), mload(add(pVars, 0x0240)), sdiv(slot1, 0x1), 0, sdiv(slot1, 0x1)))
writeOutput_text(72)
writeOutput(bezierVertex(mload(add(pVars, 0x0220)), sdiv(slot1, 0x1), slot4, sdiv(slot1, 0x02), add(slot4, 0x04), 0))
writeOutput_text(72)
writeOutput(bezierVertex(slot4, mload(add(pVars, 0x01e0)), mload(add(pVars, 0x01c0)), mload(add(pVars, 0xa0)), 0, mload(add(pVars, 0xa0))))
writeOutput_text(72)
writeOutput(bezierVertex(mload(add(pVars, 0x0180)), mload(add(pVars, 0xa0)), slot3, mload(add(pVars, 0x0160)), sub(slot3, 0), 0))
writeOutput_text(73)
writeOutput(mload(add(pVars, 0x100)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xe0)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xc0)))
writeOutput_text(72)
writeOutput(slot2)
writeOutput_text(72)
writeOutput(slot0)
writeOutput_text(73)
writeOutput(mload(add(pVars, 0x100)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xe0)))
writeOutput_text(72)
writeOutput(mload(add(pVars, 0xc0)))
writeOutput_text(72)
writeOutput(slot2)
writeOutput_text(72)
writeOutput(slot0)
writeOutput_text(74)
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(25)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(75)
slot2 := getFieldValue_eye_eypox(mload(add(pVars, 0x02c0)))
writeOutput_int(slot2)
writeOutput_text(76)
slot1 := getFieldValue_eye_eypoy(mload(add(pVars, 0x02c0)))
writeOutput_int(slot1)
writeOutput_text(77)
slot0 := selectData_pupil(rvs, mload(add(pVars, 0x03e0)))
writeOutput_int(sdiv(getFieldValue_pupil_eypw(slot0), 0x02))
writeOutput_text(78)
writeOutput_int(sdiv(getFieldValue_pupil_eyph(slot0), 0x02))
writeOutput_text(79)
writeOutput_int(sdiv(add(add(slot4, slot2), 0), 0x03))
writeOutput_text(25)
writeOutput_int(sdiv(add(mload(add(pVars, 0x0120)), add(slot1, 0)), 0x03))
writeOutput_text(80)
writeOutput_int(sdiv(add(slot3, add(slot2, 0)), 0x03))
writeOutput_text(25)
writeOutput_int(sdiv(add(add(mload(add(pVars, 0xa0)), slot1), 0), 0x03))
writeOutput_text(81)
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(25)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(82)
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(67)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(83)
writeOutput_int(mload(add(pVars, 0x01a0)))
writeOutput_text(25)
writeOutput_int(mload(add(pVars, 0x0200)))
writeOutput_text(84)
writeOutput_int(mload(add(pVars, 0x0140)))
writeOutput_text(85)
slot0 := selectData_mouth(rvs, mload(add(pVars, 0x03e0)))
slot3 := constrain(add(mload(add(pVars, 0x0140)), getFieldValue_mouth_mh(slot0)), mload(add(pVars, 0x0140)), mload(add(pVars, 0x0420)))
writeOutput(line(0, sub(mload(add(pVars, 0x0140)), mload(add(pVars, 0x0140))), 0, sub(slot3, mload(add(pVars, 0x0140)))))
writeOutput_text(86)
slot1 := getFieldValue_mouth_mc_100(slot0)
slot2 := getFieldValue_mouth_mox(slot0)
slot0 := constrain(add(slot3, getFieldValue_mouth_moy(slot0)), mload(add(pVars, 0x0140)), mload(add(pVars, 0x0420)))
slot4 := sub(average(0, slot2), sdiv(mul(slot1, sub(slot0, slot3)), 0x64))
slot1 := add(average(slot3, slot0), sdiv(mul(slot1, sub(slot2, 0)), 0x64))
writeOutput_bezier(0, sub(slot3, mload(add(pVars, 0x0140))), average(0, slot4), sub(average(slot3, slot1), mload(add(pVars, 0x0140))), average(slot2, slot4), sub(average(slot0, slot1), mload(add(pVars, 0x0140))), slot2, sub(slot0, mload(add(pVars, 0x0140))))
writeOutput_text(87)
writeOutput_int(ternary(getBreedData_f_whiskers(mload(add(pVars, 0x03e0))), 0, 0x1))
writeOutput_text(88)
slot2 := selectData_whisker(rvs, mload(add(pVars, 0x03e0)))
slot0 := getFieldValue_whisker_whox(slot2)
writeOutput_int(sdiv(mul(sub(0, slot0), 0x05), 0x0a))
writeOutput_text(25)
writeOutput_int(getFieldValue_whisker_whoy(slot2))
writeOutput_text(89)
writeOutput_int(sub(0, 0x11))
writeOutput_text(70)
slot1 := getFieldValue_whisker_whc_100(slot2)
mstore(add(pVars, 0xa0), sdiv(mul(0x96, slot0), 0x64))
slot4 := getFieldValue_whisker_wheox(slot2)
slot3 := getFieldValue_whisker_wheoy(slot2)
slot0 := add(average(mload(add(pVars, 0xa0)), slot4), sdiv(mul(slot1, sub(slot3, 0)), 0x64))
slot1 := sub(average(0, slot3), sdiv(mul(slot1, sub(slot4, mload(add(pVars, 0xa0)))), 0x64))
mstore(add(pVars, 0x0120), average(mload(add(pVars, 0xa0)), slot0))
mstore(add(pVars, 0x100), average(0, slot1))
mstore(add(pVars, 0xe0), average(slot4, slot0))
slot1 := average(slot3, slot1)
writeOutput_bezier(mload(add(pVars, 0xa0)), 0, mload(add(pVars, 0x0120)), mload(add(pVars, 0x100)), mload(add(pVars, 0xe0)), slot1, slot4, slot3)
writeOutput_text(90)
mstore(add(pVars, 0xc0), getFieldValue_whisker_wha_100(slot2))
writeOutput_int(sub(0, add(sdiv(mul(mul(0x39, 0x02), mload(add(pVars, 0xc0))), 0x64), 0x11)))
writeOutput_text(70)
writeOutput_bezier(mload(add(pVars, 0xa0)), 0, mload(add(pVars, 0x0120)), mload(add(pVars, 0x100)), sdiv(mul(mload(add(pVars, 0xe0)), 0x09), 0x0a), slot1, sdiv(mul(slot4, 0x09), 0x0a), slot3)
writeOutput_text(91)
slot0 := getFieldValue_whisker_whl(slot2)
writeOutput_int(ternary(sgt(slot0, 0x02), 0, 0x1))
writeOutput_text(92)
writeOutput_int(sub(0, add(sdiv(mul(mul(0x39, 0x1), mload(add(pVars, 0xc0))), 0x64), 0x11)))
writeOutput_text(70)
writeOutput_bezier(mload(add(pVars, 0xa0)), 0, mload(add(pVars, 0x0120)), mload(add(pVars, 0x100)), mload(add(pVars, 0xe0)), slot1, slot4, slot3)
writeOutput_text(91)
writeOutput_int(ternary(sgt(slot0, 0x03), 0, 0x1))
writeOutput_text(92)
writeOutput_int(sub(0, add(sdiv(mul(mul(0x39, 0x03), mload(add(pVars, 0xc0))), 0x64), 0x11)))
writeOutput_text(70)

// 50 bytes: JUMPDEST PUSH2 0x6FCD DUP3 PUSH1 0x64 PUSH1 0x4B DUP5 MUL SDIV DUP7 PUSH1 0x64 PUSH1 0x4B PUSH1 0xE0 DUP13 ADD MLOAD MUL SDIV PUSH2 0x100 DUP12 ADD MLOAD PUSH2 0x120 DUP13 ADD MLOAD PUSH1 0x0 PUSH1 0xA0 DUP15 ADD MLOAD PUSH2 0x1F60 JUMP 
writeOutput_bezier(mload(add(pVars, 0xa0)), 0, mload(add(pVars, 0x0120)), mload(add(pVars, 0x100)), sdiv(mul(mload(add(pVars, 0xe0)), 0x4b), 0x64), slot1, sdiv(mul(slot4, 0x4b), 0x64), slot3)
// 10 bytes: JUMPDEST PUSH2 0x6FD7 PUSH1 0x5D PUSH2 0x1FA9 JUMP
writeOutput_text(93)

writeOutput(vertex(0, mload(add(pVars, 0x0140))))
slot4 := sub(0, 0x09)
slot3 := sub(mload(add(pVars, 0x0140)), 0x0b)
slot0 := add(average(0, slot4), sdiv(mul(0x14, sub(slot3, mload(add(pVars, 0x0140)))), 0x64))
slot1 := sub(average(mload(add(pVars, 0x0140)), slot3), sdiv(mul(0x14, sub(slot4, 0)), 0x64))
mstore(add(pVars, 0x100), average(0, slot0))
mstore(add(pVars, 0xe0), average(mload(add(pVars, 0x0140)), slot1))
mstore(add(pVars, 0xc0), average(slot4, slot0))
mstore(add(pVars, 0xa0), average(slot3, slot1))
writeOutput(bezierVertex(mload(add(pVars, 0x100)), mload(add(pVars, 0xe0)), mload(add(pVars, 0xc0)), mload(add(pVars, 0xa0)), slot4, slot3))
slot0 := sub(mload(add(pVars, 0x0140)), 0x0b)
slot2 := add(average(slot4, 0x09), sdiv(mul(0x14, sub(slot0, slot3)), 0x64))
slot1 := sub(average(slot3, slot0), sdiv(mul(0x14, sub(0x09, slot4)), 0x64))
writeOutput(bezierVertex(average(slot4, slot2), average(slot3, slot1), average(0x09, slot2), average(slot0, slot1), 0x09, slot0))
slot2 := add(average(0x09, 0), sdiv(mul(0x14, sub(mload(add(pVars, 0x0140)), slot0)), 0x64))
slot1 := sub(average(slot0, mload(add(pVars, 0x0140))), sdiv(mul(0x14, sub(0, 0x09)), 0x64))
writeOutput(bezierVertex(average(0x09, slot2), average(slot0, slot1), average(0, slot2), average(mload(add(pVars, 0x0140)), slot1), 0, mload(add(pVars, 0x0140))))
writeOutput_text(94)
slot0 := bezierPoint_100(0, mload(add(pVars, 0x100)), mload(add(pVars, 0xc0)), slot4, 0x14)
slot1 := bezierPoint_100(mload(add(pVars, 0x0140)), mload(add(pVars, 0xe0)), mload(add(pVars, 0xa0)), slot3, 0x14)
writeOutput_bezier(slot0, slot1, add(slot0, 0x1), sub(slot1, sdiv(mul(0x28, 0x09), 0x64)), add(slot0, sdiv(mul(0x28, 0x09), 0x64)), sub(slot1, sdiv(mul(0x3c, 0x0b), 0x64)), bezierPoint_100(0, mload(add(pVars, 0x100)), mload(add(pVars, 0xc0)), slot4, 0x50), bezierPoint_100(mload(add(pVars, 0x0140)), mload(add(pVars, 0xe0)), mload(add(pVars, 0xa0)), slot3, 0x50))
writeOutput_text(95)

// END ---    

                // Set actual string length (pOutput - pOutputStart - uint256 length))
                mstore(pOutputStart, sub(sub(mload(0x00), pOutputStart), 0x20))
                // Set free memory pointer to after string
                mstore(0x40, mload(0x00))
            }

            output := generateSvgInner(_rvs)
        }

        return output;
    }
}