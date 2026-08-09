import createCrudService from './createCrudService';
import { API_ENDPOINTS } from './apiEndpoints';

const crud = createCrudService(API_ENDPOINTS.AUTHORS);

const authorService = {
  ...crud,
  getAllAuthors: crud.getAll,
  getAuthorById: crud.getOne,
  createAuthor: crud.create,
  updateAuthor: crud.update,
  deleteAuthor: crud.remove,
  searchAuthors: crud.search,
};

export default authorService;
