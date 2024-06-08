import axios from "axios";
window.axios = axios.create();
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
