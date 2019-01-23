module.exports = (DataTypes) =>  {
    return {
        created: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
            validate: { len: [11] }
        },
        updated: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
            validate: { len: [11] }
        },
        deleted: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
            validate: { len: [11] }
        },
    }
}