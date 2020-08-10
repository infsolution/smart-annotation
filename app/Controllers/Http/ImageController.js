'use strict'
const Annotation = use('App/Models/Annotation')
const Image = use('App/Models/Image') 

const Helpers = use('Helpers')

class ImageController {
    async create({params, request,response}){
        try {
            const annotation = await Annotation.findOrFail(params.id)
            const images = request.file('file',{
                size: '1mb'
            })
            await images.moveAll(Helpers.tmpPath('images'), file =>({
                name: `${Date.now()}-${file.clientName}`
            }))

            if(!images.moveAll){
                return images.errors()
            }

            //await Promise.all(
            //    images.movedList().map(item=> Image.create({annotation_id:annotation.id, path_image:item.fileName}))
            //)

            await Promise.all(
                images.movedList().map(item=> annotation.images().create({path_image:item.fileName})
            ))

            return response.status(200).send({message:'Imagem inserida com sucesso.'})
        } catch (error) {
            return response.status(200).send({erro: 'O upload Falhou!'})
        }
    }
}

module.exports = ImageController
