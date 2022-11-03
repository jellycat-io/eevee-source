import { RuntimeVal } from './values.ts';
import { RuntimeError } from '../utils/error.ts';

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean,
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw new RuntimeError(`Already declared variable ${varname}.`);
    }

    this.variables.set(varname, value);

    if (constant) this.constants.add(varname);
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);

    // Cannot assign to constant
    if (env.constants.has(varname)) {
      throw new RuntimeError(`Cannot assign to constant variable ${varname}.`);
    }

    env.variables.set(varname, value);

    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) return this;

    if (this.parent == undefined) {
      throw new RuntimeError(`Cannot resolve ${varname}.`);
    }

    return this.parent.resolve(varname);
  }
}
