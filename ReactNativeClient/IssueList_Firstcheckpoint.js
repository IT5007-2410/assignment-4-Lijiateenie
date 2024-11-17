import React, { useState } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    const response = await fetch('http://10.0.2.2:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    /****** Q4: Code Ends here******/

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    // 检查是否有错误
    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions && error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception?.errors; // 检查 errors 是否存在
        if (details && Array.isArray(details)) {
          alert(`${error.message}:\n ${details.join('\n ')}`);
        } else {
          alert(`${error.message}`); // fallback when "errors" is missing
        }
      } else {
        alert(`${error.extensions?.code || 'UNKNOWN_ERROR'}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    console.error('GraphQL Fetch Error:', e.message);
    alert(`Error in sending data to server: ${e.message}`);
    return null;
  }
}

class IssueTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1, // 当前页
      itemsPerPage: 10, // 每页显示条目
      issues: [], // 初始化表格数据
    };
  }

  // 数据初始化（等效于 useEffect）
  componentDidMount() {
    const initialData = [
      { id: 1, title: 'Bug in Login', status: 'Open', owner: 'Alice', created: '2023-11-01', effort: 3, due: '2023-11-05' },
      { id: 2, title: 'UI Enhancement', status: 'Closed', owner: 'Bob', created: '2023-10-25', effort: 2, due: '2023-10-30' },
      // 更多模拟数据...
    ];

    // 如果传入了 props.issues，则优先使用外部数据
    this.setState({ issues: this.props.issues.length > 0 ? this.props.issues : initialData });
  }

  // 渲染当前分页的数据
  getPaginatedIssues() {
    const { currentPage, itemsPerPage, issues } = this.state;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return issues.slice(startIndex, endIndex);
  }

  // 渲染表格头部
  renderTableHeader() {
    return ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
  }

  // 渲染表格行
  renderTableRows() {
    const paginatedIssues = this.getPaginatedIssues();
    return paginatedIssues.map(issue => (
      <IssueRow key={issue.id} issue={issue} onRowPress={this.props.onRowPress} />
    ));
  }

  render() {
    const { currentPage, itemsPerPage, issues } = this.state;
    const totalPages = Math.ceil(issues.length / itemsPerPage);

    return (
      <View style={styles.container}>
        {/* 表格头部 */}
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row
            data={this.renderTableHeader()}
            style={styles.header}
            textStyle={{ ...styles.text, color: 'white' }}
          />
          <ScrollView style={styles.dataWrapper}>
            <TableWrapper>
              {this.renderTableRows()}
            </TableWrapper>
          </ScrollView>
        </Table>

        {/* 分页按钮 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
          <Button
            title="Previous"
            onPress={() =>
              this.setState({ currentPage: Math.max(currentPage - 1, 1) })
            }
          />
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            title="Next"
            onPress={() =>
              this.setState({ currentPage: Math.min(currentPage + 1, totalPages) })
            }
          />
        </View>
      </View>
    );
  }
}



class IssueFilter extends React.Component {
  render() {
    return (

      <View style={{ padding: 10 }}>
        {/****** Q1: Start Coding here. ******/}
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Filter Issues</Text>
        <TextInput
          placeholder="Enter filter criteria"
          style={{ borderColor: 'gray', borderWidth: 1, marginTop: 5, padding: 8 }}
        />
        <Button title="Apply Filter" onPress={() => { /* Placeholder function */ }} />

        {/****** Q1: Code ends here ******/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});

const width = [40, 60, 60, 60, 60, 60, 50];

function IssueRow(props) {
  // 正确解构 props
  const { issue, onRowPress } = props;

  {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
  const rowData = [
    issue.id,
    issue.title,
    issue.status,
    issue.owner,
    issue.created ? new Date(issue.created).toDateString() : '', // 确保 created 是日期
    issue.effort,
    issue.due ? new Date(issue.due).toDateString() : '' // 确保 due 是日期
  ];
  {/****** Q2: Coding Ends here.******/}

  return (
    <Row
      data={rowData}
      widthArr={width}
      style={styles.row}
      onPress={() => onRowPress(issue)}
    />
  );
}




class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);

    // Q3: 初始化 State
    this.state = {
      title: '',
      owner: '',
      effort: '',
      error: '', // 用于显示错误信息
    };
  }

  // 更新 Title
  handleTitleChange = (text) => {
    this.setState({ title: text });
  };

  // 更新 Owner
  handleOwnerChange = (text) => {
    this.setState({ owner: text });
  };

  // 更新 Effort
  handleEffortChange = (text) => {
    this.setState({ effort: text });
  };

  // 提交表单
  handleSubmit() {
    const { title, owner, effort } = this.state;

    // 表单验证
    if (!title.trim() || !owner.trim()) {
      this.setState({ error: 'Title and Owner are required.' });
      return;
    }

    const effortInt = parseInt(effort, 10);
    if (isNaN(effortInt)) {
      this.setState({ error: 'Effort must be a valid number.' });
      return;
    }

    // 创建新的 Issue
    const newIssue = {
      title,
      owner,
      effort: effortInt, // 转换为整数
    };

    // 调用父组件传递的 createIssue 方法
    this.props.createIssue(newIssue)
      .then(() => {
        // 成功添加后，清空表单
        this.setState({
          title: '',
          owner: '',
          effort: '',
          error: '',
        });
      })
      .catch((err) => {
        this.setState({ error: `Failed to add issue: ${err.message}` });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.error ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{this.state.error}</Text>
        ) : null}
        <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={this.handleTitleChange}
          style={styles.input}
        />
        <TextInput
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={this.handleOwnerChange}
          style={styles.input}
        />
        <TextInput
          placeholder="Effort"
          value={this.state.effort}
          onChangeText={this.handleEffortChange}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Add Issue" onPress={this.handleSubmit} color="#4CAF50" />
      </View>
    );
  }
}


class BlackList extends React.Component {
  constructor() {
    super();
    this.state = {
      owner: '' // 用于存储用户输入的 owner 名称
    };
  }

  handleOwnerChange = (text) => {
    this.setState({ owner: text });
  };

  handleSubmit = async () => {
    const { owner } = this.state;

    if (!owner.trim()) {
      alert('Owner cannot be empty.');
      return;
    }

    const query = `mutation addToBlacklist($owner: String!) {
        addToBlacklist(owner: $owner) {
          owner
        }
    }`;

    const variables = { owner };

    try {
      const result = await graphQLFetch(query, variables);

      if (result) {
        alert(`Owner ${owner} added to blacklist.`);
        this.setState({ owner: '' }); // 清空输入框
      }
    } catch (error) {
      alert(`Failed to add owner to blacklist: ${error.message}`);
    }
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Enter Owner to Blacklist"
          value={this.state.owner}
          onChangeText={this.handleOwnerChange}
          style={{ borderColor: 'gray', borderWidth: 1, padding: 8, marginBottom: 5 }}
        />
        <Button title="Add to Blacklist" onPress={this.handleSubmit} color="#4CAF50" />
      </View>
    );
  }
}


export default class IssueList extends React.Component {
  constructor() {
      super();
      this.state = { issues: [] };
      this.createIssue = this.createIssue.bind(this);
      this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
      this.loadData();
    }

  async loadData() {
      this.setState({ isLoading: true });
      const query = `query {
          issueList {
            id title status owner
            created effort due
          }
      }`;

      try {
        const data = await graphQLFetch(query);
        if (data) {
          this.setState({ issues: data.issueList, isLoading: false });
        } else {
          alert('Failed to load issues.');
          this.setState({ isLoading: false });
        }
      } catch (error) {
        alert(`Error loading data: ${error.message}`);
        this.setState({ isLoading: false });
      }
    }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          id
        }
    }`;

    try {
      const data = await graphQLFetch(query, { issue });
      if (data) {
        alert('Issue added successfully.');
        this.loadData();
      } else {
        alert('Failed to add issue.');
      }
    } catch (error) {
      alert(`Error adding issue: ${error.message}`);
    }
  }

  async handleFilterChange(filterCriteria) {
    const query = `query issueList($filter: IssueFilterInputs!) {
        issueList(filter: $filter) {
          id title status owner
          created effort due
        }
    }`;

    const variables = { filter: filterCriteria };
    const data = await graphQLFetch(query, variables);

    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  render() {
      const { isLoading, issues } = this.state;
      return (
        <>
          {isLoading ? <Text>Loading...</Text> : null}
          {/****** Q1: Start Coding here. ******/}
          <IssueFilter onFilterChange={this.handleFilterChange} />
          {/****** Q1: Code ends here ******/}


          {/****** Q2: Start Coding here. ******/}
          <IssueTable issues={this.state.issues} />
          {/****** Q2: Code ends here ******/}


          {/****** Q3: Start Coding here. ******/}
          <IssueAdd createIssue={this.createIssue} />
          {/****** Q3: Code Ends here. ******/}

          {/****** Q4: Start Coding here. ******/}
          <BlackList />
          {/****** Q4: Code Ends here. ******/}
        </>

      );
    }
}
