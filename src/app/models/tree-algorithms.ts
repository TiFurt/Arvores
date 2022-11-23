import { Sanitizer } from '@angular/core';
import { TreeAlgorithm } from './tree-algorithm.model';

export const TREE_ALGORITHMS: TreeAlgorithm[] = [
  {
    name: 'Árvore B (B-Tree)',
    description: `<p>Árvores B são estruturas usada para implementar TSs (tabelas de símbolos) muito grandes. Uma árvore B pode ser vista como um índice (análogo ao índice de um livro) para uma coleção de pequenas TSs:  o índice diz em qual das pequenas TSs está a chave que você procura. Pode-se dizer que uma árvore B é uma TS de TSs.</p>
    <p>Ao invés de só poder ter 2 filhos ela pode possuir vários filhos, logo, várias chaves.</p>`,
    code: `
class BTreeNode(object):
    """A B-Tree Node.

    attributes
    =====================
    leaf : boolean, determines whether this node is a leaf.
    keys : list, a list of keys internal to this node
    c : list, a list of children of this node
    """
    def __init__(self, leaf=False):
        self.leaf = leaf
        self.keys = []
        self.c    = []

    def __str__(self):
        if self.leaf:
            return "Leaf BTreeNode with {0} keys\n\tK:{1}\n\tC:{2}\n".format(len(self.keys), self.keys, self.c)
        else:
            return "Internal BTreeNode with {0} keys, {1} children\n\tK:{2}\n\n".format(len(self.keys), len(self.c), self.keys, self.c)


class BTree(object):
    def __init__(self, t):
        self.root = BTreeNode(leaf=True)
        self.t    = t

    def search(self, k, x=None):
        """Search the B-Tree for the key k.

        args
        =====================
        k : Key to search for
        x : (optional) Node at which to begin search. Can be None, in which case the entire tree is searched.

        """
        if isinstance(x, BTreeNode):
            i = 0
            while i < len(x.keys) and k > x.keys[i]:    # look for index of k
                i += 1
            if i < len(x.keys) and k == x.keys[i]:       # found exact match
                return (x, i)
            elif x.leaf:                                # no match in keys, and is leaf ==> no match exists
                return None
            else:                                       # search children
                return self.search(k, x.c[i])
        else:                                           # no node provided, search root of tree
            return self.search(k, self.root)

    def insert(self, k):
        r = self.root
        if len(r.keys) == (2*self.t) - 1:     # keys are full, so we must split
            s         = BTreeNode()
            self.root = s
            s.c.insert(0, r)                  # former root is now 0th child of new root s
            self._split_child(s, 0)
            self._insert_nonfull(s, k)
        else:
            self._insert_nonfull(r, k)

    def _insert_nonfull(self, x, k):
        i = len(x.keys) - 1
        if x.leaf:
            # insert a key
            x.keys.append(0)
            while i >= 0 and k < x.keys[i]:
                x.keys[i+1] = x.keys[i]
                i -= 1
            x.keys[i+1] = k
        else:
            # insert a child
            while i >= 0 and k < x.keys[i]:
                i -= 1
            i += 1
            if len(x.c[i].keys) == (2*self.t) - 1:
                self._split_child(x, i)
                if k > x.keys[i]:
                    i += 1
            self._insert_nonfull(x.c[i], k)

    def _split_child(self, x, i):
        t = self.t
        y = x.c[i]
        z = BTreeNode(leaf=y.leaf)

        # slide all children of x to the right and insert z at i+1.
        x.c.insert(i+1, z)
        x.keys.insert(i, y.keys[t-1])

        # keys of z are t to 2t - 1,
        # y is then 0 to t-2
        z.keys = y.keys[t:(2*t - 1)]
        y.keys = y.keys[0:(t-1)]

        # children of z are t to 2t els of y.c
        if not y.leaf:
            z.c = y.c[t:(2*t)]
            y.c = y.c[0:(t-1)]

    def __str__(self):
        r = self.root
        return r.__str__() + '\n'.join([child.__str__() for child in r.c])  `,
    video: 'https://www.youtube.com/embed/oxTVYaKGg2A',
    route: 'b-tree'
  },
  {
    name: 'Árvore B+',
    description: `<p>Semelhante a árvore B, as principais diferenças são:</p>
    <p>- Elas armazenan dados somente nas folhas (os nós internos servem apenas de ponteiros)</p>
    <p>- As folhas são encadeadas.</p>`,
    code: `class Node(object):
    """Base node object.
    Each node stores keys and values. Keys are not unique to each value, and as such values are
    stored as a list under each key.
    Attributes:
        order (int): The maximum number of keys each node can hold.
    """
    def __init__(self, order):
        """Child nodes can be converted into parent nodes by setting self.leaf = False. Parent nodes
        simply act as a medium to traverse the tree."""
        self.order = order
        self.keys = []
        self.values = []
        self.leaf = True

    def add(self, key, value):
        """Adds a key-value pair to the node."""
        # If the node is empty, simply insert the key-value pair.
        if not self.keys:
            self.keys.append(key)
            self.values.append([value])
            return None

        for i, item in enumerate(self.keys):
            # If new key matches existing key, add to list of values.
            if key == item:
                self.values[i].append(value)
                break

            # If new key is smaller than existing key, insert new key to the left of existing key.
            elif key < item:
                self.keys = self.keys[:i] + [key] + self.keys[i:]
                self.values = self.values[:i] + [[value]] + self.values[i:]
                break

            # If new key is larger than all existing keys, insert new key to the right of all
            # existing keys.
            elif i + 1 == len(self.keys):
                self.keys.append(key)
                self.values.append([value])

    def split(self):
        """Splits the node into two and stores them as child nodes."""
        left = Node(self.order)
        right = Node(self.order)
        mid = self.order // 2

        left.keys = self.keys[:mid]
        left.values = self.values[:mid]

        right.keys = self.keys[mid:]
        right.values = self.values[mid:]

        # When the node is split, set the parent key to the left-most key of the right child node.
        self.keys = [right.keys[0]]
        self.values = [left, right]
        self.leaf = False

    def is_full(self):
        """Returns True if the node is full."""
        return len(self.keys) == self.order

    def show(self, counter=0):
        """Prints the keys at each level."""
        print(counter, str(self.keys))

        # Recursively print the key of child nodes (if these exist).
        if not self.leaf:
            for item in self.values:
                item.show(counter + 1)

class BPlusTree(object):
    """B+ tree object, consisting of nodes.
    Nodes will automatically be split into two once it is full. When a split occurs, a key will
    'float' upwards and be inserted into the parent node to act as a pivot.
    Attributes:
        order (int): The maximum number of keys each node can hold.
    """
    def __init__(self, order=8):
        self.root = Node(order)

    def _find(self, node, key):
        """ For a given node and key, returns the index where the key should be inserted and the
        list of values at that index."""
        for i, item in enumerate(node.keys):
            if key < item:
                return node.values[i], i

        return node.values[i + 1], i + 1

    def _merge(self, parent, child, index):
        """For a parent and child node, extract a pivot from the child to be inserted into the keys
        of the parent. Insert the values from the child into the values of the parent.
        """
        parent.values.pop(index)
        pivot = child.keys[0]

        for i, item in enumerate(parent.keys):
            if pivot < item:
                parent.keys = parent.keys[:i] + [pivot] + parent.keys[i:]
                parent.values = parent.values[:i] + child.values + parent.values[i:]
                break

            elif i + 1 == len(parent.keys):
                parent.keys += [pivot]
                parent.values += child.values
                break

    def insert(self, key, value):
        """Inserts a key-value pair after traversing to a leaf node. If the leaf node is full, split
        the leaf node into two.
        """
        parent = None
        child = self.root

        # Traverse tree until leaf node is reached.
        while not child.leaf:
            parent = child
            child, index = self._find(child, key)

        child.add(key, value)

        # If the leaf node is full, split the leaf node into two.
        if child.is_full():
            child.split()

            # Once a leaf node is split, it consists of a internal node and two leaf nodes. These
            # need to be re-inserted back into the tree.
            if parent and not parent.is_full():
                self._merge(parent, child, index)

    def retrieve(self, key):
        """Returns a value for a given key, and None if the key does not exist."""
        child = self.root

        while not child.leaf:
            child, index = self._find(child, key)

        for i, item in enumerate(child.keys):
            if key == item:
                return child.values[i]

        return None

    def show(self):
        """Prints the keys at each level."""
        self.root.show()

def demo_node():
    print('Initializing node...')
    node = Node(order=4)

    print('\nInserting key a...')
    node.add('a', 'alpha')
    print('Is node full?', node.is_full())
    node.show()

    print('\nInserting keys b, c, d...')
    node.add('b', 'bravo')
    node.add('c', 'charlie')
    node.add('d', 'delta')
    print('Is node full?', node.is_full())
    node.show()

    print('\nSplitting node...')
    node.split()
    node.show()

def demo_bplustree():
    print('Initializing B+ tree...')
    bplustree = BPlusTree(order=4)

    print('\nB+ tree with 1 item...')
    bplustree.insert('a', 'alpha')
    bplustree.show()

    print('\nB+ tree with 2 items...')
    bplustree.insert('b', 'bravo')
    bplustree.show()

    print('\nB+ tree with 3 items...')
    bplustree.insert('c', 'charlie')
    bplustree.show()

    print('\nB+ tree with 4 items...')
    bplustree.insert('d', 'delta')
    bplustree.show()

    print('\nB+ tree with 5 items...')
    bplustree.insert('e', 'echo')
    bplustree.show()

    print('\nB+ tree with 6 items...')
    bplustree.insert('f', 'foxtrot')
    bplustree.show()

    print('\nRetrieving values with key e...')
    print(bplustree.retrieve('e'))

if __name__ == '__main__':
    demo_node()
    print('\n')
    demo_bplustree()`,
    video: 'https://www.youtube.com/embed/BaTG9xNPCK8',
    route: 'b-plus-tree'
  },
  {
    name: 'Árvore B*',
    description: 'Elas se diferem das árvores B em relação ao particionamento de suas páginas. A estratégia dessa variação é realizar o particionamento de duas páginas irmãs somente quando estas estiverem completamente cheias e, claro, isso somente é possível através da redistribuição de chaves entre estas páginas filhas. Estando completamente cheias, as chaves são redistribuídas entre três páginas diferentes que são as duas irmãs anteriores e uma nova criada.',
    code: `# Create a node
    class BTreeNode:
      def __init__(self, leaf=False):
        self.leaf = leaf
        self.keys = []
        self.child = []


    # Tree
    class BTree:
      def __init__(self, t):
        self.root = BTreeNode(True)
        self.t = t

        # Insert node
      def insert(self, k):
        root = self.root
        if len(root.keys) == (2 * self.t) - 1:
          temp = BTreeNode()
          self.root = temp
          temp.child.insert(0, root)
          self.split_child(temp, 0)
          self.insert_non_full(temp, k)
        else:
          self.insert_non_full(root, k)

        # Insert nonfull
      def insert_non_full(self, x, k):
        i = len(x.keys) - 1
        if x.leaf:
          x.keys.append((None, None))
          while i >= 0 and k[0] < x.keys[i][0]:
            x.keys[i + 1] = x.keys[i]
            i -= 1
          x.keys[i + 1] = k
        else:
          while i >= 0 and k[0] < x.keys[i][0]:
            i -= 1
          i += 1
          if len(x.child[i].keys) == (2 * self.t) - 1:
            self.split_child(x, i)
            if k[0] > x.keys[i][0]:
              i += 1
          self.insert_non_full(x.child[i], k)

        # Split the child
      def split_child(self, x, i):
        t = self.t
        y = x.child[i]
        z = BTreeNode(y.leaf)
        x.child.insert(i + 1, z)
        x.keys.insert(i, y.keys[t - 1])
        z.keys = y.keys[t: (2 * t) - 1]
        y.keys = y.keys[0: t - 1]
        if not y.leaf:
          z.child = y.child[t: 2 * t]
          y.child = y.child[0: t - 1]

      # Print the tree
      def print_tree(self, x, l=0):
        print("Level ", l, " ", len(x.keys), end=":")
        for i in x.keys:
          print(i, end=" ")
        print()
        l += 1
        if len(x.child) > 0:
          for i in x.child:
            self.print_tree(i, l)

      # Search key in the tree
      def search_key(self, k, x=None):
        if x is not None:
          i = 0
          while i < len(x.keys) and k > x.keys[i][0]:
            i += 1
          if i < len(x.keys) and k == x.keys[i][0]:
            return (x, i)
          elif x.leaf:
            return None
          else:
            return self.search_key(k, x.child[i])

        else:
          return self.search_key(k, self.root)


    def main():
      B = BTree(3)

      for i in range(10):
        B.insert((i, 2 * i))

      B.print_tree(B.root)

      if B.search_key(8) is not None:
        print("\nFound")
      else:
        print("\nNot Found")


    if __name__ == '__main__':
      main()`,
    video: `https://www.youtube.com/embed/WXnTmuSZDfc`,
    route: 'b-star-tree'
  },
  {
    name: 'Árvore Vermelho e Preto',
    description: `<p> Sâo bem semelhantes às arvores binárias, porém existem algumas diferenças:
    <p>- Todo nó é <b>vermelho</b> ou <b>preto</b></p>
    <p>- A Raíz da árvore é sempre <b>preta</b></p>
    <p>- Todo nó nulo é <b>preto</b></p>
    <p>- O pai de um nó <b>vermelho</b> é sempre <b>preto</b></p>
    <p>- Qualquer caminho de um nó até outro nó nulo terá sempre o mesmo número de nós <b>pretos</b></p>
    `,
    code: `# Node creation
    class Node():
        def __init__(self, item):
            self.item = item
            self.parent = None
            self.left = None
            self.right = None
            self.color = 1


    class RedBlackTree():
        def __init__(self):
            self.TNULL = Node(0)
            self.TNULL.color = 0
            self.TNULL.left = None
            self.TNULL.right = None
            self.root = self.TNULL

        # Preorder
        def pre_order_helper(self, node):
            if node != TNULL:
                sys.stdout.write(node.item + " ")
                self.pre_order_helper(node.left)
                self.pre_order_helper(node.right)

        # Inorder
        def in_order_helper(self, node):
            if node != TNULL:
                self.in_order_helper(node.left)
                sys.stdout.write(node.item + " ")
                self.in_order_helper(node.right)

        # Postorder
        def post_order_helper(self, node):
            if node != TNULL:
                self.post_order_helper(node.left)
                self.post_order_helper(node.right)
                sys.stdout.write(node.item + " ")

        # Search the tree
        def search_tree_helper(self, node, key):
            if node == TNULL or key == node.item:
                return node

            if key < node.item:
                return self.search_tree_helper(node.left, key)
            return self.search_tree_helper(node.right, key)

        # Balancing the tree after deletion
        def delete_fix(self, x):
            while x != self.root and x.color == 0:
                if x == x.parent.left:
                    s = x.parent.right
                    if s.color == 1:
                        s.color = 0
                        x.parent.color = 1
                        self.left_rotate(x.parent)
                        s = x.parent.right

                    if s.left.color == 0 and s.right.color == 0:
                        s.color = 1
                        x = x.parent
                    else:
                        if s.right.color == 0:
                            s.left.color = 0
                            s.color = 1
                            self.right_rotate(s)
                            s = x.parent.right

                        s.color = x.parent.color
                        x.parent.color = 0
                        s.right.color = 0
                        self.left_rotate(x.parent)
                        x = self.root
                else:
                    s = x.parent.left
                    if s.color == 1:
                        s.color = 0
                        x.parent.color = 1
                        self.right_rotate(x.parent)
                        s = x.parent.left

                    if s.right.color == 0 and s.right.color == 0:
                        s.color = 1
                        x = x.parent
                    else:
                        if s.left.color == 0:
                            s.right.color = 0
                            s.color = 1
                            self.left_rotate(s)
                            s = x.parent.left

                        s.color = x.parent.color
                        x.parent.color = 0
                        s.left.color = 0
                        self.right_rotate(x.parent)
                        x = self.root
            x.color = 0

        def __rb_transplant(self, u, v):
            if u.parent == None:
                self.root = v
            elif u == u.parent.left:
                u.parent.left = v
            else:
                u.parent.right = v
            v.parent = u.parent

        # Node deletion
        def delete_node_helper(self, node, key):
            z = self.TNULL
            while node != self.TNULL:
                if node.item == key:
                    z = node

                if node.item <= key:
                    node = node.right
                else:
                    node = node.left

            if z == self.TNULL:
                print("Cannot find key in the tree")
                return

            y = z
            y_original_color = y.color
            if z.left == self.TNULL:
                x = z.right
                self.__rb_transplant(z, z.right)
            elif (z.right == self.TNULL):
                x = z.left
                self.__rb_transplant(z, z.left)
            else:
                y = self.minimum(z.right)
                y_original_color = y.color
                x = y.right
                if y.parent == z:
                    x.parent = y
                else:
                    self.__rb_transplant(y, y.right)
                    y.right = z.right
                    y.right.parent = y

                self.__rb_transplant(z, y)
                y.left = z.left
                y.left.parent = y
                y.color = z.color
            if y_original_color == 0:
                self.delete_fix(x)

        # Balance the tree after insertion
        def fix_insert(self, k):
            while k.parent.color == 1:
                if k.parent == k.parent.parent.right:
                    u = k.parent.parent.left
                    if u.color == 1:
                        u.color = 0
                        k.parent.color = 0
                        k.parent.parent.color = 1
                        k = k.parent.parent
                    else:
                        if k == k.parent.left:
                            k = k.parent
                            self.right_rotate(k)
                        k.parent.color = 0
                        k.parent.parent.color = 1
                        self.left_rotate(k.parent.parent)
                else:
                    u = k.parent.parent.right

                    if u.color == 1:
                        u.color = 0
                        k.parent.color = 0
                        k.parent.parent.color = 1
                        k = k.parent.parent
                    else:
                        if k == k.parent.right:
                            k = k.parent
                            self.left_rotate(k)
                        k.parent.color = 0
                        k.parent.parent.color = 1
                        self.right_rotate(k.parent.parent)
                if k == self.root:
                    break
            self.root.color = 0

        # Printing the tree
        def __print_helper(self, node, indent, last):
            if node != self.TNULL:
                sys.stdout.write(indent)
                if last:
                    sys.stdout.write("R----")
                    indent += "     "
                else:
                    sys.stdout.write("L----")
                    indent += "|    "

                s_color = "RED" if node.color == 1 else "BLACK"
                print(str(node.item) + "(" + s_color + ")")
                self.__print_helper(node.left, indent, False)
                self.__print_helper(node.right, indent, True)

        def preorder(self):
            self.pre_order_helper(self.root)

        def inorder(self):
            self.in_order_helper(self.root)

        def postorder(self):
            self.post_order_helper(self.root)

        def searchTree(self, k):
            return self.search_tree_helper(self.root, k)

        def minimum(self, node):
            while node.left != self.TNULL:
                node = node.left
            return node

        def maximum(self, node):
            while node.right != self.TNULL:
                node = node.right
            return node

        def successor(self, x):
            if x.right != self.TNULL:
                return self.minimum(x.right)

            y = x.parent
            while y != self.TNULL and x == y.right:
                x = y
                y = y.parent
            return y

        def predecessor(self,  x):
            if (x.left != self.TNULL):
                return self.maximum(x.left)

            y = x.parent
            while y != self.TNULL and x == y.left:
                x = y
                y = y.parent

            return y

        def left_rotate(self, x):
            y = x.right
            x.right = y.left
            if y.left != self.TNULL:
                y.left.parent = x

            y.parent = x.parent
            if x.parent == None:
                self.root = y
            elif x == x.parent.left:
                x.parent.left = y
            else:
                x.parent.right = y
            y.left = x
            x.parent = y

        def right_rotate(self, x):
            y = x.left
            x.left = y.right
            if y.right != self.TNULL:
                y.right.parent = x

            y.parent = x.parent
            if x.parent == None:
                self.root = y
            elif x == x.parent.right:
                x.parent.right = y
            else:
                x.parent.left = y
            y.right = x
            x.parent = y

        def insert(self, key):
            node = Node(key)
            node.parent = None
            node.item = key
            node.left = self.TNULL
            node.right = self.TNULL
            node.color = 1

            y = None
            x = self.root

            while x != self.TNULL:
                y = x
                if node.item < x.item:
                    x = x.left
                else:
                    x = x.right

            node.parent = y
            if y == None:
                self.root = node
            elif node.item < y.item:
                y.left = node
            else:
                y.right = node

            if node.parent == None:
                node.color = 0
                return

            if node.parent.parent == None:
                return

            self.fix_insert(node)

        def get_root(self):
            return self.root

        def delete_node(self, item):
            self.delete_node_helper(self.root, item)

        def print_tree(self):
            self.__print_helper(self.root, "", True)


    if __name__ == "__main__":
        bst = RedBlackTree()

        bst.insert(55)
        bst.insert(40)
        bst.insert(65)
        bst.insert(60)
        bst.insert(75)
        bst.insert(57)

        bst.print_tree()

        print("\nAfter deleting an element")
        bst.delete_node(40)
        bst.print_tree()`,
    video: 'https://www.youtube.com/embed/vSAE4O2zpkY',
    route: 'red-black-tree'
  },
];
