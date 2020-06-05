import { Model, or } from 'sequelize';

class Locations extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public description!: string | null; // for nullable fields
  public country!: string | null;
  public city!: string | null;

  public visited!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static async getAll(order: string | undefined, params: any) {
    if (!order) {
      return this.findAll({ where: params });
    } else if (order === 'name') {
      return this.findAll({ order: ['name'], where: params });
    } else if (order === 'date') {
      return this.findAll({ order: ['createdAt'], where: params });
    }
    throw new Error('Unknown order');
  }
}

export { Locations };
