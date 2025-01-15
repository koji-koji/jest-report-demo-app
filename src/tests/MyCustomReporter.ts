/**
 *
 * JestのカスタムレポーターをTypeScriptで実装。
 * テスト結果をMarkdownファイルに出力。
 * 各テストの合否を「✓」(passed)、「✗」(failed)、「?」(その他) のマークで表示。
 */

import fs from "fs";
import path from "path";
import {
  AggregatedResult,
  AssertionResult,
  Status,
  TestContext,
} from "@jest/test-result";
import { Reporter } from "@jest/reporters";

type HierarchyNode = {
  name: string;
  tests: { title: string; status: string }[];
  children: HierarchyNode[];
};

class MyCustomReporter implements Reporter {
  /**
   * 全テスト実行が完了した際に呼び出されるメソッド
   */
  onRunComplete = (_: Set<TestContext>, results: AggregatedResult) => {
    try {
      const allOutput = [
        "# Test Results\n\n",
        ...results.testResults.map((testFileResult) => {
          const rootArray = this.buildHierarchy(testFileResult.testResults);
          const baseName = path.basename(testFileResult.testFilePath);
          return `## File: ${baseName}\n\n${this.buildMarkdown(rootArray, 0)}\n`;
        }),
      ].join("\n");

      const outputFilePath = path.resolve(
        process.cwd(),
        "src/tests/testCaseTitles.md",
      );
      fs.writeFileSync(outputFilePath, allOutput, "utf8");
    } catch (error) {
      console.error("Error writing test results to Markdown:", error);
    }
  };

  buildHierarchy = (assertionResults: AssertionResult[]): HierarchyNode[] => {
    return assertionResults.reduce<HierarchyNode[]>((acc, assertion) => {
      const { ancestorTitles, title, status } = assertion;
      return this.addTest(acc, ancestorTitles, title, status);
    }, []);
  };

  /**
   * ancestorTitles をたどり、最終ノードの tests に { title, status } を追加
   */
  addTest = (
    currentArray: HierarchyNode[],
    ancestorTitles: string[],
    testTitle: string,
    testStatus: Status,
  ): HierarchyNode[] => {
    if (ancestorTitles.length === 0) {
      return this.addTestToNode(currentArray, "(root)", testTitle, testStatus);
    } else {
      const [first, ...rest] = ancestorTitles;
      return this.addTestToNode(
        currentArray,
        first,
        testTitle,
        testStatus,
        rest,
      );
    }
  };

  private addTestToNode = (
    currentArray: HierarchyNode[],
    nodeName: string,
    testTitle: string,
    testStatus: Status,
    remainingTitles: string[] = [],
  ): HierarchyNode[] => {
    const existingNode = this.findOrCreateNode(currentArray, nodeName);
    const updatedNode = this.getUpdatedNode(
      existingNode,
      testTitle,
      testStatus,
      remainingTitles,
    );
    const replaceNode = [
      ...currentArray.filter((node) => node.name !== updatedNode.name),
      updatedNode,
    ];
    return replaceNode;
  };

  private findOrCreateNode = (
    nodes: HierarchyNode[],
    name: string,
  ): HierarchyNode => {
    return (
      nodes.find((node) => node.name === name) || {
        name,
        tests: [],
        children: [],
      }
    );
  };

  private getUpdatedNode = (
    node: HierarchyNode,
    testTitle: string,
    testStatus: Status,
    remainingTitles: string[],
  ): HierarchyNode => {
    return remainingTitles.length === 0
      ? {
          ...node,
          tests: [...node.tests, { title: testTitle, status: testStatus }],
        }
      : {
          ...node,
          children: this.addTest(
            node.children,
            remainingTitles,
            testTitle,
            testStatus,
          ),
        };
  };

  /**
   * ツリー構造(HierarchyNode[])を再帰的にたどり、Markdown形式のテキストを組み立てる
   */
  buildMarkdown(nodes: HierarchyNode[], level: number): string {
    return nodes.map((node) => this.formatNode(node, level)).join("");
  }

  private formatNode(node: HierarchyNode, level: number): string {
    const nameText =
      node.name !== "(root)" ? `${"  ".repeat(level)}${node.name}\n` : "";
    const testsText = node.tests
      .map(({ title, status }) => this.formatTest(title, status, level))
      .join("");
    const childrenText =
      node.children.length > 0
        ? this.buildMarkdown(node.children, level + 1)
        : "";
    return nameText + testsText + childrenText;
  }

  private formatTest(title: string, status: string, level: number): string {
    const icon = status === "passed" ? "✓" : status === "failed" ? "✗" : "?";
    return `${"  ".repeat(level + 1)}${icon} ${title}\n`;
  }
}

export default MyCustomReporter;
