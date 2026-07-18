import db from '../database/dbpool.js';

export const createAddress = async (userId, addressData) => {
    const {
        label, firstName, lastName, phone,
        street, city, state, zipCode, country,
        isDefault = false
    } = addressData;

    if (isDefault) {
        await db.query(
            'UPDATE addresses SET isdefault = FALSE WHERE usersid = $1',
            [userId]
        );
    }

    const { rows } = await db.query(
        `INSERT INTO addresses (usersid, label, firstname, lastname, phone, street, city, state, zipcode, country, isdefault)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING addressid   AS "addressId",
                   usersid     AS "userId",
                   label,
                   firstname   AS "firstName",
                   lastname    AS "lastName",
                   phone,
                   street,
                   city,
                   state,
                   zipcode     AS "zipCode",
                   country,
                   isdefault   AS "isDefault",
                   createdat   AS "createdAt"`,
        [userId, label || '', firstName, lastName, phone || '', street, city, state, zipCode, country, isDefault]
    );
    return rows[0];
};

export const getAddressesByUserId = async (userId) => {
    const { rows } = await db.query(
        `SELECT addressid   AS "addressId",
                usersid     AS "userId",
                label,
                firstname   AS "firstName",
                lastname    AS "lastName",
                phone,
                street,
                city,
                state,
                zipcode     AS "zipCode",
                country,
                isdefault   AS "isDefault",
                createdat   AS "createdAt"
         FROM addresses
         WHERE usersid = $1
         ORDER BY isdefault DESC, createdat DESC`,
        [userId]
    );
    return rows;
};

export const getAddressById = async (addressId) => {
    const { rows } = await db.query(
        `SELECT addressid   AS "addressId",
                usersid     AS "userId",
                label,
                firstname   AS "firstName",
                lastname    AS "lastName",
                phone,
                street,
                city,
                state,
                zipcode     AS "zipCode",
                country,
                isdefault   AS "isDefault",
                createdat   AS "createdAt"
         FROM addresses
         WHERE addressid = $1`,
        [addressId]
    );
    return rows[0] || null;
};

export const updateAddress = async (addressId, userId, addressData) => {
    const {
        label, firstName, lastName, phone,
        street, city, state, zipCode, country,
        isDefault
    } = addressData;

    if (isDefault) {
        await db.query(
            'UPDATE addresses SET isdefault = FALSE WHERE usersid = $1 AND addressid != $2',
            [userId, addressId]
        );
    }

    const { rows } = await db.query(
        `UPDATE addresses
         SET label      = COALESCE($1, label),
             firstname  = COALESCE($2, firstname),
             lastname   = COALESCE($3, lastname),
             phone      = COALESCE($4, phone),
             street     = COALESCE($5, street),
             city       = COALESCE($6, city),
             state      = COALESCE($7, state),
             zipcode    = COALESCE($8, zipcode),
             country    = COALESCE($9, country),
             isdefault  = COALESCE($10, isdefault)
         WHERE addressid = $11 AND usersid = $12
         RETURNING addressid   AS "addressId",
                   usersid     AS "userId",
                   label,
                   firstname   AS "firstName",
                   lastname    AS "lastName",
                   phone,
                   street,
                   city,
                   state,
                   zipcode     AS "zipCode",
                   country,
                   isdefault   AS "isDefault",
                   createdat   AS "createdAt"`,
        [label, firstName, lastName, phone, street, city, state, zipCode, country, isDefault, addressId, userId]
    );
    return rows[0] || null;
};

export const deleteAddress = async (addressId, userId) => {
    const { rowCount } = await db.query(
        'DELETE FROM addresses WHERE addressid = $1 AND usersid = $2',
        [addressId, userId]
    );
    return rowCount > 0;
};
