var ParallelPortMemoryRange = function()
{
	this.u8 = {};
	this.u16 = {};
	this.u32 = {};
	
	const baseLength = ParallelPortMemoryRange.baseU8.length;
	function makeGetter(array, index)
	{
		return function() { return array[index]; }
	}
	for (var i = 0; i < baseLength; i++)
	{
		if (i % 4 == 0)
		{
			var index = i >>> 2;
			var getter = makeGetter(ParallelPortMemoryRange.baseU32, index);
			this.u32.__defineGetter__(index, getter);
		}
		
		if (i % 2 == 0)
		{
			var index = i >>> 1;
			var getter = makeGetter(ParallelPortMemoryRange.baseU16, index);
			this.u16.__defineGetter__(index, getter);
		}
		
		var getter = makeGetter(ParallelPortMemoryRange.baseU8, i);
		this.u8.__defineGetter__(i, getter);
	}
	
	for (var i = baseLength; i < 0x10000; i++)
	{
		if (i % 4 == 0)
			this.u32.__defineGetter__(i >>> 2, function() { return 0xFFFFFFFF; });
		
		if (i % 2 == 0)
			this.u16.__defineGetter__(i >>> 1, function() { return 0xFFFF; });
				
		this.u8.__defineGetter__(i, function() { return 0xFF; });
	}
	
	function accessError(addr)
	{
		return function()
		{
			console.warn("writing to parallel port range at " + addr.toString(16));
		}
	}
	
	for (var i = 0; i < 0x10000; i++)
	{
		if (i % 4 == 0)
			this.u32.__defineSetter__(i >>> 2, accessError(i));
		if (i % 2 == 0)
			this.u16.__defineSetter__(i >>> 1, accessError(i));
		this.u8.__defineSetter__(i, accessError(i));
	}
	
	this.u8.length = 0x10000;
	this.u16.length = 0x10000 >>> 1;
	this.u32.length = 0x10000 >>> 2;
};

(function()
{
	// stolen from FPSE's MEM.C file
	var extROMBase = [
		0xb4,0x00,0x00,0x1f,0x4c,0x69,0x63,0x65,0x6e,0x73,0x65,0x64,0x20,0x62,0x79,0x20,
		0x53,0x6f,0x6e,0x79,0x20,0x43,0x6f,0x6d,0x70,0x75,0x74,0x65,0x72,0x20,0x45,0x6e,
		0x74,0x65,0x72,0x74,0x61,0x69,0x6e,0x6d,0x65,0x6e,0x74,0x20,0x49,0x6e,0x63,0x2e,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0xb4,0x00,0x00,0x1f,0x4c,0x69,0x63,0x65,0x6e,0x73,0x65,0x64,0x20,0x62,0x79,0x20,
		0x53,0x6f,0x6e,0x79,0x20,0x43,0x6f,0x6d,0x70,0x75,0x74,0x65,0x72,0x20,0x45,0x6e,
		0x74,0x65,0x72,0x74,0x61,0x69,0x6e,0x6d,0x65,0x6e,0x74,0x20,0x49,0x6e,0x63,0x2e,
		0x00,0x00,0x00,0x00,0x08,0x00,0xe0,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00
	];
	
	var extROMBuffer = new ArrayBuffer(extROMBase.length);
	ParallelPortMemoryRange.baseU8 = new Uint8Array(extROMBuffer);
	ParallelPortMemoryRange.baseU16 = new Uint16Array(extROMBuffer);
	ParallelPortMemoryRange.baseU32 = new Uint32Array(extROMBuffer);
	
	for (var i = 0; i < extROMBase.length; i++)
		ParallelPortMemoryRange.baseU8[i] = extROMBase[i];
})();