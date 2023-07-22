import { writeFile } from 'node:fs/promises';
import { mkdir, access } from 'node:fs/promises';
import path from 'path';

type ExprNodeConfig = {
  nodeType: string;
  properties: {
    [key: string]: string;
  }
}

export class ExprNodeGenerator {
  private exprNodesConfig: ExprNodeConfig[] = [{
    nodeType: 'Program',
    properties: {
      body: 'ExprNode[]',
    },
  },{
    nodeType: 'ExpressionStatement',
    properties: {
      expression: 'ExprNode',
    },
  }, {
    nodeType: 'BinaryExpr',
    properties: {
      leftOperand: 'ExprNode',
      operator: 'Token',
      rightOperand: 'ExprNode',
    } 
  }, {
    nodeType: 'UnaryExpr',
    properties: {
      operator: 'Token',
      argument: 'ExprNode',
    },
  }, {
    nodeType: 'LogicalExpr',
    properties: {
      left: 'ExprNode',
      operator: 'Token',
      right: 'ExprNode',
    },
  }, {
    nodeType: 'NumericLiteral',
    properties: {
      value: 'number',
    }
  }, {
    nodeType: 'StringLiteral',
    properties: {
      value: 'string',
    }
  }, {
    nodeType: 'BooleanLiteral',
    properties: {
      value: 'boolean',
    },
  }, {
    nodeType: 'NullLiteral',
    properties: {
      value: 'null',
    }
  }];

  private getNodeTypes() {
    return this.exprNodesConfig.map(({ nodeType }) => nodeType); 
  }

  private getNodesFolderPath() {
    return path.resolve(process.cwd(), 'src', 'nodes');
  }

  private getExprNodeVisitorTemplate() {
    const nodeTypes = this.getNodeTypes();

    const imports = nodeTypes.map((nodeType) => {
      return `import { ${nodeType}Node } from './${nodeType}Node';`
    }).join('\n');

    const methods = nodeTypes.map((nodeType) => {
      return `visit${nodeType}Node(exprNode: ${nodeType}Node): T | undefined { return; };`;
    }).join('\n\n  ');

    const template = `${imports}

export abstract class ExprNodeVisitor<T = any> {
  ${methods}
}`;

    return template;
  }

  private genExprNodeTypeTemplate() {
    const nodeTypes = this.getNodeTypes();

    const imports = nodeTypes.map((nodeType) => {
      return `import { ${nodeType}Node } from './${nodeType}Node';`
    }).join('\n');

    const type = nodeTypes.map((nodeType) => `${nodeType}Node`).join(' | ');

    const template = `${imports}

export type ExprNode = ${type};
`; 

    return template;
  }

  private getExprNodeTemplate(nodeType: string, args: string) {
    const template = `import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class ${nodeType}Node {
  constructor(${args}) {};

  public type = "${nodeType}";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visit${nodeType}Node(this);
  }
}`;

    return template;
  }

  constructor() {}

  async genExprNode({ nodeType, properties }: ExprNodeConfig) {
    const args = Object.entries(properties).map(([propertyName, propertyType]) => {
      return `public ${propertyName}: ${propertyType}`
    }).join(', ');

    const projectDir = this.getNodesFolderPath();

    try {
      await mkdir(projectDir);
    } catch(error) {}

    try {
      await writeFile(
        path.resolve(projectDir, `${nodeType}Node.ts`), 
        this.getExprNodeTemplate(nodeType, args)
      );
    } catch(error) {
      throw new Error('Failed to write expression nodes.');
    } 
  }

  async genExprNodeVisitor() {
    const projectDir = this.getNodesFolderPath();

    try {
      await writeFile(
        path.resolve(projectDir, 'ExprNodeVisitor.ts'), 
        this.getExprNodeVisitorTemplate()
      );
    } catch(error) {
      throw new Error('Failed to write ExprNodeVisitor nodes.');
    } 
  }

  async genExprNodeType() {
    const projectDir = this.getNodesFolderPath();

    try {
      await writeFile(
        path.resolve(projectDir, 'ExprNode.ts'), 
        this.genExprNodeTypeTemplate()
      );
    } catch(error) {
      throw new Error('Failed to write ExprNode nodes.');
    } 
  }

  async genExprNodes() {
    this.genExprNodeType();

    this.genExprNodeVisitor();

    this.exprNodesConfig.map((exprNodeConfig) => {
      this.genExprNode(exprNodeConfig);
    });
  }
};
