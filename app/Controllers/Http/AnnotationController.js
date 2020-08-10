'use strict'
const Annotation = use('App/Models/Annotation')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with annotations
 */
class AnnotationController {
  /**
   * Show a list of all annotations.
   * GET annotations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    //const annotation = await Annotation.all()
    const annotation = await Annotation.query().where('user_id', auth.user.id).withCount('images as todas_iamgens').fetch()
    //const annotation = await Database.select('title','description').from('annotations').where('user_id', auth.user.id)
    return annotation
  }


  /**
   * Create/save a new annotation.
   * POST annotations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const {id} = auth.user
    const data = request.only(["title","description"])
    const annotation = await Annotation.create({...data, user_id: id})
    return annotation
  }

  /**
   * Display a single annotation.
   * GET annotations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) {
    const annotation = await Annotation.query().where('id', params.id).where('user_id','=',auth.user.id).first()
    if(!annotation){
      return response.status(404).send({message:'Nenhuma anotação foi encotrada!'})
    }
    await annotation.load('images')
    return annotation
  }



  /**
   * Update annotation details.
   * PUT or PATCH annotations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const {title, description} = request.all()
    const annotation = await Annotation.query().where('id', params.id).where('user_id','=',auth.user.id).first()
    if(!annotation){
      return response.status(404).send({message:'Nenhuma anotação foi encotrada!'})
    }
    annotation.title = title
    annotation.description = description
    annotation.save()
    return annotation
  }

  /**
   * Delete a annotation with id.
   * DELETE annotations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const {title, description} = request.all()
    const annotation = await Annotation.query().where('id', params.id).where('user_id','=',auth.user.id).first()
    if(!annotation){
      return response.status(404).send({message:'Nenhuma anotação foi encotrada!'})
    }
    await annotation.delete()
      return response.status(200).send({message:`Anotação  ${annotation.id} foi removida!`})
  }
}

module.exports = AnnotationController
