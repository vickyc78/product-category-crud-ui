import axios from "axios";

let adminUrl = "http://localhost:5001";
export default {
  apiCallWithData: async (url, data) => {
    return await axios
      .post(adminUrl + url, data)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  },
  apiCallWithDataGetMethode: async url => {
    return await axios
      .get(adminUrl + url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  }
};
