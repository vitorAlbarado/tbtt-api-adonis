import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("emprestimo_id").unsigned().references('emprestimos.id')
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
