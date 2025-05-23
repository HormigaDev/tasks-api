export class Sizes {
    private static byte = 1;
    private static kilobyte = this.byte * 1024;
    private static megabyte = this.kilobyte * 1024;
    private static gigabyte = this.megabyte * 1024;
    private static terabyte = this.gigabyte * 1024;

    public static bytes(t: number) {
        return this.byte * t;
    }
    public static kilobytes(t: number) {
        return this.kilobyte * t;
    }
    public static megabytes(t: number) {
        return this.megabyte * t;
    }
    public static gigabytes(t: number) {
        return this.gigabyte * t;
    }
    public static terabytes(t: number) {
        return this.terabyte * t;
    }
}
