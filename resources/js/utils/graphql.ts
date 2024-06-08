import { GraphQL } from "@/types";
import axios, { AxiosError } from "axios";

const graphqlAxios = axios.create({ baseURL: "/graphql" });
graphqlAxios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
graphqlAxios.defaults.withXSRFToken = true;


const graphql = (query: string) =>
    graphqlAxios.post("/", { query }).then(({ data }) => {
        const graphqlData: GraphQL = data;
        return graphqlData;
    });

export default graphql;
