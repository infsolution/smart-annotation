'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagesSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.increments()
      table.integer('annotation_id').unsigned().references('id').inTable('annotations').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('path_image').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImagesSchema
