import createAxios from './createAxios';

export interface CreatePlacePayload {
  latitude: number;
  longitude: number;
  note: string;
}

export interface Place extends CreatePlacePayload {
  id: number;
  ownerId: string; // guid
}

class API {
  static token = '';
  // regular user
  //
  static async getMyPlaces(): Promise<Place[]> {
    return createAxios(API.token)
      .get(`/api/my/places`)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }

  static async getPlace(id: number): Promise<Place> {
    return createAxios(API.token)
      .get(`/api/my/places/${id}`)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }

  static async createPlace(payload: CreatePlacePayload): Promise<Place> {
    return createAxios(API.token)
      .post(`/api/my/places`, payload)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }

  static async updatePlace(payload: Place): Promise<Place> {
    const { id } = payload;
    return createAxios(API.token)
      .put(`/api/my/places/${id}`, payload)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }

  // TODO: check return type from API
  static async deletePlace(id: number): Promise<any> {
    return createAxios(API.token)
      .delete(`/api/my/places/${id}`)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }

  // admin user
  //
  static async getAllPlaces(): Promise<Place[]> {
    throw new Error('Not Implemented');
  }

  // admin user
  //
  static async getAllUsers(): Promise<Place[]> {
    return createAxios(API.token)
      .get(process.env.KEYCLOAK_URL || "http://localhost:8080/auth/admin/realms/quartech/users")
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }

  static async getAllPlacesFiltered(userId: string): Promise<Place[]> {
    const params = userId !== "all" ? `?userId=${userId}` : "";
    return createAxios(API.token)
      .get(`api/all/places${params}`)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
  }
}

export default API;
