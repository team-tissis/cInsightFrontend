export interface IHttpClient {
    get: (path: string, params: any) => Promise<any>
    post: (path: string, params: any, formatJson?: boolean) => Promise<any>
    put: (path: string, params: any, formatJson?: boolean) => Promise<any>
    patch: (path: string, params: any, formatJson?: boolean) => Promise<any>
    delete: (path: string) => Promise<any>
    download: (path: string, filename: string, params: any) => Promise<any>
}
