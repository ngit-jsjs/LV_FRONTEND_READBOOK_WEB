import createCrudService from './createCrudService';
import { API_ENDPOINTS } from './apiEndpoints';

const crud = createCrudService(API_ENDPOINTS.PUBLISHERS);

const publisherService = {
  ...crud,
  getAllPublishers: crud.getAll,
  getPublisherById: crud.getOne,
  createPublisher: crud.create,
  updatePublisher: crud.update,
  deletePublisher: crud.remove,
  searchPublishers: crud.search,
};

export default publisherService;
