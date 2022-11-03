import { MK_BOOL, MK_NULL, MK_NUMBER, RuntimeVal } from './values.ts';
import { RuntimeError } from '../utils/error.ts';

function setupScope(scope: Environment) {
  scope.declareVar('true', MK_BOOL(true), true);
  scope.declareVar('false', MK_BOOL(false), true);
  scope.declareVar('nil', MK_NULL(), true);
  scope.declareVar('PI', MK_NUMBER(3.14159), true);
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    const global = !parentEnv ? true : false;
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();

    if (global) setupScope(this);
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
