declare global {
    namespace NodeJs {
        interface ProcessEnv {
            ADMIN_PRIVATE_KEY: string
        }
    }
}

export {}
