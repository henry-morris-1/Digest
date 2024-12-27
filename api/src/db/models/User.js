const crypto = require('crypto');

module.exports = class User {
    id = null;
    username = null;
    #passwordHash = null;;
    #salt = null;;

    constructor(data) {
        this.id = data.user_id;
        this.username = data.username;
        this.#passwordHash = data.password;
        this.#salt = data.salt;
    }

    /**
     * Hashes a password and salt together to validate it for this user
     * @param {String} password Password for the hash
     * @returns This user if the password is valid
     */
    validatePassword(password) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject("Error: " +err);
                }

                const digest = derivedKey.toString('hex');
                if (this.#passwordHash === digest) {
                    resolve(this);
                } else {
                    reject("Invalid username or password");
                }
            });
        });
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username
        }
    }
};