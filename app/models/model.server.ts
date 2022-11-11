export class Model<TModelData> {
  constructor(public data: TModelData) {}

  static async serializeResults(results: any) {
    return results;
  }

  static async convertResultsToModels(results: any[]) {
    return Promise.all(
      results.map(
        async (result) => new this(await this.serializeResults(result))
      )
    );
  }

  toJSON() {
    return this.data;
  }
}
