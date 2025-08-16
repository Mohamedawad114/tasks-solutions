/** node internals
 * # event loop : is the heart of Node.js. It enables non-blocking I/O by processing callbacks and managing the execution of asynchronous operations
 * 
 * # LIBUV : is a C library - that handles the event loop and I/O.
 * if the operation is non-blocking (like reading a file, network requests, DB access), Libuv handles it outside the main thread.
 * 
 * 
 * 
 *# Event Queue
 * All incoming requests are pushed to the Event Queue.
 * This queue is a FIFO (First-In-First-Out) structure.
 * Each request includes a callback function that should be executed after the operation is completed consider the response
 * 
 * callstack: Node uses it to excute sync operations.
 * 
 * callback :Once an async operation completes:
 * Its callback is placed in a queue.
 * The event loop picks it up when the main stack is empty.
 * 
 * 
 *  # thread pool : Node.js uses a thread pool (managed by Libuv) to handle CPU-intensive tasks and I/O operations. By default, it has four threads but it can be configured.
 *  !! In Node.js, the thread pool size can be adjusted using the UV_THREADPOOL_SIZE environment variable. The thread pool, provided by the libuv library, is used for tasks like file system operations, DNS lookups, and certain cryptographic functions.
 * 
 * 
 * Node.js Handles Blocking and Non-Blocking Code Execution uses a single-threaded event loop to run code. This means it can only do one thing at a time — but it handles non-blocking code smartly to stay fast and responsive.
 * 
 * when you perform a file I/O operation like fs.readFile(), Node.js:
 * Sends the request to Libuv.
 * Libuv handles it via the thread pool.
 * When finished, it puts the callback in the event queue.
 * The event loop checks the queue and executes the callback when the stack is clear.
 * This process ensures non-blocking behavior for file operations.
*  
 */