from flask_restful import Resource, Api,fields, marshal_with, request
from flask_security import auth_required, current_user
from backend.models import Category,db

api = Api(prefix='/api')

category_fields = {
    'id': fields.Integer,
    'name': fields.String
}

service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'category_id': fields.Integer
}


class CategoryAPI(Resource):

    @marshal_with(category_fields)
    # @auth_required('token')
    def get(self, category_id):
        category = Category.query.get(category_id)

        if not category:
            return {'message': 'Category not found'}, 404
        return category
    
    # @auth_required('token')
    def delete(self, category_id):
        category = Category.query.get(category_id)

        if not category:
            return {'message': 'Category not found'}, 404
        
        if category.user_id == current_user.id:
            db.session.delete(category)
            # use try catch
            db.session.commit()
        else:
            return {'message': 'You are not authorized to delete this category'}, 403

api.add_resource(CategoryAPI, '/category/<int:category_id>')

class CategoryListAPI(Resource):
    @marshal_with(category_fields)
    # @auth_required('token')
    def get(self):
        categories = Category.query.all()

        return categories
    
    def post(self):
        data = request.get_json()
        name = data.get('name')
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()
        #use try and catch block
        return {'message': 'Category created successfully'}, 201


api.add_resource(CategoryListAPI,'/categories')