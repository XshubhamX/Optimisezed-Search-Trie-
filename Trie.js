const Restaurants = require("./models/restaurants");

class Node {
  constructor(value) {
    this.val = value;
    this.childs = new Array(33);
    this.count = 0;
  }

  has(char) {
    return this.childs[char.charCodeAt(0)] ? true : false;
  }

  set(char, refNode) {
    if (this.childs[char.charCodeAt(0)]) {
      return false;
    }
    this.childs[char.charCodeAt(0)] = refNode;
    return true;
  }

  get(char) {
    return this.childs[char.charCodeAt(0)];
  }

  remove(char) {
    this.childs[char.charCodeAt(0)] = null;

    return true;
  }
}

class Trie {
  constructor() {
    this.root = new Node("^");
  }

  cc(char) {
    return char?.charCodeAt(0);
  }

  trimmer(targetString) {
    let finalString = "";
    let count = 0;

    for (let i of targetString) {
      if (i == " ") count += 1;
      else count = 0;

      if (count <= 1) finalString += i;
    }

    return finalString.trim();
  }

  exists(query = "") {
    query = this.trimmer(query);
    if (!query) return false;

    let strtNode = this.root;

    for (let i = 0; i < query.length; i++) {
      const isExistingNode = strtNode.get(query[i]);
      if (!isExistingNode) return false;

      strtNode = isExistingNode;
    }

    return {
      exists: strtNode.count ? true : false,
      count: strtNode.count,
      strtNode,
    };
  }

  checkIfChild(strtNode) {
    for (let i of strtNode.childs) if (i) return true;
    return false;
  }

  extractor(targetNode, currString = "", accumulate) {
    if (targetNode.count) accumulate.push(currString);

    for (let i of targetNode.childs) {
      if (i) {
        this.extractor(i, currString + i.val, accumulate);
      }
    }

    return 1;
  }
  insert(newElement = "") {
    const element = this.trimmer(newElement);
    if (!element?.length) return 0;

    let strtNode = this.root;
    for (let i = 0; i < element.length; i++) {
      if (!strtNode.has(element[i])) {
        const newSubNode = new Node(element[i]);
        strtNode.set(element[i], newSubNode);
        strtNode = newSubNode;
      } else {
        strtNode = strtNode.get(element[i]);
      }
    }

    strtNode.count += 1;

    return strtNode.count;
  }
  search(query = "") {
    query = this.trimmer(query);
    const checkInitialQuery = this.exists(query);
    if (!checkInitialQuery) return [];

    const searchedResults = [];

    this.extractor(checkInitialQuery.strtNode, query, searchedResults);

    return searchedResults;
  }

  recursiveDelete(i, query, strtNode) {
    if (i >= query.length) return strtNode.count ? true : false;

    let reqNode;

    for (let itNode of strtNode.childs) {
      if (itNode?.val == query[i]) {
        reqNode = itNode;
      }
    }
    if (!reqNode) {
      return false;
    }

    const checker = this.recursiveDelete(i + 1, query, reqNode);

    if (!checker) return false;

    if (i === query.length - 1 && !this.checkIfChild(reqNode)) {
      strtNode.remove(query[i]);
    } else {
      if (!reqNode.count && !this.checkIfChild(reqNode)) {
        strtNode.remove(query[i]);
      }
    }

    return true;
  }

  delete(query = "") {
    query = this.trimmer(query);

    this.recursiveDelete(0, query, this.root);

    return true;
  }

  update(query, reqQuery) {
    this.delete(query);

    this.insert(reqQuery);

    return true;
  }
}

let MasterTrie;

const seedData = async () => {
  MasterTrie = new Trie();
  try {
    const allRestaurants = await Restaurants.find({});

    allRestaurants.map((eachRes) => {
      const name = eachRes?.name.toLowerCase() || "";
      MasterTrie.insert(name);
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return true;
};

const searchQuery = (query, limit, pgNo) => {
  try {
    const data = MasterTrie.search(query);

    const startIdx = limit * (pgNo - 1);

    return {
      data: data.slice(startIdx, startIdx + limit),
      totalPages: Math.ceil(data.length / limit),
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  searchQuery,
  seedData,
};
