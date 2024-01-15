import * as fs from 'fs'

export abstract class Datasource {
    abstract createElement(element: any): Promise<void>
    abstract updateElement(element: any): Promise<void>
    abstract deleteElement(element: any): Promise<void>
    abstract getElement(id: number): Promise<any>
    abstract getElements(): Promise<any[]>
}

export class DatasourceImpl implements Datasource {
    private readonly _FilePath: string
    private readonly _DatabasePath: string = 'data'

    constructor(path: string) {
        this._FilePath = path
        this.databaseInstance(path)
    }

    databaseInstance(path: string): void {
        if (!fs.existsSync(this._DatabasePath)) {
            fs.mkdirSync(this._DatabasePath)
        }
        if (fs.existsSync(path)) return

        fs.writeFileSync(path, '[]')
    }

    async getElement(id: number): Promise<any> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        const elements = JSON.parse(data) as any[]
        const element = elements.find((e) => e._Id === id)
        if (element === undefined) throw new Error('Entry not found')
        return element
    }

    async getElements(): Promise<any[]> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        return JSON.parse(data) as any[]
    }

    async createElement(element: any): Promise<void> {
        const elements = await this.getElements()
        elements.push(element)
        await fs.promises.writeFile(this._FilePath, JSON.stringify(elements))
    }

    async updateElement(elements: any[]): Promise<void> {
        await fs.promises.writeFile(this._FilePath, JSON.stringify(elements))
    }

    async deleteElement(elements: any[]): Promise<void> {
        await fs.promises.writeFile(this._FilePath, JSON.stringify(elements))
    }
}
