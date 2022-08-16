#
#  Panoramix v4 Oct 2019 
#  Decompiled source of 0x03D37AD26961D79E52c3dAEa840C0095Fb4729a7
# 
#  Let's make the world open source 
# 

const unknown774237fc = 0x843c3a00fa95510a35f425371231fd3fe4642e719cb4595160763d6d02594b50
const unknowna217fddf = 0
const ADMIN_ROLE = 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775

def storage:
  unknown248a9ca3 is mapping of struct at storage 0
  stor2 is uint256 at storage 2
  stor3 is array of struct at storage 3
  stor4 is mapping of uint256 at storage 4

def unknown248a9ca3(uint256 _param1) payable: 
  require calldata.size - 4 >= 32
  return unknown248a9ca3[_param1].field_512

def unknown9010d07c(uint256 _param1, uint256 _param2) payable: 
  require calldata.size - 4 >= 64
  if _param2 >= unknown248a9ca3[_param1].field_0:
      revert with 0x8c379a000000000000000000000000000000000000000000000000000000000, 
                  32,
                  34,
                  0xfe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64,
                  mem[198 len 30]
  return unknown248a9ca3[_param1][_param2].field_0

def unknown91d14854(uint256 _param1, addr _param2) payable: 
  require calldata.size - 4 >= 64
  return bool(unknown248a9ca3[_param1][1][addr(_param2)].field_0)

def unknownca15c873(uint256 _param1) payable: 
  require calldata.size - 4 >= 32
  return unknown248a9ca3[_param1].field_0

#
#  Regular functions
#

def _fallback() payable: # default function
  revert

def unknownbe111772(uint256 _param1) payable: 
  require calldata.size - 4 >= 32
  if not unknown248a9ca3[0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775][1][caller].field_0:
      revert with 0, 'NOPE'
  if _param1 <= 0:
      revert with 0, 'lvl!>0'
  stor2 = _param1

def unknowneb27ec13(array _param1) payable: 
  require calldata.size - 4 >= 32
  require _param1 <= 4294967296
  require _param1 + 36 <= calldata.size
  require _param1.length <= 4294967296 and _param1 + _param1.length + 36 <= calldata.size
  if not unknown248a9ca3[0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775][1][caller].field_0:
      revert with 0, 'NOPE'
  create2 contract with 0 wei
                  salt: 0
                  code: _param1[all]
  require ext_code.size(create2.new_address)
  require not stor4[addr(create2.new_address)]
  stor3.length++
  stor3[stor3.length].field_0 = addr(create2.new_address)
  stor3[stor3.length].field_160 = 0
  stor4[addr(create2.new_address)] = stor3.length

def unknowna0632461(addr _param1) payable: 
  require calldata.size - 4 >= 32
  if not unknown248a9ca3[0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775][1][caller].field_0:
      revert with 0, 'NOPE'
  require ext_code.size(_param1)
  call _param1.clear() with:
       gas gas_remaining wei
  if not ext_call.success:
      revert with ext_call.return_data[0 len return_data.size]
  require stor4[addr(_param1)]
  require stor3.length - 1 < stor3.length
  require stor4[addr(_param1)] - 1 < stor3.length
  stor3[stor4[addr(_param1)]].field_0 = stor3[stor3.length].field_0
  stor4[stor3[stor3.length].field_0] = stor4[addr(_param1)]
  require stor3.length
  stor3[stor3.length].field_0 = 0
  stor3.length--
  stor4[addr(_param1)] = 0

def unknown2f2ff15d(uint256 _param1, addr _param2) payable: 
  require calldata.size - 4 >= 64
  if not unknown248a9ca3[unknown248a9ca3[_param1].field_512][1][caller].field_0:
      revert with 0x8c379a000000000000000000000000000000000000000000000000000000000, 
                  32,
                  47,
                  0x73416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e2061646d696e20746f206772616e,
                  mem[211 len 17]
  if not unknown248a9ca3[_param1][1][addr(_param2)].field_0:
      unknown248a9ca3[_param1].field_0++
      unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0 = _param2
      unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_160 = 0
      unknown248a9ca3[_param1][1][addr(_param2)].field_0 = unknown248a9ca3[_param1].field_0
      log 0x2f878811: _param1, _param2, caller

def unknown36568abe(uint256 _param1, addr _param2) payable: 
  require calldata.size - 4 >= 64
  if _param2 != caller:
      revert with 0x8c379a000000000000000000000000000000000000000000000000000000000, 
                  32,
                  47,
                  0x65416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636520726f6c657320666f722073656c,
                  mem[211 len 17]
  if unknown248a9ca3[_param1][1][addr(_param2)].field_0:
      require unknown248a9ca3[_param1].field_0 - 1 < unknown248a9ca3[_param1].field_0
      require unknown248a9ca3[_param1][1][addr(_param2)].field_0 - 1 < unknown248a9ca3[_param1].field_0
      unknown248a9ca3[_param1][unknown248a9ca3[_param1][1][addr(_param2)].field_0].field_0 = unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0
      unknown248a9ca3[_param1][1][unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0].field_0 = unknown248a9ca3[_param1][1][addr(_param2)].field_0
      require unknown248a9ca3[_param1].field_0
      unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0 = 0
      unknown248a9ca3[_param1].field_0--
      unknown248a9ca3[_param1][1][addr(_param2)].field_0 = 0
      log 0xf6391f5c: _param1, _param2, caller

def unknowne3852eca(array _param1, addr _param2) payable: 
  require calldata.size - 4 >= 64
  require _param1 <= 4294967296
  require _param1 + 36 <= calldata.size
  require _param1.length <= 4294967296 and _param1 + _param1.length + 36 <= calldata.size
  if not unknown248a9ca3[0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775][1][caller].field_0:
      revert with 0, 'NOPE'
  require ext_code.size(_param2)
  call _param2.clear() with:
       gas gas_remaining wei
  if not ext_call.success:
      revert with ext_call.return_data[0 len return_data.size]
  require stor4[addr(_param2)]
  require stor3.length - 1 < stor3.length
  require stor4[addr(_param2)] - 1 < stor3.length
  stor3[stor4[addr(_param2)]].field_0 = stor3[stor3.length].field_0
  stor4[stor3[stor3.length].field_0] = stor4[addr(_param2)]
  require stor3.length
  stor3[stor3.length].field_0 = 0
  stor3.length--
  stor4[addr(_param2)] = 0
  if not unknown248a9ca3[0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775][1][caller].field_0:
      revert with 0, 'NOPE'
  create2 contract with 0 wei
                  salt: 0
                  code: _param1[all]
  require ext_code.size(create2.new_address)
  require not stor4[addr(create2.new_address)]
  stor3.length++
  stor3[stor3.length].field_0 = addr(create2.new_address)
  stor3[stor3.length].field_160 = 0
  stor4[addr(create2.new_address)] = stor3.length

def unknownd547741f(uint256 _param1, addr _param2) payable: 
  require calldata.size - 4 >= 64
  if not unknown248a9ca3[unknown248a9ca3[_param1].field_512][1][caller].field_0:
      revert with 0x8c379a000000000000000000000000000000000000000000000000000000000, 
                  32,
                  48,
                  0x74416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e2061646d696e20746f207265766f6b,
                  mem[212 len 16]
  if unknown248a9ca3[_param1][1][addr(_param2)].field_0:
      require unknown248a9ca3[_param1].field_0 - 1 < unknown248a9ca3[_param1].field_0
      require unknown248a9ca3[_param1][1][addr(_param2)].field_0 - 1 < unknown248a9ca3[_param1].field_0
      unknown248a9ca3[_param1][unknown248a9ca3[_param1][1][addr(_param2)].field_0].field_0 = unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0
      unknown248a9ca3[_param1][1][unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0].field_0 = unknown248a9ca3[_param1][1][addr(_param2)].field_0
      require unknown248a9ca3[_param1].field_0
      unknown248a9ca3[_param1][unknown248a9ca3[_param1].field_0].field_0 = 0
      unknown248a9ca3[_param1].field_0--
      unknown248a9ca3[_param1][1][addr(_param2)].field_0 = 0
      log 0xf6391f5c: _param1, _param2, caller

def unknown990c8f79() payable: 
  mem[0] = caller
  mem[32] = sha3(0x843c3a00fa95510a35f425371231fd3fe4642e719cb4595160763d6d02594b50, 0) + 1
  if not unknown248a9ca3[0x843c3a00fa95510a35f425371231fd3fe4642e719cb4595160763d6d02594b50][1][caller].field_0:
      revert with 0, 'NOPE'
  if stor3.length <= 0:
      revert with 0, 'EMPTY'
  if stor2 <= 0:
      revert with 0, 'E!>0'
  mem[128] = block.number
  mem[160] = block.coinbase << 96
  mem[180] = block.difficulty
  mem[212] = block.hash(block.number - 1)
  mem[244] = tx.origin << 96
  mem[264] = block.gasprice
  mem[296] = block.timestamp
  mem[328] = 0
  mem[96] = 232
  mem[64] = 360
  idx = 0
  s = 0
  while idx < stor2:
      require stor3.length
      if s + sha3(mem[128 len mem[96]]) % stor3.length >= stor3.length:
          revert with 0, 32, 34, 0xfe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64, mem[mem[64] + 102 len 30]
      mem[0] = 3
      mem[mem[64]] = 0x990c8f7900000000000000000000000000000000000000000000000000000000
      require ext_code.size(stor3[s + sha3(mem[128 len mem[96]]) % stor3.length].field_0)
      static call stor3[s + sha3(mem[128 len mem[96]]) % stor3.length].field_0.0x990c8f79 with:
              gas gas_remaining wei
      mem[mem[64]] = ext_call.return_data[0]
      if not ext_call.success:
          revert with ext_call.return_data[0 len return_data.size]
      require return_data.size >= 32
      mem[mem[64] + 32] = s + sha3(mem[128 len mem[96]])
      mem[mem[64] + 64] = idx
      mem[mem[64] + 96] = block.timestamp
      mem[mem[64] + 128] = ext_call.return_data[0]
      _36 = mem[64]
      mem[mem[64]] = 128
      mem[64] = mem[64] + 160
      idx = idx + 1
      s = sha3(mem[_36 + 32 len mem[_36]])
      continue 
  mem[mem[64]] = sha3(mem[128 len mem[96]]) + (_38 * stor2)
  return memory
    from mem[64]
     len 32

def unknownbd36cd0c(uint256 _param1, uint256 _param2) payable: 
  require calldata.size - 4 >= 64
  mem[0] = caller
  mem[32] = sha3(0x843c3a00fa95510a35f425371231fd3fe4642e719cb4595160763d6d02594b50, 0) + 1
  if not unknown248a9ca3[0x843c3a00fa95510a35f425371231fd3fe4642e719cb4595160763d6d02594b50][1][caller].field_0:
      revert with 0, 'NOPE'
  if stor3.length <= 0:
      revert with 0, 'EMPTY'
  if _param2 <= 0:
      revert with 0, 'E!>0'
  mem[128] = block.number
  mem[160] = block.coinbase << 96
  mem[180] = block.difficulty
  mem[212] = block.hash(block.number - 1)
  mem[244] = tx.origin << 96
  mem[264] = block.gasprice
  mem[296] = block.timestamp
  mem[328] = _param1
  mem[96] = 232
  mem[64] = 360
  idx = 0
  s = 0
  while idx < _param2:
      require stor3.length
      if s + sha3(mem[128 len mem[96]]) % stor3.length >= stor3.length:
          revert with 0, 32, 34, 0xfe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64, mem[mem[64] + 102 len 30]
      mem[0] = 3
      mem[mem[64]] = 0x990c8f7900000000000000000000000000000000000000000000000000000000
      require ext_code.size(stor3[s + sha3(mem[128 len mem[96]]) % stor3.length].field_0)
      static call stor3[s + sha3(mem[128 len mem[96]]) % stor3.length].field_0.0x990c8f79 with:
              gas gas_remaining wei
      mem[mem[64]] = ext_call.return_data[0]
      if not ext_call.success:
          revert with ext_call.return_data[0 len return_data.size]
      require return_data.size >= 32
      mem[mem[64] + 32] = s + sha3(mem[128 len mem[96]])
      mem[mem[64] + 64] = idx
      mem[mem[64] + 96] = block.timestamp
      mem[mem[64] + 128] = ext_call.return_data[0]
      _36 = mem[64]
      mem[mem[64]] = 128
      mem[64] = mem[64] + 160
      idx = idx + 1
      s = sha3(mem[_36 + 32 len mem[_36]])
      continue 
  mem[mem[64]] = sha3(mem[128 len mem[96]]) + (_38 * _param2)
  return memory
    from mem[64]
     len 32

