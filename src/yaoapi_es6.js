import JsonApi from "devour-client"

const baseUrl = "http://192.168.0.124:3001/api/v1/";

class YaoApi{
  constructor() {
    this.jsonApi = new JsonApi({ apiUrl: baseUrl, logger: false });

    this.jsonApi.replaceMiddleware('errors', {
        name: 'yao-error-handler',
        error: function (payload) {
          console.log(payload)
          // let ret
          // if (payload.data.errors)
          //   ret = payload.data.errors
          // return ret
          return { errors: [] }
        }
      }
    ) 

    this.jsonApi.define('asset', {
      name: '',
      createdAt: '',
      updatedAt: '',

      categories: {
        jsonApi: 'hasMany',
        type: 'categories'
      }
    });

    this.jsonApi.define('category', {
      name: '',
      categorytype: '',
      sort: '',
      deleted: '',
      createdAt: '',
      updatedAt: '',
      items: {
        jsonApi: 'hasMany',
        type: 'items'
      },
      subcategories: {
        jsonApi: 'hasMany',
        type: 'categories'
      },
      parent: {
        jsonApi: 'hasOne',
        type: 'categories'
      },
      asset: {
        jsonApi: 'hasOne',
        type: 'assets'
      }
    });

    // this.jsonApi.define('subcategories', {
    //   name: ''
    // })

    this.jsonApi.define('item', {
      title: '',
      content: '',
      file: '',
      sort: '',
      deleted: '',
      createdAt: '',
      updatedAt: '',

      category: {
        jsonApi: 'hasOne',
        type: 'categories'
      }
    });
  }

  // Asset
  listAsset(){
    return new Promise((resolve, reject) => {
      this.jsonApi.findAll('asset', {
        include: 'categories'
      }).then( (assets) => {
        resolve(assets)
      })
    })
  }

  // Category
  assetData(asset_id){
    return this.jsonApi.find('asset', asset_id, {
      include: 'categories,categories.parent,categories.subcategories,categories.items,categories.subcategories.items'
    })
  }

  // Create Category
  createCategory(asset_id, cat_name){
    let data = {
      name: cat_name,
      asset: {
        id : asset_id,
        type : "assets"
      }
    }

    return this.jsonApi.create('category', data)
  }
  // Create Sub Category
  createSubCategory(cat_id, cat_name){
    let data = {
      name: cat_name,
      categorytype: 1,
      parent: {
        id : cat_id,
        type : "categories"
      }
    }

    return this.jsonApi.create('category', data)
  }

  // Create PDF 
  createItem(cat_id, pdf_title){
    let data = {
      title: pdf_title,
      category: {
        id : cat_id,
        type : "categories"
      }
    }

    return this.jsonApi.create('item', data)
  }


  // Update Category/SubCategory
  updateCategory(category){
    return this.jsonApi.update('category',category)
  }

  // Update PDF 
  updateItem(item){
    return this.jsonApi.update('item', item)
  }

  // Delete Category
  deleteCategory(id){
    return this.jsonApi.destroy('category',id)
  }

  // Delete PDF
  deleteItem(id){
    return this.jsonApi.destroy('item', id)
  }

}

module.exports = YaoApi;
