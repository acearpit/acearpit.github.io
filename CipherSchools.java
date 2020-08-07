/*
 * Copyright (c) --> Arpit
 * Date Created : 8/8/2020
 * Have A Good Day !
 */

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;
import java.util.Stack;

public class CipherSchools {
    
    public static void main(String[] args) throws IOException {
        
        Scanner r = new Scanner(System.in);
        PrintWriter out = new PrintWriter(System.out);
        
        int t = r.nextInt();
        
        while (t-- > 0) {
            
            char[] str = r.next().toCharArray();
            
            Stack<Character> st = new Stack<>();
            
            for (int i = 0; i < str.length; i++) {
                if (!st.isEmpty()) {
                    if (str[i] == ']' && st.peek() == '[') st.pop();
                    else if (str[i] == '}' && st.peek() == '{') st.pop();
                    else if (str[i] == ')' && st.peek() == '(') st.pop();
                    else st.push(str[i]);
                } else st.push(str[i]);
            }
            
            out.println(st.isEmpty() ? "YES" : "NO");
            
        }
        
        out.close();
        
    }
    
}
