import bf from 'buffer'
const md5 = require('md5');
const Buffer = bf.Buffer;
const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const util = {
    // Bit-wise rotate left
    rotl: function (n, b) {
        return (n << b) | (n >>> (32 - b));
    },
    // Bit-wise rotate right
    rotr: function (n, b) {
        return (n << (32 - b)) | (n >>> b);
    },
    // Swap big-endian to little-endian and vice versa
    endian: function (n) {
        // If number given, swap endian
        if (n.constructor == Number) {
            return util.rotl(n,  8) & 0x00FF00FF |
                   util.rotl(n, 24) & 0xFF00FF00;
        }

        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++)
            n[i] = util.endian(n[i]);
        return n;

    },
    // Generate an array of any length of random bytes
    randomBytes: function (n) {
        for (var bytes = []; n > 0; n--)
            bytes.push(Math.floor(Math.random() * 256));
        return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
        return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function (words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function (bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
    },

    // Convert a hex string to a byte array
    hexToBytes: function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function (bytes) {

        // Use browser-native function if it exists
        // if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

        for(var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 <= bytes.length * 8)
                    base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                else base64.push("=");
            }
        }

        return base64.join("");

    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function (base64) {

        // Use browser-native function if it exists
        // if (typeof atob == "function") return Binary.stringToBytes(atob(base64));

        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
                       (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
        }

        return bytes;

    },
    // Convert n to unsigned 32-bit integer
    u32: function (n) {
        return n >>> 0;
    },

    // Unsigned 32-bit addition
    add: function () {
        var result = this.u32(arguments[0]);
        for (var i = 1; i < arguments.length; i++)
            result = this.u32(result + this.u32(arguments[i]));
        return result;
    },

    // Unsigned 32-bit multiplication
    mult: function (m, n) {
        return this.add((n & 0xFFFF0000) * m,
                (n & 0x0000FFFF) * m);
    },
    // Unsigned 32-bit greater than (>) comparison
    gt: function (m, n) {
        return this.u32(m) > this.u32(n);
    },
    // Unsigned 32-bit less than (<) comparison
    lt: function (m, n) {
        return this.u32(m) < this.u32(n);
    }
};
// Precomputed SBOX
const SBOX = [ 0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
               0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
               0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
               0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
               0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
               0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
               0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
               0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
               0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
               0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
               0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
               0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
               0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
               0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
               0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
               0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
               0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
               0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
               0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
               0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
               0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
               0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
               0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
               0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
               0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
               0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
               0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
               0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
               0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
               0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
               0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
               0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 ];
// Compute inverse SBOX lookup table
for (var INVSBOX = [], i = 0; i < 256; i++) INVSBOX[SBOX[i]] = i;

// Compute mulitplication in GF(2^8) lookup tables
var MULT2 = [],
    MULT3 = [],
    MULT9 = [],
    MULTB = [],
    MULTD = [],
    MULTE = [];

function xtime(a, b) {
    for (var result = 0, i = 0; i < 8; i++) {
        if (b & 1) result ^= a;
        var hiBitSet = a & 0x80;
        a = (a << 1) & 0xFF;
        if (hiBitSet) a ^= 0x1b;
        b >>>= 1;
    }
    return result;
}

for (var i = 0; i < 256; i++) {
    MULT2[i] = xtime(i,2);
    MULT3[i] = xtime(i,3);
    MULT9[i] = xtime(i,9);
    MULTB[i] = xtime(i,0xB);
    MULTD[i] = xtime(i,0xD);
    MULTE[i] = xtime(i,0xE);
}

// Precomputed RCon lookup
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// Inner state
var state = [[], [], [], []],
    keylength,
    nrounds,
    keyschedule;

const AES = {
	/**
     * ??????????????? encodingAESKey
     *
     * @param encodingAESKey EncodingAESKey
     */
    parseEncodingAESKey: function(encodingAESKey) {
        const key = md5(encodingAESKey);
        /* istanbul ignore if */
        if (key.length !== 32) {
            throw new Error('invalid encodingAESKey');
        }
        var iv = key.slice(0, 16);
        return [ key, iv ];
    },
    pkcs7Pad: function(data) {
        var padLength = 32 - (data.length % 32);
        var result = Buffer.allocUnsafe(padLength);
        result.fill(padLength);
        return Buffer.concat([data, result]);
    },
    /**
     * Public API
     */
    encrypt: function ( encodingAESKey, message, random ) {
        var k_iv = AES.parseEncodingAESKey(encodingAESKey);
        var k = k_iv[0]
        var iv = k_iv[1]
        var
            // Convert to bytes if message is a string
            msg = Buffer.from(message),
            msgLength = Buffer.allocUnsafe(4);
        msgLength.writeUInt32BE(msg.length, 0);
        random = random || util.randomBytes(AES._blocksize * 4)
        var m = AES.pkcs7Pad( Buffer.concat([
            Buffer.from(random),
            msgLength,
            msg,
            // Buffer.from(id),
            Buffer.from(`${encodingAESKey}=`, 'base64')
        ]))
        // Generate random IV
        // Encrypt
        AES._init(k);
        AES._doEncrypt( m, iv);
        // Return ciphertext
        return util.bytesToBase64(m);

    },

    decrypt: function (encodingAESKey,ciphertext) {
        var k_iv = AES.parseEncodingAESKey(encodingAESKey);
        var k = k_iv[0]
        var iv = k_iv[1]
        var
            // Convert to bytes if ciphertext is a string
            c = (
                ciphertext.constructor == String ?
                util.base64ToBytes(ciphertext):
                ciphertext
            )
        // Decrypt
        AES._init(k);
        AES._doDecrypt(c, iv);
        var cbuf = Buffer.from(c)
        var length = cbuf.readUInt32BE(16);
        return {
            message: cbuf.slice(20, length + 20).toString(),
            random: cbuf.slice(0, 16),
        };
    },
    _doEncrypt: function ( m, iv) {
	    var blockSizeInBytes = AES._blocksize * 4;

	    // Encrypt each block
	    for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
	        if (offset == 0) {
	            // XOR first block using IV
	            for (var i = 0; i < blockSizeInBytes; i++)
	            m[i] ^= iv[i];
	        } else {
	            // XOR this block using previous crypted block
	            for (var i = 0; i < blockSizeInBytes; i++)
	            m[offset + i] ^= m[offset + i - blockSizeInBytes];
	        }
	        // Encrypt block
	        AES._encryptblock(m, offset);
	    }
	},
	_doDecrypt: function (c, iv) {
	    var blockSizeInBytes = AES._blocksize * 4;

	    // At the start, the previously crypted block is the IV
	    var prevCryptedBlock = iv;

	    // Decrypt each block
	    for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
	        // Save this crypted block
	        var thisCryptedBlock = c.slice(offset, offset + blockSizeInBytes);
	        // Decrypt block
	        AES._decryptblock(c, offset);
	        // XOR decrypted block using previous crypted block
	        for (var i = 0; i < blockSizeInBytes; i++) {
	            c[offset + i] ^= prevCryptedBlock[i];
	        }
	        prevCryptedBlock = thisCryptedBlock;
	    }
	},
    /**
     * Package private methods and properties
     */

    _blocksize: 4,

    _encryptblock: function (m, offset) {

        // Set input
        for (var row = 0; row < AES._blocksize; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] = m[offset + col * 4 + row];
        }

        // Add round key
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] ^= keyschedule[col][row];
        }

        for (var round = 1; round < nrounds; round++) {

            // Sub bytes
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++)
                    state[row][col] = SBOX[state[row][col]];
            }

            // Shift rows
            state[1].push(state[1].shift());
            state[2].push(state[2].shift());
            state[2].push(state[2].shift());
            state[3].unshift(state[3].pop());

            // Mix columns
            for (var col = 0; col < 4; col++) {

                var s0 = state[0][col],
                    s1 = state[1][col],
                    s2 = state[2][col],
                    s3 = state[3][col];

                state[0][col] = MULT2[s0] ^ MULT3[s1] ^ s2 ^ s3;
                state[1][col] = s0 ^ MULT2[s1] ^ MULT3[s2] ^ s3;
                state[2][col] = s0 ^ s1 ^ MULT2[s2] ^ MULT3[s3];
                state[3][col] = MULT3[s0] ^ s1 ^ s2 ^ MULT2[s3];

            }

            // Add round key
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++)
                    state[row][col] ^= keyschedule[round * 4 + col][row];
            }

        }

        // Sub bytes
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] = SBOX[state[row][col]];
        }

        // Shift rows
        state[1].push(state[1].shift());
        state[2].push(state[2].shift());
        state[2].push(state[2].shift());
        state[3].unshift(state[3].pop());

        // Add round key
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] ^= keyschedule[nrounds * 4 + col][row];
        }

        // Set output
        for (var row = 0; row < AES._blocksize; row++) {
            for (var col = 0; col < 4; col++)
                m[offset + col * 4 + row] = state[row][col];
        }

    },

    _decryptblock: function (c, offset) {

        // Set input
        for (var row = 0; row < AES._blocksize; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] = c[offset + col * 4 + row];
        }

        // Add round key
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] ^= keyschedule[nrounds * 4 + col][row];
        }

        for (var round = 1; round < nrounds; round++) {

            // Inv shift rows
            state[1].unshift(state[1].pop());
            state[2].push(state[2].shift());
            state[2].push(state[2].shift());
            state[3].push(state[3].shift());

            // Inv sub bytes
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++)
                    state[row][col] = INVSBOX[state[row][col]];
            }

            // Add round key
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++)
                    state[row][col] ^= keyschedule[(nrounds - round) * 4 + col][row];
            }

            // Inv mix columns
            for (var col = 0; col < 4; col++) {

                var s0 = state[0][col],
                    s1 = state[1][col],
                    s2 = state[2][col],
                    s3 = state[3][col];

                state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
                state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
                state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
                state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];

            }

        }

        // Inv shift rows
        state[1].unshift(state[1].pop());
        state[2].push(state[2].shift());
        state[2].push(state[2].shift());
        state[3].push(state[3].shift());

        // Inv sub bytes
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] = INVSBOX[state[row][col]];
        }

        // Add round key
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++)
                state[row][col] ^= keyschedule[col][row];
        }

        // Set output
        for (var row = 0; row < AES._blocksize; row++) {
            for (var col = 0; col < 4; col++)
                c[offset + col * 4 + row] = state[row][col];
        }

    },


    /**
     * Private methods
     */

    _init: function (k) {
        keylength = k.length / 4;
        nrounds = keylength + 6;
        AES._keyexpansion(k);
    },

    // Generate a key schedule
    _keyexpansion: function (k) {

        keyschedule = [];

        for (var row = 0; row < keylength; row++) {
            keyschedule[row] = [
                k[row * 4],
                k[row * 4 + 1],
                k[row * 4 + 2],
                k[row * 4 + 3]
            ];
        }

        for (var row = keylength; row < AES._blocksize * (nrounds + 1); row++) {

            var temp = [
                keyschedule[row - 1][0],
                keyschedule[row - 1][1],
                keyschedule[row - 1][2],
                keyschedule[row - 1][3]
            ];

            if (row % keylength == 0) {

                // Rot word
                temp.push(temp.shift());

                // Sub word
                temp[0] = SBOX[temp[0]];
                temp[1] = SBOX[temp[1]];
                temp[2] = SBOX[temp[2]];
                temp[3] = SBOX[temp[3]];

                temp[0] ^= RCON[row / keylength];

            } else if (keylength > 6 && row % keylength == 4) {

                // Sub word
                temp[0] = SBOX[temp[0]];
                temp[1] = SBOX[temp[1]];
                temp[2] = SBOX[temp[2]];
                temp[3] = SBOX[temp[3]];

            }

            keyschedule[row] = [
                keyschedule[row - keylength][0] ^ temp[0],
                keyschedule[row - keylength][1] ^ temp[1],
                keyschedule[row - keylength][2] ^ temp[2],
                keyschedule[row - keylength][3] ^ temp[3]
            ];
        }
    }
};
export const AES_Encrypt = async(key, message) => {
    return AES.encrypt(key, message);
}

export const AES_Decrypt = async(key, encryptMessage) => {
    return AES.decrypt( key, encryptMessage);
}